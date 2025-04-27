import {
  Drug,
  DrugSymptom,
  Symptom,
  SymptomSynonym,
} from '../drugs/entities/drugs.entity';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'prescriberpoint',
  password: 'prescriberpoint',
  database: 'prescriberpoint',
  entities: [Drug, Symptom, DrugSymptom, SymptomSynonym],
  synchronize: true,
});

export default dataSource;
