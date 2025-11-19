import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoSchema, validateUniqueEmail } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const validation = CreateUserDtoSchema.safeParse(createUserDto);
        if (!validation.success) {
            throw new BadRequestException(validation.error.message);
        }

        const isUnique = await validateUniqueEmail(createUserDto.email, this.usersRepository);
        if (!isUnique) {
            throw new BadRequestException('El email ya está registrado');
        }

        return this.usersService.create(createUserDto);
    }

    @Get()
    async findOne(@Query('email') email: string) {
        if (email) {
            return this.usersService.findOneByEmail(email);
        }
        return this.usersService.findAll();
    }
}
