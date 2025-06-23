import { Controller, Get } from '@nestjs/common';
import { AllowPublicAccess } from '@/shared/decorators';

@Controller('health')
export class HealthController {
  @Get()
  @AllowPublicAccess()
  check() {
    return { status: 'ok' };
  }
}
