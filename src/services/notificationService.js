import API from "./api";

export const getNotifications = () =>
  API.get("/notifications");

export const markAsRead = (id) =>
  API.put(`/notifications/${id}/read`);

export const markAllNotificationsAsRead = () =>
  API.put("/notifications/read-all");

// export const markNotificationsByContent = (id) =>
//   API.put(`/notifications/content/${id}/read`);

export const markNotificationsByContent = (contentId) =>
  API.put(`/notifications/content/${contentId}/read`);

const notificationsService = {
  getNotifications,
  markAsRead
};

export const getRecentActivity = () =>
  API.get("/notifications/recent");

export default notificationsService;