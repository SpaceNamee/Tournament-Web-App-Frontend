import api from "./api";

export const getAllActiveTeams = async (page = 1, perPage = 6) => {
  const res = await api.get("/teams/all_active", {
    params: { page, perPage },
  });
  return res.data;
};

export const joinTeam = async (teamId, password = null) => {
  const res = await api.post("/teams/join", {
    team_id: teamId,
    password,
  });
  return res.data;
};

export const leaveTeam = async (teamId) => {
  const res = await api.post("/teams/leave", {
    team_id: teamId,
  });
  return res.data;
};

export const deleteTeam = async (teamId) => {
  const res = await api.delete(`/teams/delete/${teamId}`);
  return res.data;
};

export const getTeamById = async (teamId) => {
  const res = await api.get(`/teams/${teamId}`);
  return res.data;
};
