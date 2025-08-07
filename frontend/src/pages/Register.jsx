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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyCode } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });
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
      await registerUser(form);
      setModalOpen(true);
    } catch (err) {
      const errMsg = err.response?.data
        ? Object.values(err.response.data).flat().join(" ")
        : "Bilinmeyen hata";
      setError(errMsg);
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
      setModalOpen(false);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      navigate("/chat");
    } catch {
      setError("Kod yanlış, süresi dolmuş veya kayıt başarısız.");
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(to right, #43cea2, #185a9d)",
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
            backgroundColor: "#ffffffee",
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
              <PersonAddAlt1Icon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
              Kayıt Ol
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Hemen ücretsiz bir hesap oluştur
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="username"
              margin="normal"
              value={form.username}
              onChange={handleChange}
              required
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={handleChange}
              required
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Şifre (Tekrar)"
              name="password2"
              type="password"
              margin="normal"
              value={form.password2}
              onChange={handleChange}
              required
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                align="center"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                background: "linear-gradient(to right, #00c6ff, #0072ff)",
                boxShadow: "0 4px 12px rgba(0,114,255,0.3)",
                ":hover": {
                  background: "linear-gradient(to right, #0072ff, #00c6ff)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Kayıt Ol
            </Button>
            <Typography align="center" mt={3}>
              Zaten hesabın var mı?{" "}
              <Link
                component="button"
                onClick={() => navigate("/login")}
                underline="hover"
                fontWeight="bold"
              >
                Giriş Yap
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
                <PersonAddAlt1Icon />
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
