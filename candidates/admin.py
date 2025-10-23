"""
Admin pour l'app candidates
"""
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

from .models import Candidature, CandidatureFile


class CandidatureFileInline(admin.TabularInline):
    """
    Inline pour les fichiers de candidature
    """
    model = CandidatureFile
    extra = 0
    readonly_fields = ['uploaded_at', 'file_size', 'file_extension']
    fields = ['file_type', 'file', 'title', 'order', 'uploaded_at', 'file_size', 'file_extension']
    
    def file_size(self, obj):
        if obj.pk:
            return f"{obj.get_file_size()} MB"
        return "-"
    file_size.short_description = "Taille"
    
    def file_extension(self, obj):
        if obj.pk:
            return obj.get_file_extension()
        return "-"
    file_extension.short_description = "Extension"


@admin.register(Candidature)
class CandidatureAdmin(admin.ModelAdmin):
    """
    Admin pour le modèle Candidature
    """
    list_display = [
        'candidate_name', 'category_name', 'status_colored', 
        'submitted_at', 'reviewed_at', 'files_count', 'admin_actions'
    ]
    list_filter = [
        'status', 'category', 'candidate__country', 
        'submitted_at', 'reviewed_at'
    ]
    search_fields = [
        'candidate__first_name', 'candidate__last_name', 
        'candidate__email', 'category__name'
    ]
    readonly_fields = [
        'submitted_at', 'reviewed_at', 'reviewed_by'
    ]
    inlines = [CandidatureFileInline]
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('candidate', 'category', 'status')
        }),
        ('Révision', {
            'fields': ('reviewed_by', 'reviewed_at', 'rejection_reason'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('submitted_at',),
            'classes': ('collapse',)
        }),
    )
    
    def candidate_name(self, obj):
        return obj.candidate.get_full_name()
    candidate_name.short_description = "Candidat"
    candidate_name.admin_order_field = 'candidate__first_name'
    
    def category_name(self, obj):
        return obj.category.name
    category_name.short_description = "Catégorie"
    category_name.admin_order_field = 'category__name'
    
    def status_colored(self, obj):
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'rejected': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_colored.short_description = "Statut"
    status_colored.admin_order_field = 'status'
    
    def files_count(self, obj):
        count = obj.files.count()
        if count > 0:
            return format_html('<span style="color: blue;">{}</span>', count)
        return format_html('<span style="color: gray;">0</span>')
    files_count.short_description = "Fichiers"
    
    def admin_actions(self, obj):
        if obj.status == 'pending':
            approve_url = reverse('admin:approve_candidature', args=[obj.id])
            reject_url = reverse('admin:reject_candidature', args=[obj.id])
            return format_html(
                '<a href="{}" style="color: green; margin-right: 10px;">✓ Approuver</a>'
                '<a href="{}" style="color: red;">✗ Rejeter</a>',
                approve_url, reject_url
            )
        return "-"
    admin_actions.short_description = "Actions"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'candidate', 'category', 'reviewed_by'
        ).prefetch_related('files')


@admin.register(CandidatureFile)
class CandidatureFileAdmin(admin.ModelAdmin):
    """
    Admin pour le modèle CandidatureFile
    """
    list_display = [
        'candidature_info', 'file_type', 'file_name', 
        'file_size', 'file_extension', 'uploaded_at'
    ]
    list_filter = ['file_type', 'uploaded_at']
    search_fields = [
        'candidature__candidate__first_name',
        'candidature__candidate__last_name',
        'candidature__category__name',
        'title'
    ]
    readonly_fields = ['uploaded_at', 'file_size', 'file_extension', 'file_preview']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('candidature', 'file_type', 'file', 'title', 'order')
        }),
        ('Détails du fichier', {
            'fields': ('file_size', 'file_extension', 'file_preview'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('uploaded_at',),
            'classes': ('collapse',)
        }),
    )
    
    def candidature_info(self, obj):
        return f"{obj.candidature.candidate.get_full_name()} - {obj.candidature.category.name}"
    candidature_info.short_description = "Candidature"
    candidature_info.admin_order_field = 'candidature__candidate__first_name'
    
    def file_name(self, obj):
        if obj.file:
            return obj.file.name.split('/')[-1]
        return "-"
    file_name.short_description = "Nom du fichier"
    
    def file_size(self, obj):
        return f"{obj.get_file_size()} MB"
    file_size.short_description = "Taille"
    
    def file_extension(self, obj):
        return obj.get_file_extension()
    file_extension.short_description = "Extension"
    
    def file_preview(self, obj):
        if obj.file and obj.is_image():
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;" />',
                obj.file.url
            )
        elif obj.file:
            return format_html(
                '<a href="{}" target="_blank">Voir le fichier</a>',
                obj.file.url
            )
        return "-"
    file_preview.short_description = "Aperçu"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'candidature__candidate', 'candidature__category'
        )