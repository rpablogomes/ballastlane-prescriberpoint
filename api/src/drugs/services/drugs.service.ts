import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DrugsService {
  constructor(private readonly httpService: HttpService) {}

  async findDrug(name: string): Promise<any> {
    return;
    //service to get drug recomendations is made here
  }
}
