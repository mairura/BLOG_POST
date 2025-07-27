import { CreateUserDto } from '@/user/dto/createUser.dto';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'User with this email or username already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const savedUser = await this.userRepository.save(newUser);
    return this.generateUserResponse(savedUser);
  }

  generateToken(user: UserEntity): string {
    const generatedToken = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    return generatedToken;
  }

  generateUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
