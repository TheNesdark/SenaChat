import { defineMiddleware } from "astro:middleware";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ['/login', '/register'];

export const onRequest = defineMiddleware(async (context, next) => {
    const { request, cookies, redirect, url } = context;

    if (PUBLIC_ROUTES.includes(url.pathname)) {
        return next();
    }

    const token = cookies.get("token")?.value;

    if (!token) {
        return redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, "secretKey");
        context.locals.user = decoded;
        return next();
    } catch (error) {
        return redirect("/login");
    }
});
