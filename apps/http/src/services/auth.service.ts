import { prisma } from "@repo/db";
import type { SignIn, SignUp } from "@repo/types";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token-generation.ts";

export class AuthService {
    async getUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return null;
        }
        return user;
    }
    async createUser(data: SignUp) {
        if (!data.email || !data.password || !data.name) {
            throw new Error("Invalid data");
        }
        const exsitingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (exsitingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        console.log(hashedPassword)
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                phone: data.phone,
                password: hashedPassword,
                whatsapp: data.whatsapp
            },
        });
        if (!user) {
            throw new Error("Failed to create user");
        }
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                whatsapp: user.whatsapp,
            }
        }
    }
    async signIn(data: SignIn) {
        if (!data.email || !data.password) {
            throw new Error("Invalid data");
        }
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                whatsapp: user.whatsapp,
            }
        }
    }
    async refreshToken(refreshToken: string) {
        const decoded = verifyToken(refreshToken) as { userId: string };
        if (!decoded) {
            throw new Error("Invalid refresh token");
        }
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const accessToken = generateAccessToken(user.id);
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                whatsapp: user.whatsapp,
            }
        }
    }
}