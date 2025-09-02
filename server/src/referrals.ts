import { Request, Response } from 'express';

export async function claimReferral(req: Request, res: Response) {
  const { code } = req.body as { code: string };
  return res.json({ status: 'ok', code, reward: 50 });
}
