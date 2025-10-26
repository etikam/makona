"""
Serializers pour l'app accounts
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from datetime import timedelta
import random
import string

from .models import User, CandidateProfile, DeviceFingerprint, OneTimePassword


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'inscription des utilisateurs
    """
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 
            'phone', 'country', 'user_type', 'password', 'password_confirm'
        ]
        extra_kwargs = {
            'user_type': {'default': 'candidate'},
            'username': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cette adresse email est déjà utilisée.")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Générer un username unique si non fourni
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer pour les données utilisateur
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    is_candidate = serializers.BooleanField(read_only=True)
    is_admin = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'full_name', 'phone', 'country', 'user_type', 
            'is_verified', 'is_candidate', 'is_admin',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']


class CandidateProfileSerializer(serializers.ModelSerializer):
    """
    Serializer pour le profile candidat
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'user', 'bio', 'facebook_url', 'instagram_url', 
            'youtube_url', 'website_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class CandidateProfileCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer un profile candidat
    """
    class Meta:
        model = CandidateProfile
        fields = ['bio', 'facebook_url', 'instagram_url', 'youtube_url', 'website_url']
    
    def validate_bio(self, value):
        if len(value) > 1000:
            raise serializers.ValidationError("La biographie ne peut pas dépasser 1000 caractères.")
        return value
    
    def create(self, validated_data):
        user = self.context['request'].user
        if not user.is_candidate():
            raise serializers.ValidationError("Seuls les candidats peuvent créer un profile.")
        
        profile, created = CandidateProfile.objects.get_or_create(
            user=user,
            defaults=validated_data
        )
        
        if not created:
            # Mettre à jour le profile existant
            for attr, value in validated_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return profile


class DeviceFingerprintSerializer(serializers.ModelSerializer):
    """
    Serializer pour les fingerprints de devices
    """
    class Meta:
        model = DeviceFingerprint
        fields = [
            'id', 'fingerprint_hash', 'user_agent', 'ip_address',
            'screen_resolution', 'timezone', 'language', 
            'created_at', 'last_used'
        ]
        read_only_fields = [
            'id', 'fingerprint_hash', 'created_at', 'last_used'
        ]


class DeviceFingerprintCreateSerializer(serializers.Serializer):
    """
    Serializer pour créer un fingerprint device
    """
    user_agent = serializers.CharField()
    screen_resolution = serializers.CharField()
    timezone = serializers.CharField()
    language = serializers.CharField()
    
    def create(self, validated_data):
        request = self.context['request']
        ip_address = self.get_client_ip(request)
        
        fingerprint, created = DeviceFingerprint.get_or_create_fingerprint(
            user_agent=validated_data['user_agent'],
            screen_resolution=validated_data['screen_resolution'],
            timezone=validated_data['timezone'],
            language=validated_data['language'],
            ip_address=ip_address
        )
        
        return fingerprint
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class OTPRequestSerializer(serializers.Serializer):
    """
    Serializer pour demander un code OTP
    """
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if not user.is_verified:
                raise serializers.ValidationError("Veuillez d'abord vérifier votre email.")
        except User.DoesNotExist:
            raise serializers.ValidationError("Aucun utilisateur trouvé avec cette adresse email.")
        return value


class OTPVerifySerializer(serializers.Serializer):
    """
    Serializer pour vérifier un code OTP
    """
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)
    
    def validate(self, attrs):
        email = attrs['email']
        code = attrs['code']
        
        try:
            user = User.objects.get(email=email)
            otp = OneTimePassword.objects.filter(
                user=user,
                code=code,
                is_used=False
            ).order_by('-created_at').first()
            
            if not otp:
                raise serializers.ValidationError("Code OTP invalide.")
            
            if otp.is_expired():
                raise serializers.ValidationError("Le code OTP a expiré.")
            
            attrs['user'] = user
            attrs['otp'] = otp
            
        except User.DoesNotExist:
            raise serializers.ValidationError("Utilisateur non trouvé.")
        
        return attrs


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer pour la connexion utilisateur
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Identifiants invalides.")
            if not user.is_active:
                raise serializers.ValidationError("Compte désactivé.")
            attrs['user'] = user
        else:
            raise serializers.ValidationError("Email et mot de passe requis.")
        
        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer pour changer le mot de passe
    """
    old_password = serializers.CharField(style={'input_type': 'password'})
    new_password = serializers.CharField(
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Les nouveaux mots de passe ne correspondent pas.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Ancien mot de passe incorrect.")
        return value

