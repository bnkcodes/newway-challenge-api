import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Patch,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';

import { AllowPublicAccess, Authenticated, Role } from '@/shared/decorators';
import { CollectionInput } from '@/shared/infra/dto/collection.dto';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ListUsersInput } from './dtos/list-users.dto';

import {
  UserCollectionPresenter,
  UserPresenter,
  UserPresenterWrapper,
} from '../presenters/user.presenter';

import { UserFacade } from '../user.facade';

@ApiBearerAuth()
@Controller('/users')
export class UsersController {
  @Inject(UserFacade.name)
  private userFacade: UserFacade;

  @Post('/')
  @AllowPublicAccess()
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserPresenterWrapper,
  })
  async createUser(
    @Body() input: CreateUserDto,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.createUserUseCase.execute({
      name: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário autenticado',
    type: UserPresenterWrapper,
  })
  async getMe(@Authenticated() user: any): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.getUserUseCase.execute({
      id: user.id,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Get('/:id')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obter usuário por ID (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserPresenterWrapper,
  })
  async getUser(@Param('id') id: string): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.getUserUseCase.execute({ id });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Get('/')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar usuários (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    type: UserCollectionPresenter,
  })
  async listUsers(
    @Query() filter?: ListUsersInput,
    @Query() queryParams?: CollectionInput,
  ): Promise<UserCollectionPresenter> {
    const data = await this.userFacade.listUsersUseCase.execute({
      filter: {
        ...filter,
      },
      paging: {
        page: queryParams?.page || 1,
        pageSize: queryParams?.pageSize || 10,
      },
      sorting: {
        field: queryParams?.sortBy ?? 'name',
        direction:
          queryParams?.sortDirection?.toLowerCase() === 'desc' ? 'desc' : 'asc',
      },
    });

    return new UserCollectionPresenter(
      UserPresenter.toManyPresenter(data.users),
      data.totalCount,
      data.page,
      data.pageSize,
    );
  }

  @Put('/me')
  @ApiOperation({ summary: 'Atualizar usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado',
    type: UserPresenterWrapper,
  })
  async updateMe(
    @Authenticated() user: any,
    @Body() input: UpdateUserDto,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.updateUserUseCase.execute({
      id: user.id,
      ...input,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Put('/:id')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar usuário por ID (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado',
    type: UserPresenterWrapper,
  })
  async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.updateUserUseCase.execute({
      id,
      ...input,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Patch('/me/deactivate')
  @ApiOperation({ summary: 'Desativar conta do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuário desativado',
    type: UserPresenterWrapper,
  })
  async deactivateMe(
    @Authenticated() user: any,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.updateUserUseCase.execute({
      id: user.id,
      isActive: false,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Patch('/me/upload-image')
  @ApiOperation({ summary: 'Fazer upload de imagem do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Imagem enviada',
    type: UserPresenterWrapper,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMyImage(
    @Authenticated() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1000 * 1000 }), // 3MB
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.uploadImageUseCase.execute({
      id: user.id,
      file,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Patch('/:id/upload-image')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Fazer upload de imagem por ID (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Imagem enviada',
    type: UserPresenterWrapper,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1000 * 1000 }), // 3MB
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.uploadImageUseCase.execute({
      id,
      file,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Patch('/me/delete-image')
  @ApiOperation({ summary: 'Remover imagem do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Imagem removida',
    type: UserPresenterWrapper,
  })
  async deleteMyImage(
    @Authenticated() user: any,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.deleteImageUseCase.execute({
      id: user.id,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Patch('/:id/delete-image')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover imagem do usuário por ID (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Imagem removida',
    type: UserPresenterWrapper,
  })
  async deleteImage(@Param('id') id: string): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.deleteImageUseCase.execute({
      id,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Patch('/:id/activate')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ativar usuário por ID (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário ativado',
    type: UserPresenterWrapper,
  })
  async activateUser(@Param('id') id: string): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.updateUserUseCase.execute({
      id,
      isActive: true,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Patch('/:id/deactivate')
  @Role(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar usuário por ID (apenas admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário desativado',
    type: UserPresenterWrapper,
  })
  async deactivateUser(@Param('id') id: string): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.updateUserUseCase.execute({
      id,
      isActive: false,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }
}
