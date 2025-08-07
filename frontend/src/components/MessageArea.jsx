import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { fetchMessages } from "../api/chat";

export default function MessageArea({ selectedChannel }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const socketRef = useRef(null);
  const username = localStorage.getItem("username");

  

  useEffect(() => {
    if (!selectedChannel) return;

    loadMessages();
    const token = localStorage.getItem("token");
    // 🔌 WebSocket bağlantısı
    const socket = new WebSocket(
      `ws://localhost:8000/ws/chat/${selectedChannel.id}/?token=${token}`
    );
    socketRef.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const incomingMsg = {
        user: data.user,
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, incomingMsg]);
      scrollToBottom();
    };

    return () => socket.close();
  }, [selectedChannel]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages(selectedChannel.id);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error("Mesajlar alınamadı", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !socketRef.current) return;

    const socket = socketRef.current;

    // ✅ Bağlantı açık değilse gönderme
    if (socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket bağlantısı henüz açık değil.");
      return;
    }
    socket.onopen = () => {
      console.log("WebSocket bağlantısı kuruldu.");
    };


    socket.send(JSON.stringify({ message: newMsg }));
    setNewMsg("");
  };


  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        p: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2} color="primary">
        #{selectedChannel?.name}
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 1,
          mb: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={32} />
          </Box>
        ) : messages.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" mt={4}>
            Bu kanalda henüz mesaj yok.
          </Typography>
        ) : (
          messages.map((msg, idx) => (
            <Paper
              key={idx}
              sx={{
                maxWidth: "80%",
                mb: 1.5,
                p: 1.5,
                borderRadius: 3,
                alignSelf: msg.user === username ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.user === username ? "primary.main" : "grey.100",
                color: msg.user === username ? "#fff" : "black",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mb: 0.5, opacity: 0.85 }}
              >
                {msg.user}
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                {msg.content}
              </Typography>
              <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.6 }}>
                {new Date(msg.timestamp).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          ))
        )}
        <div ref={messageEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Mesajınızı yazın..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          autoFocus
        />
        <IconButton
          type="submit"
          color="primary"
          size="large"
          disabled={!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN}
        >
          <SendIcon />
        </IconButton>

      </Box>
    </Box>
  );
}
