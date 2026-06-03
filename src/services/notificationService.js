import API from "./api";

export const getNotifications = () =>
  API.get("/notifications");

export const markAsRead = (id) =>
  API.put(`/notifications/${id}/read`);

const notificationsService = {
  getNotifications,
  markAsRead
};

export default notificationsService;