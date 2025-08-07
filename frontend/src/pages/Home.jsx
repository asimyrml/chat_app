// src/pages/Home.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hoş Geldin 👋
      </Typography>
      <Typography>
        Giriş yaparak sohbete başlayabilirsin. Sol üstten sayfalar arasında geçiş yapabilirsin.
      </Typography>
    </Box>
  );
}
