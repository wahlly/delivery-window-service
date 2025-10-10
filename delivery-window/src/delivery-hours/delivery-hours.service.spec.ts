import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryHoursService } from './delivery-hours.service';

describe('DeliveryHoursService', () => {
  let service: DeliveryHoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryHoursService],
    }).compile();

    service = module.get<DeliveryHoursService>(DeliveryHoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
