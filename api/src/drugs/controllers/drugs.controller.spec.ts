import { Test, TestingModule } from '@nestjs/testing';
import { DrugsService } from '../services/drugs.service';
import { DrugsController } from './drugs.controller';

describe('DrugsController', () => {
  let controller: DrugsController;
  let service: DrugsService;

  beforeEach(async () => {
    const mockDrugsService = {
      findDrugSymptoms: jest.fn().mockImplementation((drugName: string) => {
        if (drugName === 'AnyDrugNameToForceAnError') {
          return { message: 'Drug not found' };
        }
        return {
          drugName: 'Dupixent',
          symptoms: [
            { indicationName: 'Prurigo Nodularis', code: 'L28' },
            { indicationName: 'Eosinophilic Esophagitis', code: 'K20' },
            { indicationName: 'Atopic Dermatitis', code: 'L20' },
            {
              indicationName: 'Chronic Obstructive Pulmonary Disease',
              code: 'J44',
            },
            { indicationName: 'Asthma', code: 'J45' },
          ],
          SymptonsSynonyms: ['Chronic Rhinosinusitis with Nasal Polyps'],
        };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugsController],
      providers: [
        {
          provide: DrugsService,
          useValue: mockDrugsService,
        },
      ],
    }).compile();

    controller = module.get<DrugsController>(DrugsController);
    service = module.get<DrugsService>(DrugsService);
  });

  it('should return Dupixent drug information with symptoms and synonyms', async () => {
    const drugName = 'Dupixent';
    const result = await controller.findTheDrugSymptoms(drugName);

    expect(result).toEqual({
      drugName: 'Dupixent',
      symptoms: [
        { indicationName: 'Prurigo Nodularis', code: 'L28' },
        { indicationName: 'Eosinophilic Esophagitis', code: 'K20' },
        { indicationName: 'Atopic Dermatitis', code: 'L20' },
        {
          indicationName: 'Chronic Obstructive Pulmonary Disease',
          code: 'J44',
        },
        { indicationName: 'Asthma', code: 'J45' },
      ],
      SymptonsSynonyms: ['Chronic Rhinosinusitis with Nasal Polyps'],
    });
  });

  it('should return "Drug not found" for a weird drug name', async () => {
    const drugName = 'AnyDrugNameToForceAnError';
    const result = await controller.findTheDrugSymptoms(drugName);

    expect(result).toEqual({
      message: 'Drug not found',
    });
  });
});
