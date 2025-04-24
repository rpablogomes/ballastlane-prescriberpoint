import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Drug {
  @PrimaryGeneratedColumn()
  id_drug: number;

  @Column()
  drug_name: string;

  @OneToMany(() => DrugSymptom, (ds) => ds.drug)
  indications: DrugSymptom[];
}

@Entity()
export class Symptom {
  @PrimaryGeneratedColumn()
  id_symptom: number;

  @Column()
  symptoms: string;

  @Column()
  code: string;

  @OneToMany(() => DrugSymptom, (ds) => ds.symptom)
  drugIndications: DrugSymptom[];

  @OneToMany(() => Synonym, (s) => s.symptom)
  synonyms: Synonym[];
}

@Entity()
export class Synonym {
  @PrimaryGeneratedColumn()
  id_synonym: number;

  @Column()
  name: string;

  @Column({ default: false })
  confirmation: boolean;

  @ManyToOne(() => Symptom, (symptom) => symptom.synonyms)
  symptom: Symptom;
}

@Entity()
export class DrugSymptom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Drug, (drug) => drug.indications)
  drug: Drug;

  @ManyToOne(() => Symptom, (symptom) => symptom.drugIndications)
  symptom: Symptom;
}
