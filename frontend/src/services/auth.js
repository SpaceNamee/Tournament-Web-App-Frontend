import api from "./api";
import { setAuthToken } from "./api";

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await api.post("/token", formData);
  
  const { access_token, user_id } = res.data;
  setAuthToken(access_token);

  localStorage.setItem("token", access_token);
  localStorage.setItem("user_id", user_id);

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  setAuthToken(null);
};

export const getCurrentUser = () => {
  return {
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id"),
  };
};
