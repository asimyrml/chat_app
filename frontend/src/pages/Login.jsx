import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useState, useEffect } from "react";
import { loginUser, verifyCode } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(form);
      setModalOpen(true); // Kod doğrulama modalını aç
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(" ")
        : "Bilinmeyen hata";
      setError(msg);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await verifyCode({
        email: form.email,
        code,
        password: form.password,
      });
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("token", res.data.token);
      setModalOpen(false);
      navigate("/chat");
    } catch {
      setError("Kod yanlış, süresi dolmuş veya giriş yapılamadı.");
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(to right, #8e2de2, #4a00e0)",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Grid item xs={12} sm={8} md={5}>
        <Paper
          elevation={12}
          sx={{
            borderRadius: 5,
            p: 5,
            backgroundColor: "#ffffffdd",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 64,
                height: 64,
                mb: 2,
                boxShadow: 3,
              }}
            >
              <LockPersonIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
              Giriş Yap
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Lütfen hesabınıza giriş yapın
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
              sx={{ background: "#fff", borderRadius: 1 }}
            />

            {error && (
              <Typography
                color="error"
                align="center"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                background: "linear-gradient(to right, #2196f3, #21cbf3)",
                boxShadow: "0 4px 12px rgba(33, 203, 243, 0.4)",
                ":hover": {
                  background: "linear-gradient(to right, #21cbf3, #2196f3)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Giriş Yap
            </Button>

            <Typography align="center" mt={3}>
              Hesabın yok mu?{" "}
              <Link
                component="button"
                onClick={() => navigate("/register")}
                underline="hover"
                fontWeight="bold"
              >
                Kayıt Ol
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* ✅ 2FA Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {}}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 370,
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
              border: "1px solid #e0e0e0",
            }}
          >
            <Box textAlign="center" mb={2}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  mx: "auto",
                  mb: 1,
                  width: 48,
                  height: 48,
                  boxShadow: 2,
                }}
              >
                <LockPersonIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">
                Doğrulama Kodu
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }} color="text.secondary">
                E-posta adresinize gönderilen 6 haneli kodu giriniz.
              </Typography>
            </Box>
            <form onSubmit={handleCodeSubmit}>
              <TextField
                fullWidth
                label="Kod"
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                inputProps={{
                  maxLength: 6,
                  style: {
                    letterSpacing: 6,
                    fontSize: "1.2rem",
                    textAlign: "center",
                  },
                }}
                sx={{
                  mb: 1,
                  background: "#fafafa",
                  borderRadius: 1,
                }}
              />
              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ mt: 1, textAlign: "center", fontWeight: "bold" }}
                >
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: 0.5,
                  background: "linear-gradient(90deg, #f06292 60%, #ba68c8 100%)",
                  ":hover": {
                    background: "linear-gradient(90deg, #ba68c8 60%, #f06292 100%)",
                    transform: "translateY(-2px) scale(1.02)",
                  },
                }}
              >
                Doğrula
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Grid>
  );
}
