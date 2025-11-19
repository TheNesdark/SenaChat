import { defineMiddleware } from "astro:middleware";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ['/Login', '/register', '/api/auth/login', '/api/auth/register'];

export const onRequest = defineMiddleware(async (context, next) => {
    const { request, cookies, redirect, url } = context;

    if (PUBLIC_ROUTES.includes(url.pathname)) {
        return next();
    }

    const token = cookies.get("token")?.value;

    if (!token) {
        return redirect("/Login");
    }

    try {
        const decoded = jwt.verify(token, "secretKey");
        context.locals.user = decoded;
        return next();
    } catch (error) {
        return redirect("/Login");
    }
});
