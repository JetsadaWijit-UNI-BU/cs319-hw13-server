import { type Request, type Response } from "express";
import { userService } from "./service.js";

// User HTTP handler: request → service → response.
export const userHandlers = {
  getProfile: async (req: Request, res: Response) => {
    const userId = String(req.params.userId);
    const profile = await userService.getProfile(userId);
    if (!profile) {
      res.status(404).json({ success: false, message: "ไม่พบผู้ใช้" });
      return;
    }
    res.json({ success: true, data: profile });
  },
};
