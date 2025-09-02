import { Request, Response } from 'express';

export async function startPayment(req: Request, res: Response) {
  const { plan } = req.body as { plan: 'start'|'family'|'pro' };
  return res.json({ status: 'ok', plan, transactionId: `mock_${Date.now()}` });
}
