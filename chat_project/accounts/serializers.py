from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.mail import send_mail
from django.conf import settings
import random

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Şifreler eşleşmiyor.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False  # 2FA doğrulanana kadar pasif
        user.save()

        # 2FA kodu üret ve e-posta gönder
        code = str(random.randint(100000, 999999))
        self.send_verification_email(user.email, code)

        # Kodu session'a veya cache'e yazabilirsin. Şimdilik serializer context üzerinden ekleyelim
        self.context['verification_code'] = code
        return user

    def send_verification_email(self, email, code):
        subject = "Giriş Doğrulama Kodu"
        message = f"Giriş işlemini tamamlamak için doğrulama kodunuz: {code}"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Geçersiz giriş bilgileri.")
        if not user.is_active:
            raise serializers.ValidationError("Kullanıcı henüz doğrulanmamış.")

        data['user'] = user
        return data
