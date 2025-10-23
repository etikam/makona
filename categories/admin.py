"""
Admin pour l'app categories
"""
from django.contrib import admin
from django.utils.html import format_html

from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin pour le modèle Category
    """
    list_display = [
        'name', 'slug', 'icon', 'is_active', 'requires_photo',
        'requires_video', 'requires_portfolio', 'requires_audio',
        'candidatures_count', 'created_at'
    ]
    list_filter = [
        'is_active', 'requires_photo', 'requires_video', 
        'requires_portfolio', 'requires_audio', 'created_at'
    ]
    search_fields = ['name', 'description', 'icon']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'slug', 'icon', 'description', 'color_gradient', 'is_active')
        }),
        ('Exigences de fichiers', {
            'fields': (
                'requires_photo', 'requires_video', 'requires_portfolio', 
                'requires_audio', 'max_video_duration'
            ),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def candidatures_count(self, obj):
        count = obj.candidatures.count()
        if count > 0:
            return format_html('<span style="color: blue;">{}</span>', count)
        return format_html('<span style="color: gray;">0</span>')
    candidatures_count.short_description = 'Candidatures'
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('candidatures')