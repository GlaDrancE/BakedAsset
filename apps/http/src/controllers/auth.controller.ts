import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.ts";


export class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async me(req: Request, res: Response) {
        const userId = req.auth?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await this.authService.getUser(userId);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            whatsapp: user.whatsapp,
        })
    }
    async signUp(req: Request, res: Response) {
        const { email, password, name, phone, whatsapp } = req.body;
        const { accessToken, refreshToken, user } = await this.authService.createUser({ email, password, name, phone, whatsapp });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            accessToken,
            user,
        })
    }
    async signIn(req: Request, res: Response) {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await this.authService.signIn({ email, password });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            accessToken,
            user,
        })
    }
}