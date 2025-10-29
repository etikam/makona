"""
Modèles pour l'app categories
"""
from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator


class CategoryClass(models.Model):
    """
    Classe de catégories pour grouper les catégories par domaine
    Exemples: Social, Culture, Innovation, Sport, etc.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom de la classe"
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        verbose_name="Slug"
    )
    description = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Description"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Ordre d'affichage"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )

    class Meta:
        verbose_name = "Classe de catégorie"
        verbose_name_plural = "Classes de catégories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_categories_count(self):
        """Retourne le nombre de catégories dans cette classe"""
        return self.categories.filter(is_active=True).count()


def validate_photo_extensions(value):
    """Valide les extensions de fichiers pour les photos"""
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff']
    if hasattr(value, 'name'):
        extension = value.name.split('.')[-1].lower()
        if extension not in allowed_extensions:
            raise ValidationError(
                f"Extension de fichier non autorisée pour les photos. "
                f"Extensions autorisées: {', '.join(allowed_extensions)}"
            )


def validate_video_extensions(value):
    """Valide les extensions de fichiers pour les vidéos"""
    allowed_extensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']
    if hasattr(value, 'name'):
        extension = value.name.split('.')[-1].lower()
        if extension not in allowed_extensions:
            raise ValidationError(
                f"Extension de fichier non autorisée pour les vidéos. "
                f"Extensions autorisées: {', '.join(allowed_extensions)}"
            )


def validate_audio_extensions(value):
    """Valide les extensions de fichiers pour les audios"""
    allowed_extensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a']
    if hasattr(value, 'name'):
        extension = value.name.split('.')[-1].lower()
        if extension not in allowed_extensions:
            raise ValidationError(
                f"Extension de fichier non autorisée pour les audios. "
                f"Extensions autorisées: {', '.join(allowed_extensions)}"
            )


def validate_portfolio_extensions(value):
    """Valide les extensions de fichiers pour les portfolios"""
    allowed_extensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'rar', '7z']
    if hasattr(value, 'name'):
        extension = value.name.split('.')[-1].lower()
        if extension not in allowed_extensions:
            raise ValidationError(
                f"Extension de fichier non autorisée pour les portfolios. "
                f"Extensions autorisées: {', '.join(allowed_extensions)}"
            )


def validate_document_extensions(value):
    """Valide les extensions de fichiers pour les documents"""
    allowed_extensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx']
    if hasattr(value, 'name'):
        extension = value.name.split('.')[-1].lower()
        if extension not in allowed_extensions:
            raise ValidationError(
                f"Extension de fichier non autorisée pour les documents. "
                f"Extensions autorisées: {', '.join(allowed_extensions)}"
            )


def validate_video_duration(value):
    """Valide la durée maximale des vidéos"""
    if value is not None:
        if value < 1:
            raise ValidationError("La durée minimale d'une vidéo doit être d'au moins 1 seconde")
        if value > 3600:  # 1 heure max
            raise ValidationError("La durée maximale d'une vidéo ne peut pas dépasser 3600 secondes (1 heure)")


def validate_audio_duration(value):
    """Valide la durée maximale des audios"""
    if value is not None:
        if value < 1:
            raise ValidationError("La durée minimale d'un audio doit être d'au moins 1 seconde")
        if value > 1800:  # 30 minutes max
            raise ValidationError("La durée maximale d'un audio ne peut pas dépasser 1800 secondes (30 minutes)")


class Category(models.Model):
    """
    Modèle pour les catégories des Makona Awards
    """
    category_class = models.ForeignKey(
        CategoryClass,
        on_delete=models.CASCADE,
        related_name='categories',
        verbose_name="Classe de catégorie",
        help_text="Classe à laquelle appartient cette catégorie",
        null=True,
        blank=True
    )
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
    description = models.TextField(
        max_length=500,
        verbose_name="Description"
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
    requires_documents = models.BooleanField(
        default=False,
        verbose_name="Documents obligatoires"
    )
   
    max_video_duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Durée max vidéo (secondes)",
        help_text="Durée maximale autorisée pour les vidéos (en secondes)",
        validators=[validate_video_duration]
    )
    
    max_audio_duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Durée max audio (secondes)",
        help_text="Durée maximale autorisée pour les audios (en secondes)",
        validators=[validate_audio_duration]
    )
    
    # Configuration des prix
    awards_trophy = models.BooleanField(
        default=False,
        verbose_name="Trophée",
        help_text="Cette catégorie attribue un trophée"
    )
    awards_certificate = models.BooleanField(
        default=False,
        verbose_name="Satisfecit",
        help_text="Cette catégorie attribue un satisfecit"
    )
    awards_monetary = models.BooleanField(
        default=False,
        verbose_name="Primes monétaires",
        help_text="Cette catégorie attribue des primes monétaires"
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
            'documents': self.requires_documents,
            'max_video_duration': self.max_video_duration,
            'max_audio_duration': self.max_audio_duration,
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
        if self.requires_documents:
            required.append('documents')
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
    
    def get_file_validators(self):
        """
        Retourne un dictionnaire des validateurs d'extensions par type de média
        """
        return {
            'photo': validate_photo_extensions,
            'video': validate_video_extensions,
            'audio': validate_audio_extensions,
            'portfolio': validate_portfolio_extensions,
            'documents': validate_document_extensions,
        }
    
    def get_allowed_extensions(self):
        """
        Retourne un dictionnaire des extensions autorisées par type de média
        """
        return {
            'photo': ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'],
            'video': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
            'audio': ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
            'portfolio': ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'rar', '7z'],
            'documents': ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'],
        }
    
    def get_duration_limits(self):
        """
        Retourne les limites de durée pour les médias
        """
        return {
            'video': {
                'min': 1,
                'max': 3600,  # 1 heure
                'current': self.max_video_duration
            },
            'audio': {
                'min': 1,
                'max': 1800,  # 30 minutes
                'current': self.max_audio_duration
            }
        }