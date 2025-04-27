import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Drug,
  DrugSymptom,
  Symptom,
  SymptomSynonym,
} from '../entities/drugs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DrugsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Drug)
    private readonly drugRepository: Repository<Drug>,
    @InjectRepository(Symptom)
    private readonly symptomRepository: Repository<Symptom>,
    @InjectRepository(DrugSymptom)
    private readonly drugSymptomRepository: Repository<DrugSymptom>,
  ) {}

  async findDrugSymptoms(drugName: string): Promise<any> {
    // It checkes if the drug and its symptoms and synonyms of the symptoms already exist in the database
    const existingDrug = await this.drugRepository.findOne({
      where: { drugName },
      relations: ['drugSymptoms', 'drugSymptoms.symptom', 'synonyms'],
    });

    //If it exists, it returns the drug name, symptoms and synonyms
    if (existingDrug) {
      return {
        drugName: existingDrug.drugName,
        symptoms: await Promise.all(
          existingDrug.drugSymptoms.map(async (ds) => ({
            indicationName: (await ds.symptom).symptomName,
            code: (await ds.symptom).code,
          })),
        ),
        SymptomsSynonyms: existingDrug.synonyms.map(
          (synomym) => synomym.synonymSymptom,
        ),
      };
    }

    // STARTS THE SCRAPING PROCESS HERE
    //IF DOES NOT EXIST, IT WILL REQUEST THE SCRAPPER TO GET THE SYMPTOMS
    const scrapperUrlFromDailyMed = `${this.configService.get('SCRAPPER_URL')}/${drugName}`;

    // Call the scrapper api
    const scrapperResponseWithIndications = await lastValueFrom(
      this.httpService.get(scrapperUrlFromDailyMed),
    );

    // Check if the response contains data or if the return is an empty list, which would mean the drug was not found or does not exist.
    if (
      !scrapperResponseWithIndications.data.data ||
      scrapperResponseWithIndications.data.data.length === 0
    ) {
      // In case, return a function with a message indicating that the drug was not found
      return { message: 'Drug not found' };
    }

    // 3 arrays that will be populated with the symptoms and synonyms
    const symptoms = [];
    const symptomsWITHOUTCode = [];
    const SymptomsNOTfound = [];

    // Function to check if the symptom code exists in the scrapper from National Institute of Health API
    // If the symptom code exists, it will save in the list of symptoms and return true
    // if not exist, it will return false
    const checkSymptonCode = async (indicationFromScrapper: string) => {
      try {
        const indicationsFromScrapperUrl = `${this.configService.get<string>('SCRAPPER_SYMPTOMS_CODE_URL')}/${indicationFromScrapper}`;

        const symptomResponse = await lastValueFrom(
          this.httpService.get(indicationsFromScrapperUrl),
        );

        if (symptomResponse.data[1].length) {
          symptoms.push({
            indicationName: indicationFromScrapper,
            code: symptomResponse.data[1][0].slice(0, 3),
          });
        } else {
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    };

    // SCRAPPER WILL START HERE
    // Check if the list of symptoms from DailyMed exist on the scrapper from NIH
    if (scrapperResponseWithIndications.data.data.length > 0) {
      const promises = scrapperResponseWithIndications.data.data.map(
        async (indicationFromScrapper) => {
          // If yes, the checkSymptonCode will set the symptom in the list of symptoms
          const result = await checkSymptonCode(indicationFromScrapper);

          // If not, it will be added to the list of symptomsWITHOUTCode to be checked on LLM scrapper later
          if (!result) {
            symptomsWITHOUTCode.push(indicationFromScrapper);
          }
        },
      );

      await Promise.all(promises);
    }

    // LLM SCRAPPER WILL START HERE
    if (symptomsWITHOUTCode.length > 0) {
      for (const symptomName of symptomsWITHOUTCode) {
        SymptomsNOTfound.push(symptomName);

        const llmUrl = `${this.configService.get('LLM_URL')}/${symptomName}`;

        // Check the suggestions of the symptom name not found in the NIH
        try {
          const llmResponse = await lastValueFrom(this.httpService.get(llmUrl));
          for (const synonym of llmResponse.data.response) {
            // Check if the synonym from LLM exist as a symptom code in the checkSymptonCode function
            // If it exists, the checkSymptonCode function will add to symptom list and return true
            const result = await checkSymptonCode(synonym);

            // If it does not exist, it will be added to the list of symptomsNOTinDailyMed
            if (!result) {
              SymptomsNOTfound.push(synonym);
            }
          }
        } catch (error) {
          SymptomsNOTfound.push(symptomName);
        }
      }
    }

    // THE PROCESS OF SAVING WILL START HERE
    const drugJustSaved = this.drugRepository.create({ drugName });
    const savedDrug = await this.drugRepository.save(drugJustSaved);

    // Save synonyms that were not found in the database
    const drugSynonymsToSave = SymptomsNOTfound.map((synonymName) =>
      this.drugRepository.manager.create(SymptomSynonym, {
        synonymSymptom: synonymName, // Changed to synonymSymptom
        drug: savedDrug,
      }),
    );

    await this.drugRepository.manager.save(drugSynonymsToSave);

    // Relation between drug and symptoms
    await Promise.all(
      symptoms.map(async (sympton) => {
        let symptomEntity = await this.symptomRepository.findOne({
          where: { symptomName: sympton.indicationName },
        });

        if (!symptomEntity) {
          symptomEntity = this.symptomRepository.create({
            symptomName: sympton.indicationName,
            code: sympton.code,
          });
          symptomEntity = await this.symptomRepository.save(symptomEntity);
        }

        const drugSymptom = this.drugSymptomRepository.create({
          drug: savedDrug,
          symptom: symptomEntity,
        });

        await this.drugSymptomRepository.save(drugSymptom);
      }),
    );

    // Return the data
    return {
      drugName: savedDrug.drugName,
      symptoms: symptoms.map((s) => ({
        indicationName: s.indicationName,
        code: s.code,
      })),
      SymptomsSynonyms: SymptomsNOTfound,
    };
  }
}
