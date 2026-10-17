import { Request, Response } from 'express';
import { Notification } from '../models/Notification.js';

export const notificationController = {
  async getNotifications(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { limit = '20' } = req.query;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string, 10));

    res.json({ success: true, data: notifications });
  },

  async markAsRead(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found.' });
      return;
    }

    res.json({ success: true, data: notification });
  },

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });

    res.json({ success: true, message: 'All notifications marked as read.' });
  },

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const count = await Notification.countDocuments({ recipient: userId, isRead: false });

    res.json({ success: true, data: { unreadCount: count } });
  },
};
