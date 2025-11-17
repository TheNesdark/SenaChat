import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

// Creamos un tipo para el contexto de validación
type ValidationContext = {
  usersRepository?: Repository<User>;
};

// Esquema para login
export const LoginDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Esquema para registro con validación de unicidad
export const RegisterDtoSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Función para validar unicidad de email (se usará en el controlador)
export const validateUniqueEmail = async (email: string, usersRepository: Repository<User>): Promise<boolean> => {
  const user = await usersRepository.findOne({ where: { email } });
  return !user; // Retorna true si el email es único
};

// Tipos inferidos de los esquemas
export type LoginDto = z.infer<typeof LoginDtoSchema>;
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;