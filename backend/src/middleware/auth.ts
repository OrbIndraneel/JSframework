import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';
import { User, UserRole } from '../models/User.js';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string;
  isVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid format.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('role email isVerified isActive');
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated or no longer exists.',
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      isVerified: user.isVerified,
    };

    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}]. Your role is '${req.user.role}'.`,
      });
      return;
    }

    next();
  };
};

export const requireVerified = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthenticated request.' });
    return;
  }

  // Placement officers are always trusted; students default verified or active
  if (req.user.role === 'placement_officer' || req.user.isVerified) {
    return next();
  }

  res.status(403).json({
    success: false,
    message: 'Your account is pending verification by the College Placement Office.',
  });
};
