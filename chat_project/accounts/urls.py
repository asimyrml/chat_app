from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('verify-code/', VerifyCodeAPIView.as_view(), name='verify-code'),
    path("logout/", LogoutAPIView.as_view()),
    path("me/", UserDetailAPIView.as_view()),
    path("update-email/", UpdateEmailAPIView.as_view()),
    path("verify-update-code/", VerifyUpdateCodeAPIView.as_view()),
    path("send-update-code/", SendUpdateCodeAPIView.as_view()),

]
