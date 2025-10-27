"""
Configuration de l'admin Django pour l'app categories
"""
from django.contrib import admin
from .models import Category, CategoryClass


@admin.register(CategoryClass)
class CategoryClassAdmin(admin.ModelAdmin):
    """
    Configuration admin pour les classes de catégories
    """
    list_display = [
        'name', 'description', 'is_active', 'order', 
        'categories_count', 'created_at'
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']
    list_editable = ['is_active', 'order']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'description')
        }),
        ('Configuration', {
            'fields': ('is_active', 'order')
        }),
        ('Métadonnées', {
            'fields': ('slug', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['slug', 'created_at', 'updated_at']
    
    def categories_count(self, obj):
        """Afficher le nombre de catégories dans cette classe"""
        return obj.categories.count()
    categories_count.short_description = 'Nombre de catégories'
    categories_count.admin_order_field = 'categories__count'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Configuration admin pour les catégories
    """
    list_display = [
        'name', 'category_class', 'is_active', 'requires_photo',
        'requires_video', 'requires_audio', 'requires_portfolio',
        'requires_documents', 'created_at'
    ]
    list_filter = [
        'is_active', 'category_class', 'requires_photo', 'requires_video',
        'requires_audio', 'requires_portfolio', 'requires_documents',
        'created_at'
    ]
    search_fields = ['name', 'description', 'category_class__name']
    ordering = ['category_class__order', 'name']
    list_editable = ['is_active']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('category_class', 'name', 'description')
        }),
        ('Configuration des médias', {
            'fields': (
                'requires_photo', 'requires_video', 'requires_audio',
                'requires_portfolio', 'requires_documents'
            )
        }),
        ('Limites de durée', {
            'fields': ('max_video_duration', 'max_audio_duration'),
            'classes': ('collapse',)
        }),
        ('Statut', {
            'fields': ('is_active',)
        }),
        ('Métadonnées', {
            'fields': ('slug', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['slug', 'created_at', 'updated_at']
    
    def get_queryset(self, request):
        """Optimiser les requêtes avec select_related"""
        return super().get_queryset(request).select_related('category_class')