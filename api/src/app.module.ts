import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrugsModule } from './drugs/drugs.module';
import {
  Drug,
  Symptom,
  DrugSymptom,
  SymptomSynonym,
} from './drugs/entities/drugs.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'prescriberpoint',
      password: 'prescriberpoint',
      database: 'prescriberpoint',
      entities: [Drug, Symptom, DrugSymptom, SymptomSynonym],
      synchronize: true,
    }),

    HttpModule,
    DrugsModule,
  ],
})
export class AppModule {}
