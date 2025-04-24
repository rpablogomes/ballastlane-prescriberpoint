import { Module } from '@nestjs/common';
import { DrugsController } from './controllers/drugs.controller';
import { DrugsService } from './services/drugs.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [DrugsController],
  providers: [DrugsService],
})
export class DrugsModule {}
