// src/api/auth.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  Authorization: `Token ${localStorage.getItem("token")}`,
});

// ✅ Kayıt
export const registerUser = (data) => {
  return axios.post(`${API}/accounts/register/`, data);
};

// ✅ Giriş
export const loginUser = (data) => {
  return axios.post(`${API}/accounts/login/`, data);
};

// ✅ Giriş / Kayıt sonrası doğrulama kodu
export const verifyCode = (data) => {
  return axios.post(`${API}/accounts/verify-code/`, data);
};

// ✅ Kullanıcı bilgisi getir
export const getUserInfo = async () => {
  const res = await axios.get(`${API}/accounts/me/`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ✅ E-posta güncelleme (doğrulama sonrası)
export const updateEmail = async (email) => {
  const res = await axios.patch(
    `${API}/accounts/update-email/`,
    { email },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// ✅ E-posta güncelleme için kod gönder
export const sendUpdateCode = async (email) => {
  const res = await axios.post(
    `${API}/accounts/send-update-code/`,
    { email },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// ✅ E-posta güncelleme kodunu doğrula
export const verifyUpdateCode = async (code) => {
  const res = await axios.post(
    `${API}/accounts/verify-update-code/`,
    { code },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// ✅ Çıkış yap
export const logoutUser = async () => {
  const res = await axios.post(`${API}/accounts/logout/`, null, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
