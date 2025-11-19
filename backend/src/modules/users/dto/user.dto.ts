import { z } from 'zod';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export const CreateUserDtoSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const validateUniqueEmail = async (email: string, usersRepository: Repository<User>): Promise<boolean> => {
    const user = await usersRepository.findOne({ where: { email } });
    return !user;
};

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
