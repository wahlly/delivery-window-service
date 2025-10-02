import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryHoursController } from './delivery-hours.controller';

describe('DeliveryHoursController', () => {
  let controller: DeliveryHoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryHoursController],
    }).compile();

    controller = module.get<DeliveryHoursController>(DeliveryHoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
