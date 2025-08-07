import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chat_project.settings")

# 🔑 1) Django’yu tamamen başlat
django.setup()

# 🔑 2) Artık chat modüllerini güvenle import edebiliriz
from chat.middleware import TokenAuthMiddleware
import chat.routing

# 🔑 3) HTTP tarafını hazırlayalım
from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

# 🔑 4) Son birleşik ASGI uygulaması
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": TokenAuthMiddleware(
        URLRouter(chat.routing.websocket_urlpatterns)
    ),
})
