import { type Request, type Response } from "express";
import { z } from "zod";
import { authService } from "./service.js";
import { loginSchema, registerSchema } from "./schemas.js";

// Auth HTTP handler: request → service → response.
export const authHandlers = {
  login: async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
      return;
    }
    const { email, password } = parsed.data;
    const user = await authService.login(email, password);
    if (!user) {
      res.status(401).json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      return;
    }
    res.json({ success: true, message: "เข้าสู่ระบบสำเร็จ", data: user });
  },

  register: async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
      return;
    }
    const { email, password, name } = parsed.data;
    const user = await authService.register({ email, password, name });
    if (!user) {
      res.status(409).json({ success: false, message: "อีเมลนี้มีผู้ใช้งานแล้ว" });
      return;
    }
    res.status(201).json({ success: true, message: "สมัครสมาชิกสำเร็จ", data: user });
  },
};
