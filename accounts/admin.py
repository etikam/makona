"""
Admin pour l'app accounts
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from .models import User, CandidateProfile, DeviceFingerprint, OneTimePassword


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin pour le modèle User personnalisé
    """
    list_display = [
        'email', 'get_full_name', 'user_type', 'country', 
        'is_verified', 'is_active', 'created_at'
    ]
    list_filter = [
        'user_type', 'country', 'is_verified', 'is_active', 
        'is_staff', 'created_at'
    ]
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'phone', 'country')
        }),
        ('Permissions', {
            'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'is_verified'),
        }),
        ('Dates importantes', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'user_type', 'country'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = 'Nom complet'


@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    """
    Admin pour le modèle CandidateProfile
    """
    list_display = [
        'user', 'get_user_email', 'get_user_country', 
        'has_social_links', 'created_at'
    ]
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'bio']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Utilisateur', {'fields': ('user',)}),
        ('Profil', {
            'fields': ('bio',)
        }),
        ('Réseaux sociaux', {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url', 'website_url'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'
    
    def get_user_country(self, obj):
        return obj.user.get_country_display()
    get_user_country.short_description = 'Pays'
    
    def has_social_links(self, obj):
        links = [obj.facebook_url, obj.instagram_url, obj.youtube_url, obj.website_url]
        count = sum(1 for link in links if link)
        if count > 0:
            return format_html('<span style="color: green;">✓ {} liens</span>', count)
        return format_html('<span style="color: red;">✗ Aucun</span>')
    has_social_links.short_description = 'Réseaux sociaux'


@admin.register(DeviceFingerprint)
class DeviceFingerprintAdmin(admin.ModelAdmin):
    """
    Admin pour le modèle DeviceFingerprint
    """
    list_display = [
        'fingerprint_hash_short', 'ip_address', 'screen_resolution',
        'timezone', 'language', 'created_at', 'last_used'
    ]
    list_filter = ['timezone', 'language', 'created_at', 'last_used']
    search_fields = ['fingerprint_hash', 'ip_address', 'user_agent']
    readonly_fields = ['fingerprint_hash', 'created_at', 'last_used']
    
    fieldsets = (
        ('Fingerprint', {
            'fields': ('fingerprint_hash',)
        }),
        ('Informations device', {
            'fields': ('user_agent', 'ip_address', 'screen_resolution', 'timezone', 'language')
        }),
        ('Dates', {
            'fields': ('created_at', 'last_used'),
            'classes': ('collapse',)
        }),
    )
    
    def fingerprint_hash_short(self, obj):
        return f"{obj.fingerprint_hash[:8]}..."
    fingerprint_hash_short.short_description = 'Fingerprint'


@admin.register(OneTimePassword)
class OneTimePasswordAdmin(admin.ModelAdmin):
    """
    Admin pour le modèle OneTimePassword
    """
    list_display = [
        'user', 'code', 'is_used', 'is_expired', 
        'created_at', 'expires_at'
    ]
    list_filter = ['is_used', 'created_at', 'expires_at']
    search_fields = ['user__email', 'code']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Code OTP', {
            'fields': ('user', 'code', 'is_used')
        }),
        ('Dates', {
            'fields': ('created_at', 'expires_at')
        }),
    )
    
    def is_expired(self, obj):
        if obj.is_expired():
            return format_html('<span style="color: red;">✗ Expiré</span>')
        return format_html('<span style="color: green;">✓ Valide</span>')
    is_expired.short_description = 'Statut'