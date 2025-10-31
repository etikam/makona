"""
Admin pour l'app settings
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Settings, HeroCarouselImage, TeamMember, HallOfFame


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    """Admin pour les paramètres globaux"""
    
    def has_add_permission(self, request):
        # Empêcher l'ajout de nouvelles instances
        return not Settings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Empêcher la suppression
        return False
    
    fieldsets = (
        ('Chronomètre', {
            'fields': ('countdown_enabled', 'countdown_target_date')
        }),
        ('Carousel Hero Section', {
            'fields': ('hero_carousel_enabled', 'hero_carousel_auto_play', 'hero_carousel_interval')
        }),
        ('Informations générales', {
            'fields': ('site_title', 'site_description', 'contact_email', 'contact_phone')
        }),
        ('Réseaux sociaux', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url', 'youtube_url', 'linkedin_url'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


class HeroCarouselImageAdmin(admin.ModelAdmin):
    """Admin pour les images du carousel"""
    list_display = ['title', 'order', 'is_active', 'image_preview', 'created_at']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'alt_text']
    
    fieldsets = (
        ('Image', {
            'fields': ('image', 'title', 'alt_text', 'order', 'is_active')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px;" />',
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Aperçu"


admin.site.register(HeroCarouselImage, HeroCarouselImageAdmin)


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    """Admin pour les membres de l'équipe"""
    list_display = ['full_name', 'member_type', 'role', 'is_active', 'order']
    list_filter = ['member_type', 'role', 'is_active']
    search_fields = ['first_name', 'last_name', 'email']
    list_editable = ['order', 'is_active']
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'photo')
        }),
        ('Rôle et type', {
            'fields': ('member_type', 'role', 'order', 'is_active')
        }),
        ('Biographie', {
            'fields': ('bio',)
        }),
        ('Réseaux sociaux', {
            'fields': ('facebook_url', 'linkedin_url', 'twitter_url'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(HallOfFame)
class HallOfFameAdmin(admin.ModelAdmin):
    """Admin pour le Hall of Fame"""
    list_display = ['winner_name', 'category_name', 'year', 'award_type', 'is_featured', 'order']
    list_filter = ['year', 'is_featured']
    search_fields = ['winner_name', 'category_name']
    list_editable = ['order', 'is_featured']
    
    fieldsets = (
        ('Informations du lauréat', {
            'fields': ('winner_name', 'winner_photo', 'description')
        }),
        ('Prix et catégorie', {
            'fields': ('year', 'category_name', 'award_type')
        }),
        ('Affichage', {
            'fields': ('order', 'is_featured')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']

