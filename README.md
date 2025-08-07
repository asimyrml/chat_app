# 💬 **Chat App**

Gerçek-zamanlı, çok-kanallı bir sohbet platformu.  
Backend → **Django 4 + Django Channels + PostgreSQL + Redis**  
Frontend → **React 18 + Vite + MUI 5**  

---

## ✨ Özellikler

| Başlık                   | Açıklama                                                                                  |
|--------------------------|-------------------------------------------------------------------------------------------|
| **JWT + 2FA**            | E-posta & şifre ile oturum + 6 haneli doğrulama kodu                                      |
| **Rol & İzin Sistemi**   | Kanal sahipliği, davet bağlantısı, şifreli odalar                                         |
| **Gerçek-zamanlı Sohbet**| Django Channels · WebSocket · Redis                                                       |
| **Soft-delete Mesajlar** | Mesaj silme ↓ geri alma (is_deleted flag)                                                 |
| **Emoji & Medya**        | Emoji picker, resim yükleme (S3 / yerel)                                                  |
| **Çevrim-içi Durumu**    | Presence middleware ile aktif kullanıcı listesi                                           |
| **Profil & Ayarlar**     | Avatar, kullanıcı adı, e-posta değişimi (e-posta değişiminde 2FA)                         |
| **Tam Dockerleşme**      | `docker compose up --build` → tüm servisler                                               |
| **CI / Test**            | pytest + GitHub Actions                                                                   |

---

## 🗂️ Proje Yapısı
```
chat_app/
├── chat_project/ # Django monorepo
│ ├── chat_project/ # Ayarlar & ASGI
│ ├── accounts/ # Auth, 2FA, profil
│ ├── chat/ # Kanallar, mesajlar, websocket
│ └── requirements.txt
├── chat-frontend/ # React + Vite SPA
│ ├── src/
│ └── Dockerfile
├── docker-compose.yml
└── .env.example
```


> **API şeması** → `docs/openapi.yaml`

---

## ⚙️ Kurulum

### Yerel geliştirme

```bash
# Backend
cd chat_project
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # değerleri doldurun
python manage.py migrate
python manage.py runserver

# Frontend (yeni sekme)
cd ../chat-frontend
npm i
npm run dev
```

### Docker (tek komut)
```
cp .env.example .env        # kök dizinde
docker compose up --build
```

| Hizmet        | URL                                                      |
| ------------- | -------------------------------------------------------- |
| **Frontend**  | [http://localhost:5173](http://localhost:5173)           |
| **API**       | [http://localhost:8000/api/](http://localhost:8000/api/) |
| **WebSocket** | `ws://localhost:8000/ws/chat/<id>/?token=<JWT>`          |

### 🔧 Ortam Değişkenleri (.env)
| Değişken              | Örnek Değer                               |
| --------------------- | ----------------------------------------- |
| `SECRET_KEY`          | `django-insecure-...`                     |
| `DATABASE_URL`        | `postgres://chatuser:pass@db:5432/chatdb` |
| `REDIS_URL`           | `redis://redis:6379`                      |
| `EMAIL_HOST_USER`     | `donotreply@example.com`                  |
| `EMAIL_HOST_PASSWORD` | `********`                                |

Tam liste .env.example dosyasında.

### 🏗️ Teknolojiler
- Backend: Django 4 · Django REST Framework · Channels · Redis · PostgreSQL
- Frontend: React 18 · Vite 5 · Material UI v5 · Axios · React Router 6
- CI / CD: GitHub Actions · Render / Railway (deploy)
- Test: pytest · pytest-django · React Testing Library

### 🚚 Dağıtım
Render, Railway veya Fly.io için one-click deploy dosyaları deploy/ klasöründe.
docker compose tek pod içinde Nginx + Daphne + Gunicorn + Redis + Postgres barındırır.

