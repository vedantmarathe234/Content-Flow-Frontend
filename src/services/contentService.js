import API from "./api";

export const getAllContent = () =>
  API.get("/content");


export const createContent = (formData) =>
  API.post("/content", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


export const deleteContent = (id) =>
  API.delete(`/content/${id}`);

export const getAllTeams = () =>
  API.get("/teams/all");

/* ADD THESE */

export const leaderApprove = (id) =>
  API.put(`/content/${id}/leader-approve`);

export const leaderReject = (id) =>
  API.put(`/content/${id}/leader-reject`);

export const getPendingContent = () =>
  API.get("/content/status/PENDING");

export const getContentById = (id) =>
  API.get(`/content/${id}`);

export const updateContent = (
  id,
  formData
) =>
  API.put(
    `/content/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );


  export const getDashboardStats = () =>
  API.get("/content/dashboard/stats");

  export const getMyDashboardStats = () =>
  API.get("/content/dashboard/my-stats");

  export const getTeamDashboardStats = (teamId) =>
  API.get(`/content/dashboard/team/${teamId}`);

export const getContentByTeamId = (teamId) => {
  return API.get(`/content/team/${teamId}/list`);
};
  export const getMyContents = () => {
  return API.get("/content/my");
};
