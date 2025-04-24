import { Controller, Get, Param } from '@nestjs/common';
import { DrugsService } from '../services/drugs.service';

@Controller('drug')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Get(':drug')
  findOne(@Param('drug') drug: string) {
    return this.drugsService.findDrug(drug);
  }
}
