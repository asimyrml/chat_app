// src/components/Navbar.jsx
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  Fade,
  Divider,
  useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Kullanıcı";
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/accounts/logout/`, null, {
        headers: { Authorization: `Token ${token}` },
      });
    } catch (err) {
      console.error("Çıkış işlemi başarısız:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleSettings = () => {
    handleMenuClose();
    navigate("/settings");
  };

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: 700,
            letterSpacing: 2,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.02)" },
          }}
          onClick={() => navigate("/chat")}
        >
          ChatApp
        </Typography>

        {token ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Bildirimler" arrow>
              <IconButton color="inherit" sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" }
              }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Hesap" arrow>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0,
                  border: "2px solid #fff",
                  transition: "box-shadow 0.2s",
                  boxShadow: anchorEl ? "0 0 0 4px rgba(0,0,0,0.08)" : "none"
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 36,
                    height: 36,
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  {username[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              PaperProps={{
                sx: {
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: 6,
                  mt: 1,
                  p: 0.5,
                  bgcolor: "background.paper",
                },
              }}
            >
              <MenuItem disabled sx={{ opacity: 1, fontWeight: 600 }}>
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 28,
                    height: 28,
                    mr: 1,
                    fontSize: 16,
                  }}
                >
                  {username[0]?.toUpperCase()}
                </Avatar>
                {username}
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleSettings}>
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Ayarlar
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Çıkış Yap
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/login")}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" }
              }}
            >
              Giriş
            </Button>
            <Button
              color="inherit"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate("/register")}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.18)" }
              }}
            >
              Kayıt
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
