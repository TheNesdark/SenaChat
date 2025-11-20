/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
        user?: {
            id: number;
            name: string;
            email: string;
            iat: number;
            exp: number;
        };
    }
}
