import { User } from '@/user/decorators/user.decorator';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { LoginUserDto } from '@/user/dto/loginUser.dto';
import { AuthGuard } from '@/user/guards/auth.guard';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { UserService } from '@/user/user.service';
import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<IUserResponse> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
    return this.userService.loginUser(loginUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user): Promise<IUserResponse> {
    return this.userService.generateUserResponse(user);
  }
}
