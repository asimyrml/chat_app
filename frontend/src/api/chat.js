// src/api/chat.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  Authorization: `Token ${localStorage.getItem("token")}`,
});

// ✅ Kanalları getir
export const fetchChannels = async () => {
  const res = await axios.get(`${API}/chat/channels/`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ✅ Yeni kanal oluştur
export const createChannel = async (name) => {
  const res = await axios.post(
    `${API}/chat/channels/`,
    { name },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// ✅ Kanalın mesajlarını getir
export const fetchMessages = async (channelId) => {
  const res = await axios.get(
    `${API}/chat/channels/${channelId}/messages/`,
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// ✅ Kanalda yeni mesaj gönder
export const sendMessage = async (channelId, content) => {
  const res = await axios.post(
    `${API}/chat/channels/${channelId}/messages/`,
    { content },
    { headers: getAuthHeaders() }
  );
  return res.data;
};
