export type ReferralInfo = { referrerId: number; invitedUserId: number; paid: boolean };
export const referrals = new Map<number, ReferralInfo>();

export function setReferrer(invitedUserId: number, referrerId: number) {
  if (!referrals.has(invitedUserId)) referrals.set(invitedUserId, { referrerId, invitedUserId, paid: false });
}
export function markPaid(invitedUserId: number) {
  const r = referrals.get(invitedUserId); if (r) r.paid = true;
}
export function getReferrer(invitedUserId: number) { return referrals.get(invitedUserId)?.referrerId; }
