"""
Services pour l'app accounts
"""
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from .models import OneTimePassword


class OTPService:
    """
    Service pour la gestion des codes OTP
    """
    
    @staticmethod
    def generate_otp_code():
        """
        Génère un code OTP à 6 chiffres
        """
        return ''.join(random.choices(string.digits, k=6))
    
    @staticmethod
    def create_otp(user):
        """
        Crée un nouveau code OTP pour un utilisateur
        """
        # Désactiver les anciens codes OTP
        OneTimePassword.objects.filter(
            user=user,
            is_used=False
        ).update(is_used=True)
        
        # Créer un nouveau code
        code = OTPService.generate_otp_code()
        expires_at = timezone.now() + timedelta(minutes=10)
        
        otp = OneTimePassword.objects.create(
            user=user,
            code=code,
            expires_at=expires_at
        )
        
        return otp
    
    @staticmethod
    def send_otp_email(user, otp_code):
        """
        Envoie le code OTP par email
        Utilise le module mailing/mail.py
        """
        from .mailing.mail import send_otp_email as send_email
        return send_email(user, otp_code)
    
    @staticmethod
    def verify_otp(user, code):
        """
        Vérifie un code OTP
        """
        try:
            otp = OneTimePassword.objects.filter(
                user=user,
                code=code,
                is_used=False
            ).order_by('-created_at').first()
            
            if not otp:
                return False, "Code OTP invalide"
            
            if otp.is_expired():
                return False, "Le code OTP a expiré"
            
            # Marquer le code comme utilisé
            otp.is_used = True
            otp.save()
            
            return True, "Code OTP valide"
            
        except Exception as e:
            return False, f"Erreur de vérification: {str(e)}"


class UserService:
    """
    Service pour la gestion des utilisateurs
    """
    
    @staticmethod
    def create_candidate_profile(user, profile_data):
        """
        Crée un profile candidat pour un utilisateur
        """
        if not user.is_candidate():
            raise ValueError("L'utilisateur doit être un candidat")
        
        profile, created = CandidateProfile.objects.get_or_create(
            user=user,
            defaults=profile_data
        )
        
        if not created:
            # Mettre à jour le profile existant
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return profile
    
    @staticmethod
    def verify_user_email(user):
        """
        Marque l'email d'un utilisateur comme vérifié
        """
        user.is_verified = True
        user.save()
        return user
    
    @staticmethod
    def get_user_stats(user):
        """
        Récupère les statistiques d'un utilisateur
        """
        stats = {
            'user_id': user.id,
            'email': user.email,
            'full_name': user.get_full_name(),
            'user_type': user.user_type,
            'is_verified': user.is_verified,
            'created_at': user.created_at,
        }
        
        if user.is_candidate():
            try:
                profile = user.candidate_profile
                stats['has_profile'] = True
                stats['profile_created_at'] = profile.created_at
            except CandidateProfile.DoesNotExist:
                stats['has_profile'] = False
        
        return stats


class DeviceFingerprintService:
    """
    Service pour la gestion des fingerprints de devices
    """
    
    @staticmethod
    def generate_fingerprint_hash(user_agent, screen_resolution, timezone, language):
        """
        Génère un hash unique pour le fingerprint
        """
        from .models import DeviceFingerprint
        return DeviceFingerprint.generate_fingerprint_hash(
            user_agent, screen_resolution, timezone, language
        )
    
    @staticmethod
    def get_or_create_fingerprint(user_agent, screen_resolution, timezone, language, ip_address):
        """
        Récupère ou crée un fingerprint device
        """
        from .models import DeviceFingerprint
        return DeviceFingerprint.get_or_create_fingerprint(
            user_agent, screen_resolution, timezone, language, ip_address
        )
    
    @staticmethod
    def get_client_ip(request):
        """
        Récupère l'adresse IP du client
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @staticmethod
    def has_voted_in_category(fingerprint, category):
        """
        Vérifie si un device a déjà voté dans une catégorie
        """
        from votes.models import Vote
        return Vote.objects.filter(
            device_fingerprint=fingerprint,
            category=category,
            is_valid=True
        ).exists()
