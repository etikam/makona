"""
Modèles pour l'app categories
"""
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Modèle pour les catégories des Makona Awards
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom de la catégorie"
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        verbose_name="Slug"
    )
    icon = models.CharField(
        max_length=50,
        verbose_name="Icône Lucide",
        help_text="Nom de l'icône Lucide (ex: Music, Dance, etc.)"
    )
    description = models.TextField(
        max_length=500,
        verbose_name="Description"
    )
    color_gradient = models.CharField(
        max_length=50,
        verbose_name="Dégradé de couleur",
        help_text="Classes Tailwind CSS (ex: from-purple-500 to-pink-500)"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Catégorie active"
    )
    
    # Configuration des fichiers requis
    requires_photo = models.BooleanField(
        default=True,
        verbose_name="Photo obligatoire"
    )
    requires_video = models.BooleanField(
        default=False,
        verbose_name="Vidéo obligatoire"
    )
    requires_portfolio = models.BooleanField(
        default=False,
        verbose_name="Portfolio obligatoire"
    )
    requires_audio = models.BooleanField(
        default=False,
        verbose_name="Audio obligatoire"
    )
    max_video_duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Durée max vidéo (secondes)",
        help_text="Durée maximale autorisée pour les vidéos (en secondes)"
    )
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_file_requirements(self):
        """
        Retourne un dictionnaire des exigences de fichiers
        """
        return {
            'photo': self.requires_photo,
            'video': self.requires_video,
            'portfolio': self.requires_portfolio,
            'audio': self.requires_audio,
            'max_video_duration': self.max_video_duration,
        }
    
    def get_required_file_types(self):
        """
        Retourne la liste des types de fichiers requis
        """
        required = []
        if self.requires_photo:
            required.append('photo')
        if self.requires_video:
            required.append('video')
        if self.requires_portfolio:
            required.append('portfolio')
        if self.requires_audio:
            required.append('audio')
        return required
    
    def validate_file_requirements(self, file_types):
        """
        Valide que tous les types de fichiers requis sont présents
        """
        required_types = self.get_required_file_types()
        provided_types = set(file_types)
        
        missing_types = set(required_types) - provided_types
        if missing_types:
            return False, f"Types de fichiers manquants: {', '.join(missing_types)}"
        
        return True, "Tous les fichiers requis sont présents"