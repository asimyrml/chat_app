from rest_framework import generics, permissions
from .models import ChatChannel, Message
from .serializers import ChatChannelSerializer, MessageSerializer

# 🔹 Tüm kanalları listele / yeni kanal oluştur
class ChatChannelListCreateView(generics.ListCreateAPIView):
    queryset = ChatChannel.objects.all().order_by("-created_at")
    serializer_class = ChatChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# 🔹 Kanalın mesajlarını al / yeni mesaj gönder
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_id = self.kwargs["channel_id"]
        return Message.objects.filter(channel__id=channel_id).order_by("timestamp")

    def perform_create(self, serializer):
        channel_id = self.kwargs["channel_id"]
        serializer.save(user=self.request.user, channel_id=channel_id)
