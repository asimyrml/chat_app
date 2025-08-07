from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.cache import cache  # Kodları burada saklayacağız
from .serializers import RegisterSerializer, LoginSerializer
import random
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail

User = get_user_model()

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            code = serializer.context['verification_code']

            # Kod cache'e yazılıyor (5 dakika geçerli)
            cache.set(f"verify_{user.email}", code, timeout=300)

            return Response({"message": "Kayıt başarılı. Kod e-posta ile gönderildi."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # 2FA kodu üret
            code = str(random.randint(100000, 999999))
            cache.set(f"verify_{user.email}", code, timeout=300)

            # E-posta gönder
            subject = "Giriş Doğrulama Kodu"
            message = f"Giriş yapmak için doğrulama kodunuz: {code}"
            user.email_user(subject, message)

            return Response({"message": "Kod e-posta ile gönderildi. Lütfen doğrulayın."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyCodeAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")
        password = request.data.get("password")

        if not email or not code or not password:
            return Response({"error": "Alanlar eksik."}, status=400)

        cached_code = cache.get(f"verify_{email}")
        if cached_code != code:
            return Response({"error": "Kod geçersiz veya süresi dolmuş."}, status=400)

        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()

            user = authenticate(username=email, password=password)
            if not user:
                return Response({"error": "Giriş başarısız."}, status=400)

            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Doğrulama başarılı. Giriş yapıldı.",
                "token": token.key,
                "user": {
                    "email": user.email,
                    "username": user.username,
                }
            })

        except User.DoesNotExist:
            return Response({"error": "Kullanıcı bulunamadı."}, status=404)
        



class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Başarıyla çıkış yapıldı."})
    

class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "date_joined": user.date_joined,
        })
    

class SendUpdateCodeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_email = request.data.get("email")
        if not new_email:
            return Response({"error": "Yeni e-posta adresi gerekli."}, status=400)

        # eğer zaten başka biri kullanıyorsa
        if User.objects.filter(email=new_email).exclude(id=request.user.id).exists():
            return Response({"error": "Bu e-posta zaten kullanılıyor."}, status=400)

        code = str(random.randint(100000, 999999))
        cache.set(f"email_update_{request.user.id}", {"email": new_email, "code": code}, timeout=300)

        send_mail(
            subject="E-posta Güncelleme Kodu",
            message=f"Yeni e-posta adresinizi onaylamak için kodunuz: {code}",
            from_email="no-reply@seninchatsiten.com",
            recipient_list=[new_email],
        )

        return Response({"message": "Doğrulama kodu gönderildi."})
    

class VerifyUpdateCodeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        input_code = request.data.get("code")
        cached_data = cache.get(f"email_update_{request.user.id}")

        if not cached_data:
            return Response({"error": "Kod süresi dolmuş veya bulunamadı."}, status=400)

        if cached_data["code"] != input_code:
            return Response({"error": "Kod yanlış."}, status=400)

        # E-posta güncelle
        request.user.email = cached_data["email"]
        request.user.save()
        cache.delete(f"email_update_{request.user.id}")

        return Response({"message": "E-posta başarıyla güncellendi."})



class UpdateEmailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        new_email = request.data.get("email")

        if not new_email:
            return Response({"error": "E-posta gerekli."}, status=400)

        if User.objects.filter(email=new_email).exclude(id=request.user.id).exists():
            return Response({"error": "Bu e-posta zaten kullanılıyor."}, status=400)

        request.user.email = new_email
        request.user.save()

        return Response({"message": "E-posta başarıyla güncellendi."})
