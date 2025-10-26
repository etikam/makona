"""
Modèles pour l'app candidates
"""
import os
import uuid
from django.db import models
from django.core.validators import FileExtensionValidator
from django.conf import settings

from accounts.models import User
from categories.models import Category


def candidature_file_upload_path(instance, filename):
    """
    Génère le chemin d'upload pour les fichiers de candidature
    """
    # Structure: media/candidatures/{candidature_id}/{file_type}/{filename}
    return f'candidatures/{instance.candidature.id}/{instance.file_type}/{filename}'


class Candidature(models.Model):
    """
    Modèle pour les candidatures
    """
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Rejetée'),
    ]
    
    candidate = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'user_type': 'candidate'},
        related_name='candidatures',
        verbose_name="Candidat"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='candidatures',
        verbose_name="Catégorie"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Statut"
    )
    submitted_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de soumission"
    )
    reviewed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de révision"
    )
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'user_type': 'admin'},
        related_name='reviewed_candidatures',
        verbose_name="Révisé par"
    )
    rejection_reason = models.TextField(
        blank=True,
        verbose_name="Raison du rejet",
        help_text="Raison du rejet (si applicable)"
    )
    
    class Meta:
        verbose_name = "Candidature"
        verbose_name_plural = "Candidatures"
        ordering = ['-submitted_at']
        unique_together = ('candidate', 'category')  # Un candidat ne peut postuler qu'une fois par catégorie
    
    def __str__(self):
        return f"{self.candidate.get_full_name()} - {self.category.name}"
    
    def get_status_display_color(self):
        """
        Retourne la couleur CSS pour le statut
        """
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'rejected': 'red',
        }
        return colors.get(self.status, 'gray')
    
    def can_be_modified(self):
        """
        Vérifie si la candidature peut être modifiée
        """
        return self.status == 'pending'
    
    def approve(self, reviewed_by):
        """
        Approuve la candidature
        """
        from django.utils import timezone
        self.status = 'approved'
        self.reviewed_at = timezone.now()
        self.reviewed_by = reviewed_by
        self.rejection_reason = ''
        self.save()
    
    def reject(self, reviewed_by, reason=''):
        """
        Rejette la candidature
        """
        from django.utils import timezone
        self.status = 'rejected'
        self.reviewed_at = timezone.now()
        self.reviewed_by = reviewed_by
        self.rejection_reason = reason
        self.save()


class CandidatureFile(models.Model):
    """
    Modèle pour les fichiers des candidatures
    """
    FILE_TYPE_CHOICES = [
        ('photo', 'Photo'),
        ('video', 'Vidéo'),
        ('portfolio', 'Portfolio'),
        ('audio', 'Audio'),
    ]
    
    candidature = models.ForeignKey(
        Candidature,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name="Candidature"
    )
    file_type = models.CharField(
        max_length=20,
        choices=FILE_TYPE_CHOICES,
        verbose_name="Type de fichier"
    )
    file = models.FileField(
        upload_to=candidature_file_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'pdf', 'doc', 'docx', 'mp3', 'wav']
            )
        ],
        verbose_name="Fichier"
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Titre",
        help_text="Titre descriptif du fichier (optionnel)"
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Ordre",
        help_text="Ordre d'affichage des fichiers"
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'upload"
    )
    
    class Meta:
        verbose_name = "Fichier de candidature"
        verbose_name_plural = "Fichiers de candidature"
        ordering = ['order', 'uploaded_at']
    
    def __str__(self):
        return f"{self.candidature} - {self.get_file_type_display()}"
    
    def get_file_size(self):
        """
        Retourne la taille du fichier en MB
        """
        try:
            size = self.file.size
            return round(size / (1024 * 1024), 2)
        except:
            return 0
    
    def get_file_extension(self):
        """
        Retourne l'extension du fichier
        """
        return os.path.splitext(self.file.name)[1].lower()
    
    def is_image(self):
        """
        Vérifie si le fichier est une image
        """
        return self.get_file_extension() in ['.jpg', '.jpeg', '.png', '.gif']
    
    def is_video(self):
        """
        Vérifie si le fichier est une vidéo
        """
        return self.get_file_extension() in ['.mp4', '.avi', '.mov']
    
    def is_audio(self):
        """
        Vérifie si le fichier est un audio
        """
        return self.get_file_extension() in ['.mp3', '.wav']
    
    def is_document(self):
        """
        Vérifie si le fichier est un document
        """
        return self.get_file_extension() in ['.pdf', '.doc', '.docx']
    
    def validate_file_type(self):
        """
        Valide que le type de fichier correspond au file_type
        """
        if self.file_type == 'photo' and not self.is_image():
            return False, "Le fichier doit être une image"
        elif self.file_type == 'video' and not self.is_video():
            return False, "Le fichier doit être une vidéo"
        elif self.file_type == 'audio' and not self.is_audio():
            return False, "Le fichier doit être un fichier audio"
        elif self.file_type == 'portfolio' and not self.is_document():
            return False, "Le fichier doit être un document"
        
        return True, "Type de fichier valide"