import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api.js';
import { NotificationItem } from '../../types/index.js';

interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
};

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const res = await apiClient.get('/notifications');
  return res.data.data;
});

export const fetchUnreadCount = createAsyncThunk('notifications/fetchUnreadCount', async () => {
  const res = await apiClient.get('/notifications/unread-count');
  return res.data.data.unreadCount;
});

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id: string) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data.data;
  }
);

export const markAllNotificationsRead = createAsyncThunk('notifications/markAllRead', async () => {
  await apiClient.patch('/notifications/read-all');
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;
