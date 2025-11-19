import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const server = {
    register: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
            email: z.string().email("Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters"),
        }),
        handler: async (input) => {
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

                return data;
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
            email: z.string().email("Invalid email address"),
            password: z.string().min(1, "Password is required"),
        }),
        handler: async ({ email, password }, context) => {
            try {
                const response = await fetch(`http://localhost:3000/users?email=${email}`);

                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }

                const users = await response.json();
                const user = Array.isArray(users) ? users[0] : users;

                if (!user) {
                    throw new Error('Invalid credentials');
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    throw new Error('Invalid credentials');
                }

                const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', {
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
};
