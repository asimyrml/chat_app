from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OneTimeCode

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'username', 'is_verified', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_verified',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets

admin.site.register(OneTimeCode)
