"""
Module pour la gestion des envois d'emails
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


def send_otp_email(user, otp_code):
    """
    Envoie un email avec le code OTP pour la vérification de l'email
    
    Args:
        user: Instance de User
        otp_code: Code OTP à 6 chiffres
    
    Returns:
        bool: True si l'email a été envoyé avec succès, False sinon
    """
    try:
        subject = "Code de vérification - Makona Awards 2025"
        
        # Corps de l'email en texte brut
        message = f"""
Bonjour {user.get_full_name() or user.email},

Votre code de vérification pour Makona Awards 2025 est : {otp_code}

Ce code est valide pendant 10 minutes.

Si vous n'avez pas demandé ce code, ignorez cet email.

Cordialement,
L'équipe Makona Awards
        """
        
        # Envoyer l'email
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@makonaawards.com')
        
        send_mail(
            subject=subject,
            message=strip_tags(message),
            from_email=from_email,
            recipient_list=[user.email],
            fail_silently=False,
        )
        
        return True
        
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email OTP: {str(e)}")
        # En développement, on peut logger l'erreur sans faire échouer
        # En production, vous pourriez vouloir utiliser un service de logging
        return False


def send_welcome_email(user):
    """
    Envoie un email de bienvenue après vérification de l'email
    
    Args:
        user: Instance de User
    
    Returns:
        bool: True si l'email a été envoyé avec succès, False sinon
    """
    try:
        subject = "Bienvenue sur Makona Awards 2025"
        
        message = f"""
Bonjour {user.get_full_name() or user.email},

Félicitations ! Votre compte a été vérifié avec succès.

Vous pouvez maintenant participer aux Makona Awards 2025.

Bienvenue dans notre communauté !

Cordialement,
L'équipe Makona Awards
        """
        
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@makonaawards.com')
        
        send_mail(
            subject=subject,
            message=strip_tags(message),
            from_email=from_email,
            recipient_list=[user.email],
            fail_silently=False,
        )
        
        return True
        
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email de bienvenue: {str(e)}")
        return False

