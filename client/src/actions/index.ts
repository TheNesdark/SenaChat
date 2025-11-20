import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const server = {
    register: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
            email: z.string().email("Email inválido"),
            password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        }),
        handler: async (input, context) => {
            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(input),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                const token = jwt.sign({ id: data.id, name: data.name, email: data.email }, 'secretKey', {
                    expiresIn: '1h',
                });

                context.cookies.set('token', token, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    maxAge: 3600,
                });

                return { success: true };
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error('An unexpected error occurred');
            }
        },
    }),
    login: defineAction({
        accept: 'form',
        input: z.object({
            email: z.string().email("Email inválido"),
            password: z.string().min(1, "La contraseña es requerida"),
        }),
        handler: async ({ email, password }, context) => {
            try {
                const response = await fetch(`http://localhost:3000/users?email=${email}`);

                if (!response.ok) {
                    throw new Error('Credenciales inválidas');
                }

                const users = await response.json();
                const user = Array.isArray(users) ? users[0] : users;

                if (!user) {
                    throw new Error('Credenciales inválidas');
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    throw new Error('Credenciales inválidas');
                }

                const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, 'secretKey', {
                    expiresIn: '1h',
                });

                context.cookies.set('token', token, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    maxAge: 3600,
                });

                return { success: true };
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error('An unexpected error occurred');
            }
        },
    }),
    logout: defineAction({
        accept: 'form',
        handler: async (_, context) => {
            context.cookies.delete('token');
            return { success: true };
        },
    }),
};
