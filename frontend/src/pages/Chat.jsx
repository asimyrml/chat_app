import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";

export default function Chat() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const navigate = useNavigate();

  // ⛔ Giriş yapılmamışsa yönlendir
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />
      <MessageArea selectedChannel={selectedChannel} />
    </Box>
  );
}
