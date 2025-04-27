import { Controller, Get, Param } from '@nestjs/common';
import { DrugsService } from '../services/drugs.service';

@Controller('/api/drug')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Get('/:drug')
  findTheDrugSymptoms(@Param('drug') drug: string) {
    return this.drugsService.findDrugSymptoms(drug);
  }
}
