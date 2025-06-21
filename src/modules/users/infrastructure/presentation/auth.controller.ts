import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowPublicAccess } from '@/shared/decorators/allow-public-access.decorator';
import { UserPresenter } from '../presenters/user.presenter';
import { UserFacade } from '../user.facade';
import { Inject } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Inject(UserFacade.name)
  private userFacade: UserFacade;

  @Post('login')
  @AllowPublicAccess()
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({
    status: 200,
    schema: { example: { accessToken: 'jwt-token', user: {} } },
  })
  async login(
    @Body() input: LoginRequestDto,
  ): Promise<{ accessToken: string; user: any }> {
    const { accessToken, user } =
      await this.userFacade.loginUseCase.execute(input);

    return {
      accessToken,
      user: UserPresenter.toPresenter(user),
    };
  }
}
