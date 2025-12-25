"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const userRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ msg: "Username and password required" });
        }
        const existUser = yield prisma.user.findUnique({
            where: { username: username },
        });
        if (existUser) {
            return res.status(409).json({ msg: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: { username, password: hashedPassword },
        });
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            return res.status(500).json({ msg: "JWT secret missing" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, {
            expiresIn: "1h",
        });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(201).json({ msg: "User created successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const valid = yield bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.json({ msg: "Logged in successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
}));
exports.default = userRouter;
