import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
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

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ListUsersInput } from './dtos/list-users.dto';
import { CollectionInput } from '@/shared/infra/dto/collection.dto';

import {
  UserCollectionPresenter,
  UserPresenter,
  UserPresenterWrapper,
} from '../presenters/user.presenter';

import { UserFacade } from '../user.facade';

@Controller('/users')
export class UsersController {
  @Inject(UserFacade.name)
  private userFacade: UserFacade;

  @Post('/')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: UserPresenterWrapper })
  async createUser(
    @Body() input: CreateUserDto,
  ): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.createUserUseCase.execute({
      name: input.name,
      email: input.email,
      password: input.password,
    });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserPresenterWrapper })
  async getUser(@Param('id') id: string): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.getUserUseCase.execute({ id });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: 200, type: UserCollectionPresenter })
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

  @Put('/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UserPresenterWrapper })
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

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.userFacade.deleteUserUseCase.execute(id);

    return { success: true };
  }

  @Patch('/:id/upload-image')
  @ApiOperation({ summary: 'Upload user image' })
  @ApiResponse({ status: 200, type: UserPresenterWrapper })
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

  @Patch('/:id/delete-image')
  @ApiOperation({ summary: 'Delete user image' })
  @ApiResponse({ status: 200, type: UserPresenterWrapper })
  async deleteImage(@Param('id') id: string): Promise<UserPresenterWrapper> {
    const data = await this.userFacade.deleteImageUseCase.execute({ id });

    return {
      user: UserPresenter.toPresenter(data.user),
    };
  }
}
