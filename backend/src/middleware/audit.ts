import { Request } from 'express';
import { AuditLog } from '../models/AuditLog.js';

export const logAudit = async (
  req: Request,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    if (!req.user) return;
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

    await AuditLog.create({
      actor: req.user.id,
      actorRole: req.user.role,
      actorEmail: req.user.email,
      action,
      resourceType,
      resourceId: resourceId || '',
      details: details || {},
      ipAddress,
    });
  } catch (err: any) {
    console.error('Failed to write audit log:', err.message);
  }
};
