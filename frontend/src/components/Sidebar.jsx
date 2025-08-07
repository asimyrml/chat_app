// src/components/Sidebar.jsx
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchChannels, createChannel } from "../api/chat";

export default function Sidebar({ selectedChannel, setSelectedChannel }) {
  const [channels, setChannels] = useState([]);
  const [open, setOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = async () => {
    try {
      const data = await fetchChannels();
      setChannels(data);
      if (!selectedChannel && data.length > 0) {
        setSelectedChannel(data[0]); // ilk kanalı otomatik seç
      }
    } catch (err) {
      console.error("Kanal listesi alınamadı", err);
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;
    try {
      await createChannel(newChannelName);
      setNewChannelName("");
      setOpen(false);
      getChannels(); // kanalları güncelle
    } catch (err) {
      console.error("Kanal oluşturulamadı", err);
    }
  };

  return (
    <Box
      sx={{
        width: 320,
        bgcolor: "background.paper",
        borderRight: "1px solid #e0e0e0",
        p: 3,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} color="primary" flexGrow={1}>
          Kanallar
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ borderRadius: 2, minWidth: 0, px: 2, boxShadow: 2 }}
          onClick={() => setOpen(true)}
        >
          + Yeni
        </Button>
      </Box>

      <List dense sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
        {channels.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Henüz kanal yok. Yeni bir kanal oluşturun!
          </Typography>
        ) : (
          channels.map((channel) => (
            <ListItem
              key={channel.id}
              disablePadding
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor:
                  selectedChannel?.id === channel.id
                    ? "primary.light"
                    : "transparent",
                transition: "background 0.2s",
              }}
            >
              <ListItemButton
                selected={selectedChannel?.id === channel.id}
                onClick={() => setSelectedChannel(channel)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "#fff",
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight:
                      selectedChannel?.id === channel.id ? 700 : 500,
                    letterSpacing: 0.2,
                  }}
                >
                  #{channel.name}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Yeni Kanal Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, minWidth: 350, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "primary.main" }}>
          Yeni Kanal Oluştur
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Kanal Adı"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 32 }}
            helperText={`${newChannelName.length}/32`}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            İptal
          </Button>
          <Button
            onClick={handleCreateChannel}
            variant="contained"
            color="primary"
            disabled={!newChannelName.trim()}
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
