import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatChannel, Message
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.channel_id = self.scope['url_route']['kwargs']['channel_id']
        self.room_group_name = f"chat_{self.channel_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print("🔥 receive() tetiklendi")

        data = json.loads(text_data)
        message = data["message"]
        user = self.scope["user"]

        print("👤 user:", user)
        print("📨 message:", message)

        try:
            msg_obj = await self.save_message(user, message)
        except Exception as e:
            print("❌ Mesaj kaydedilemedi:", str(e))
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": msg_obj.content,
                "user": user.username,
                "timestamp": msg_obj.timestamp.isoformat()
            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "user": event["user"],
            "timestamp": event["timestamp"]
        }))

    @database_sync_to_async
    def save_message(self, user, message):
        print(f"[DEBUG] Mesaj kaydediliyor → user: {user}, mesaj: {message}")
        channel = ChatChannel.objects.get(id=self.channel_id)
        return Message.objects.create(
            channel=channel,
            user=user,
            content=message
        )
