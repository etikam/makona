"""
Modèles pour l'app accounts
"""
import uuid
import hashlib
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé
    """
    USER_TYPE_CHOICES = [
        ('candidate', 'Candidat'),
        ('admin', 'Administrateur'),
    ]
    
    COUNTRY_CHOICES = [
        ('guinea', 'Guinée'),
        ('liberia', 'Libéria'),
        ('sierra_leone', 'Sierra Leone'),
    ]
    
    # Champs personnalisés
    email = models.EmailField(unique=True, verbose_name="Adresse email")
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPE_CHOICES,
        default='candidate',
        verbose_name="Type d'utilisateur"
    )
    phone = models.CharField(
        max_length=20, 
        blank=True,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Format de téléphone invalide"
        )],
        verbose_name="Téléphone"
    )
    country = models.CharField(
        max_length=20,
        choices=COUNTRY_CHOICES,
        verbose_name="Pays"
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name="Email vérifié"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    # Configuration
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'country']
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def is_candidate(self):
        return self.user_type == 'candidate'
    
    def is_admin(self):
        return self.user_type == 'admin'


class CandidateProfile(models.Model):
    """
    Profile spécifique aux candidats
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'candidate'},
        related_name='candidate_profile',
        verbose_name="Utilisateur"
    )
    bio = models.TextField(
        max_length=1000,
        verbose_name="Biographie",
        help_text="Présentez-vous en quelques mots (max 1000 caractères)"
    )
    facebook_url = models.URLField(blank=True, verbose_name="Facebook")
    instagram_url = models.URLField(blank=True, verbose_name="Instagram")
    youtube_url = models.URLField(blank=True, verbose_name="YouTube")
    website_url = models.URLField(blank=True, verbose_name="Site web")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Profile Candidat"
        verbose_name_plural = "Profiles Candidats"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Profile de {self.user.get_full_name()}"


class DeviceFingerprint(models.Model):
    """
    Modèle pour tracker les devices et éviter les votes multiples
    """
    fingerprint_hash = models.CharField(
        max_length=64,
        unique=True,
        verbose_name="Hash du fingerprint"
    )
    user_agent = models.TextField(verbose_name="User Agent")
    ip_address = models.GenericIPAddressField(verbose_name="Adresse IP")
    screen_resolution = models.CharField(
        max_length=20,
        verbose_name="Résolution d'écran"
    )
    timezone = models.CharField(
        max_length=50,
        verbose_name="Fuseau horaire"
    )
    language = models.CharField(
        max_length=10,
        verbose_name="Langue"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    last_used = models.DateTimeField(auto_now=True, verbose_name="Dernière utilisation")
    
    class Meta:
        verbose_name = "Fingerprint Device"
        verbose_name_plural = "Fingerprints Devices"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Device {self.fingerprint_hash[:8]}... ({self.ip_address})"
    
    @classmethod
    def generate_fingerprint_hash(cls, user_agent, screen_resolution, timezone, language):
        """
        Génère un hash unique pour le fingerprint du device
        """
        fingerprint_string = f"{user_agent}|{screen_resolution}|{timezone}|{language}"
        return hashlib.sha256(fingerprint_string.encode()).hexdigest()
    
    @classmethod
    def get_or_create_fingerprint(cls, user_agent, screen_resolution, timezone, language, ip_address):
        """
        Récupère ou crée un fingerprint device
        """
        fingerprint_hash = cls.generate_fingerprint_hash(
            user_agent, screen_resolution, timezone, language
        )
        
        fingerprint, created = cls.objects.get_or_create(
            fingerprint_hash=fingerprint_hash,
            defaults={
                'user_agent': user_agent,
                'ip_address': ip_address,
                'screen_resolution': screen_resolution,
                'timezone': timezone,
                'language': language,
            }
        )
        
        return fingerprint, created


class OneTimePassword(models.Model):
    """
    Modèle pour les codes OTP d'authentification
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='otp_codes',
        verbose_name="Utilisateur"
    )
    code = models.CharField(
        max_length=6,
        verbose_name="Code OTP"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    expires_at = models.DateTimeField(verbose_name="Date d'expiration")
    is_used = models.BooleanField(
        default=False,
        verbose_name="Code utilisé"
    )
    
    class Meta:
        verbose_name = "Code OTP"
        verbose_name_plural = "Codes OTP"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP {self.code} pour {self.user.email}"
    
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_used and not self.is_expired()