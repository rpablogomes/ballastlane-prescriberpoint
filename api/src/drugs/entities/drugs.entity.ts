    import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      OneToMany,
      ManyToOne,
      CreateDateColumn,
      UpdateDateColumn,
    } from 'typeorm';

    @Entity()
    export class Drug {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      drugName: string;

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;

      @OneToMany(() => DrugSymptom, (ds) => ds.drug)
      drugSymptoms: DrugSymptom[];

      @OneToMany(() => SymptomSynonym, (synonym) => synonym.drug, { cascade: true })
      synonyms: SymptomSynonym[];
    }

    @Entity()
    export class Symptom {
      @PrimaryGeneratedColumn()
      id: number;

      @Column({ nullable: true })
      symptomName: string;

      @Column({ nullable: true })
      code: string;

      @OneToMany(() => DrugSymptom, (ds) => ds.symptom)
      drugSymptoms: DrugSymptom[];
    }

    @Entity()
    export class DrugSymptom {
      @PrimaryGeneratedColumn()
      id: number;

      @ManyToOne(() => Drug, (drug) => drug.drugSymptoms, {
        onDelete: 'CASCADE',
      })
      drug: Drug;

      @ManyToOne(() => Symptom, (symptom) => symptom.drugSymptoms, {
        onDelete: 'CASCADE',
      })
      symptom: Symptom;
    }

    @Entity()
    export class SymptomSynonym {
      @PrimaryGeneratedColumn()
      id: number;

      @Column({ nullable: true })
      synonymSymptom: string; 

      @ManyToOne(() => Drug, (drug) => drug.synonyms, {
        onDelete: 'CASCADE',
      })
      drug: Drug;
    }
