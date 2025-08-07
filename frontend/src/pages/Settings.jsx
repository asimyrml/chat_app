import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState, useEffect } from "react";
import {
  getUserInfo,
  sendUpdateCode,
  verifyUpdateCode,
} from "../api/auth";

export default function Settings() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // 'form' | 'verify'
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  // ⛔ Giriş yapılmamışsa yönlendir
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
        setEmail(data.email);
      } catch {
        setError("Kullanıcı bilgileri alınamadı.");
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (email === user.email) {
      setError("Zaten bu e-posta adresini kullanıyorsunuz.");
      return;
    }

    try {
      await sendUpdateCode(email);
      setStep("verify"); // Modal'ı aç
    } catch (err) {
      const msg = err.response?.data?.error || "Kod gönderilemedi.";
      setError(msg);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await verifyUpdateCode(code);
      setUser((prev) => ({ ...prev, email }));
      setSuccess("E-posta başarıyla güncellendi.");
      setStep("form");
    } catch (err) {
      const msg = err.response?.data?.error || "Kod geçersiz veya süresi dolmuş.";
      setError(msg);
    }
  };

return (
    <>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 5,
                    borderRadius: 5,
                    width: 420,
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                    backdropFilter: "blur(2px)",
                    border: "1px solid #e0e0e0",
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                            mx: "auto",
                            mb: 2,
                            width: 64,
                            height: 64,
                            boxShadow: 3,
                        }}
                    >
                        <SettingsIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" color="primary.main" mb={1}>
                        Hesap Ayarları
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Profil bilgilerinizi buradan güncelleyebilirsiniz.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        background: "#f5f5f5",
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2" color="text.secondary">
                            Kullanıcı Adı
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                            {user.username}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2" color="text.secondary">
                            Kayıt Tarihi
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                            {user.date_joined
                                ? new Date(user.date_joined).toLocaleString("tr-TR")
                                : "-"}
                        </Typography>
                    </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Typography variant="subtitle2" color="text.secondary" mb={1}>
                        E-posta Adresi
                    </Typography>
                    <TextField
                        fullWidth
                        label="E-posta"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        margin="dense"
                        size="medium"
                        variant="outlined"
                        sx={{
                            mb: 1,
                            background: "#fff",
                            borderRadius: 1,
                        }}
                        InputProps={{
                            sx: { fontWeight: 500 },
                        }}
                    />
                    {success && (
                        <Typography color="success.main" align="center" mt={1} fontWeight="bold">
                            {success}
                        </Typography>
                    )}
                    {error && step === "form" && (
                        <Typography color="error" align="center" mt={1} fontWeight="bold">
                            {error}
                        </Typography>
                    )}
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 2,
                            py: 1.5,
                            fontWeight: "bold",
                            fontSize: "1rem",
                            letterSpacing: 0.5,
                            boxShadow: "0 2px 8px 0 rgba(25, 118, 210, 0.08)",
                            transition: "all 0.2s",
                            ":hover": {
                                background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
                                transform: "translateY(-2px) scale(1.03)",
                            },
                        }}
                    >
                        E-postayı Güncelle
                    </Button>
                </form>
            </Paper>
        </Box>

        {/* Modal - Kod Doğrulama */}
        <Modal
            open={step === "verify"}
            onClose={() => setStep("form")}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 500 } }}
        >
            <Fade in={step === "verify"}>
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
                            <SettingsIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" color="secondary.main">
                            Doğrulama Kodu
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1.5 }} color="text.secondary">
                            Yeni e-posta adresinize gönderilen 6 haneli kodu giriniz.
                        </Typography>
                    </Box>
                    <form onSubmit={handleVerify}>
                        <TextField
                            fullWidth
                            label="Kod"
                            variant="outlined"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            inputProps={{
                                maxLength: 6,
                                style: { letterSpacing: 6, fontSize: "1.2rem", textAlign: "center" },
                            }}
                            sx={{
                                mb: 1,
                                background: "#fafafa",
                                borderRadius: 1,
                            }}
                        />
                        {error && step === "verify" && (
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
                                background: "linear-gradient(90deg, #ab47bc 60%, #7e57c2 100%)",
                                boxShadow: "0 2px 8px 0 rgba(123, 31, 162, 0.08)",
                                ":hover": {
                                    background: "linear-gradient(90deg, #7e57c2 60%, #ab47bc 100%)",
                                    transform: "translateY(-2px) scale(1.03)",
                                },
                            }}
                        >
                            Doğrula ve Güncelle
                        </Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    </>
);
}
