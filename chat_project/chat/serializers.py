from rest_framework import serializers
from .models import ChatChannel, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatChannelSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ChatChannel
        fields = ["id", "name", "created_by", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    channel = serializers.PrimaryKeyRelatedField(read_only=True)  # BU ŞEKİLDE DEĞİŞTİR

    class Meta:
        model = Message
        fields = ["id", "channel", "user", "content", "timestamp"]

