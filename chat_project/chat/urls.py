from django.urls import path
from .views import ChatChannelListCreateView, MessageListCreateView

urlpatterns = [
    path("channels/", ChatChannelListCreateView.as_view(), name="channel-list-create"),
    path("channels/<int:channel_id>/messages/", MessageListCreateView.as_view(), name="message-list-create"),
]
