import { Test, TestingModule } from '@nestjs/testing';
import { DrugsService } from '../services/drugs.service';
import { DrugsController } from './drugs.controller';

describe('DrugsController', () => {
  let controller: DrugsController;
  let service: DrugsService;

  beforeEach(async () => {
    const mockDrugsService = {
      findOne: jest.fn().mockImplementation((drug: string) => [
        {
          name: 'Drug Name',
          code: 'Drug Description',
          synonyms: ['Synonym1', 'Synonym2'],
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugsController],
      providers: [
        {
          provide: DrugsService,
          useValue: mockDrugsService,
        },
      ],
    }).compile();

    controller = module.get<DrugsController>(DrugsController);
    service = module.get<DrugsService>(DrugsService);
  });
});
