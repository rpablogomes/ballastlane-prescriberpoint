import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrugsModule } from './drugs/drugs.module';
import {
  Drug,
  Symptom,
  Synonym,
  DrugSymptom,
} from './drugs/entities/drugs.entity';
import { DrugsController } from './drugs/controllers/drugs.controller';
import { DrugsService } from './drugs/services/drugs.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'prescriptionpoint',
      password: 'prescriptionpoint',
      database: 'prescriptionpoint',
      entities: [Drug, Symptom, Synonym, DrugSymptom],
      synchronize: true,
    }),
    DrugsModule,
  ],
})
export class AppModule {}
