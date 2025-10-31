"""
Modèles pour les paramètres de la plateforme
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Settings(models.Model):
    """
    Modèle singleton pour les paramètres globaux de la plateforme
    """
    
    # Chronomètre
    countdown_enabled = models.BooleanField(
        default=True,
        verbose_name="Activer le chronomètre"
    )
    countdown_target_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date cible du chronomètre",
        help_text="Date à laquelle le chronomètre se terminera"
    )
    
    # Carousel Hero Section
    hero_carousel_enabled = models.BooleanField(
        default=True,
        verbose_name="Activer le carousel"
    )
    hero_carousel_auto_play = models.BooleanField(
        default=True,
        verbose_name="Lecture automatique"
    )
    hero_carousel_interval = models.IntegerField(
        default=5000,
        validators=[MinValueValidator(1000), MaxValueValidator(30000)],
        verbose_name="Intervalle entre les slides (ms)",
        help_text="Temps entre chaque transition (1000-30000 ms)"
    )
    
    # Informations générales
    site_title = models.CharField(
        max_length=200,
        default="Makona Awards 2025",
        verbose_name="Titre du site"
    )
    site_description = models.TextField(
        blank=True,
        verbose_name="Description du site",
        help_text="Meta description pour le SEO"
    )
    contact_email = models.EmailField(
        blank=True,
        verbose_name="Email de contact"
    )
    contact_phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Téléphone de contact"
    )
    
    # Réseaux sociaux
    facebook_url = models.URLField(blank=True, verbose_name="URL Facebook")
    instagram_url = models.URLField(blank=True, verbose_name="URL Instagram")
    twitter_url = models.URLField(blank=True, verbose_name="URL Twitter/X")
    youtube_url = models.URLField(blank=True, verbose_name="URL YouTube")
    linkedin_url = models.URLField(blank=True, verbose_name="URL LinkedIn")
    
    # Dates importantes
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Paramètres"
        verbose_name_plural = "Paramètres"
    
    def __str__(self):
        return "Paramètres de la plateforme"
    
    def save(self, *args, **kwargs):
        # S'assurer qu'il n'y a qu'une seule instance
        self.pk = 1
        super(Settings, self).save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Empêcher la suppression
        pass


class HeroCarouselImage(models.Model):
    """
    Images pour le carousel de la section Hero
    """
    ORDER_CHOICES = [
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    ]
    
    image = models.ImageField(
        upload_to='hero_carousel/',
        verbose_name="Image"
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Titre",
        help_text="Titre optionnel pour l'image"
    )
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Texte alternatif",
        help_text="Description de l'image pour l'accessibilité"
    )
    order = models.IntegerField(
        choices=ORDER_CHOICES,
        default=1,
        verbose_name="Ordre d'affichage"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Image du carousel Hero"
        verbose_name_plural = "Images du carousel Hero"
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.title or f"Image {self.order}"


class TeamMember(models.Model):
    """
    Membres de l'équipe
    """
    MEMBER_TYPE_CHOICES = [
        ('active_bureau', 'Bureau Actif'),
        ('member', 'Membre'),
    ]
    
    ROLE_CHOICES = [
        ('president', 'Président'),
        ('vice_president', 'Vice-Président'),
        ('secretary', 'Secrétaire'),
        ('treasurer', 'Trésorier'),
        ('member', 'Membre'),
        ('advisor', 'Conseiller'),
    ]
    
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    email = models.EmailField(blank=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    
    photo = models.ImageField(
        upload_to='team_members/',
        null=True,
        blank=True,
        verbose_name="Photo"
    )
    
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default='member',
        verbose_name="Rôle"
    )
    
    member_type = models.CharField(
        max_length=20,
        choices=MEMBER_TYPE_CHOICES,
        default='member',
        verbose_name="Type de membre"
    )
    
    bio = models.TextField(
        blank=True,
        verbose_name="Biographie"
    )
    
    order = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage",
        help_text="Ordre d'affichage (plus petit = plus haut)"
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif"
    )
    
    # Réseaux sociaux (optionnels)
    facebook_url = models.URLField(blank=True, verbose_name="URL Facebook")
    linkedin_url = models.URLField(blank=True, verbose_name="URL LinkedIn")
    twitter_url = models.URLField(blank=True, verbose_name="URL Twitter/X")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Membre de l'équipe"
        verbose_name_plural = "Membres de l'équipe"
        ordering = ['member_type', 'order', 'last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_member_type_display()})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class HallOfFame(models.Model):
    """
    Hall of Fame - Lauréats et récompenses
    """
    YEAR_CHOICES = [
        (2022, '2022'),
        (2023, '2023'),
        (2024, '2024'),
        (2025, '2025'),
        (2026, '2026'),
    ]
    
    year = models.IntegerField(
        choices=YEAR_CHOICES,
        verbose_name="Année"
    )
    category_name = models.CharField(
        max_length=200,
        verbose_name="Catégorie/Prix"
    )
    
    winner_name = models.CharField(
        max_length=200,
        verbose_name="Nom du lauréat"
    )
    
    winner_photo = models.ImageField(
        upload_to='hall_of_fame/',
        null=True,
        blank=True,
        verbose_name="Photo du lauréat"
    )
    
    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )
    
    award_type = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Type de récompense",
        help_text="Ex: 1er Prix, Meilleur Performance, etc."
    )
    
    order = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage"
    )
    
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Mis en avant"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Hall of Fame"
        verbose_name_plural = "Hall of Fame"
        ordering = ['-year', 'order', 'category_name']
    
    def __str__(self):
        return f"{self.winner_name} - {self.category_name} ({self.year})"

