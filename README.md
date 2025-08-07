# 📘 Chat App - README Ana Yapı
## 🚀 Proje Özeti
Bu proje, Django (API + WebSocket) ve React (SPA arayüz) teknolojileri kullanılarak geliştirilen, gerçek zamanlı sohbet sistemi projesidir.
Amaç, modern bir chat deneyimi sunan, güvenli ve esnek bir sistem kurmaktır.
---

## 🧱 Özellikler Tablosu
| Özellik               | Açıklama                                        | Teknoloji / Yapı                           |
| --------------------- | ----------------------------------------------- | ------------------------------------------ |
| ✅ Kullanıcı Girişi    | E-posta ile giriş + 2FA (tek kullanımlık kod)   | `django-otp` veya özel token sistemi       |
| ✅ Şifreli Kanallar    | Kanal sadece şifreyle veya davetle erişilebilir | Kanal modeli + şifre alanı + izin sistemi  |
| ✅ WebSocket Sohbet    | Anlık mesajlaşma                                | Django Channels + Redis                    |
| ✅ Mesaj Geçmişi       | Tüm mesajlar saklanır                           | Mesaj modeli (text/image)                  |
| ✅ Emoji ve Medya      | Emoji picker + resim yükleme                    | Emoji JS + FileField + cloud/media storage |
| ✅ Mesaj Silme         | Kişi kendi mesajını silebilir                   | DB’den flag’leme veya soft delete          |
| ✅ Online Kullanıcılar | Anlık aktif kullanıcılar                        | Channels + presence tracking               |
| ✅ Profil              | Kullanıcı ad-soyad, avatar, email değiştirme    | Profil modeli + form                       |
| ✅ Hesap Silme         | Kullanıcı hesabını silebilir                    | Django user delete                         |



## 🗂️ Klasör Yapısı
```
chat_project/
├── chat_project/          # Django ayarları
│   └── settings.py
├── accounts/              # Kimlik doğrulama, profil, 2FA
│   ├── models.py
│   ├── views.py
│   └── forms.py
├── chat/                  # Kanal, mesaj, websocket
│   ├── models.py
│   ├── views.py
│   ├── consumers.py       # WebSocket logic
│   └── routing.py
└── manage.py
```
## 🧩 Frontend (React) ayrı bir klasörde olacak:
```
chat-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
├── package.json
└── vite.config.js

```