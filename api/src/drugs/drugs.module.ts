import { Module } from '@nestjs/common';
import { DrugsController } from './controllers/drugs.controller';
import { DrugsService } from './services/drugs.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drug, DrugSymptom, Symptom, SymptomSynonym } from './entities/drugs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drug, Symptom, DrugSymptom, SymptomSynonym]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [DrugsController],
  providers: [DrugsService],
})
export class DrugsModule {}
