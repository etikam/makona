"""
Serializers pour l'app candidates
"""
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Candidature, CandidatureFile
from categories.models import Category
from accounts.models import User


class CandidatureFileSerializer(serializers.ModelSerializer):
    """
    Serializer pour les fichiers de candidature
    """
    file_size = serializers.SerializerMethodField()
    file_extension = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CandidatureFile
        fields = [
            'id', 'file_type', 'file', 'file_url', 'title', 'order',
            'file_size', 'file_extension', 'uploaded_at'
        ]
        read_only_fields = ['id', 'file_size', 'file_extension', 'file_url', 'uploaded_at']
    
    def get_file_size(self, obj):
        return obj.get_file_size()
    
    def get_file_extension(self, obj):
        return obj.get_file_extension()
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None
    
    def validate_file(self, value):
        """
        Validation personnalisée du fichier
        """
        # Vérifier la taille du fichier (10MB max)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError("Le fichier ne peut pas dépasser 10MB.")
        
        return value


class CandidatureFileCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer des fichiers de candidature
    """
    class Meta:
        model = CandidatureFile
        fields = ['file_type', 'file', 'title', 'order']
    
    def validate(self, attrs):
        file_type = attrs.get('file_type')
        file = attrs.get('file')
        
        if file:
            # Validation basique du type de fichier
            extension = file.name.split('.')[-1].lower()
            
            type_extensions = {
                'photo': ['jpg', 'jpeg', 'png', 'gif'],
                'video': ['mp4', 'avi', 'mov'],
                'audio': ['mp3', 'wav'],
                'portfolio': ['pdf', 'doc', 'docx']
            }
            
            if file_type in type_extensions:
                if extension not in type_extensions[file_type]:
                    raise serializers.ValidationError(
                        f"Le fichier doit être de type {file_type}. Extensions acceptées: {', '.join(type_extensions[file_type])}"
                    )
        
        return attrs


class CandidatureSerializer(serializers.ModelSerializer):
    """
    Serializer pour les candidatures
    """
    candidate = serializers.StringRelatedField(read_only=True)
    candidate_name = serializers.CharField(source='candidate.get_full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    files = CandidatureFileSerializer(many=True, read_only=True)
    status_color = serializers.CharField(source='get_status_display_color', read_only=True)
    # "source" est redondant quand il est identique au nom du champ
    can_be_modified = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'candidate_name', 'candidate_email',
            'category', 'category_name', 'category_slug', 'status',
            'status_color', 'submitted_at', 'reviewed_at', 'reviewed_by',
            'reviewed_by_name', 'rejection_reason', 'files',
            'can_be_modified'
        ]
        read_only_fields = [
            'id', 'candidate', 'submitted_at', 'reviewed_at', 
            'reviewed_by', 'status'
        ]


class CandidatureCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer une candidature
    """
    files = CandidatureFileCreateSerializer(many=True, required=False)
    
    class Meta:
        model = Candidature
        fields = ['category', 'files']
    
    def validate_category(self, value):
        """
        Validation de la catégorie
        """
        if not value.is_active:
            raise serializers.ValidationError("Cette catégorie n'est pas active.")
        
        return value
    
    def validate(self, attrs):
        """
        Validation globale de la candidature
        """
        category = attrs.get('category')
        files = attrs.get('files', [])
        
        if not files:
            raise serializers.ValidationError("Au moins un fichier est requis.")
        
        # Vérifier les exigences de fichiers de la catégorie
        file_types = [file_data.get('file_type') for file_data in files]
        is_valid, message = category.validate_file_requirements(file_types)
        
        if not is_valid:
            raise serializers.ValidationError(message)
        
        return attrs
    
    def create(self, validated_data):
        """
        Créer la candidature avec ses fichiers
        """
        files_data = validated_data.pop('files', [])
        candidature = Candidature.objects.create(
            candidate=self.context['request'].user,
            **validated_data
        )
        
        # Créer les fichiers
        for file_data in files_data:
            CandidatureFile.objects.create(
                candidature=candidature,
                **file_data
            )
        
        return candidature


class CandidatureUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer pour mettre à jour une candidature
    """
    files = CandidatureFileCreateSerializer(many=True, required=False)
    
    class Meta:
        model = Candidature
        fields = ['files']
    
    def validate(self, attrs):
        """
        Validation pour la mise à jour
        """
        candidature = self.instance
        
        if not candidature.can_be_modified():
            raise serializers.ValidationError("Cette candidature ne peut plus être modifiée.")
        
        files = attrs.get('files', [])
        if files:
            file_types = [file_data.get('file_type') for file_data in files]
            is_valid, message = candidature.category.validate_file_requirements(file_types)
            
            if not is_valid:
                raise serializers.ValidationError(message)
        
        return attrs
    
    def update(self, instance, validated_data):
        """
        Mettre à jour la candidature et ses fichiers
        """
        files_data = validated_data.pop('files', [])
        
        # Supprimer les anciens fichiers si de nouveaux sont fournis
        if files_data:
            instance.files.all().delete()
            
            # Créer les nouveaux fichiers
            for file_data in files_data:
                CandidatureFile.objects.create(
                    candidature=instance,
                    **file_data
                )
        
        return instance


class CandidatureListSerializer(serializers.ModelSerializer):
    """
    Serializer simplifié pour la liste des candidatures
    """
    candidate_name = serializers.CharField(source='candidate.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    files_count = serializers.SerializerMethodField()
    status_color = serializers.CharField(source='get_status_display_color', read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate_name', 'category_name', 'category_slug',
            'status', 'status_color', 'submitted_at', 'files_count'
        ]
    
    def get_files_count(self, obj):
        return obj.files.count()


class CandidatureAdminSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'admin (avec plus de détails)
    """
    candidate_name = serializers.CharField(source='candidate.get_full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    candidate_phone = serializers.CharField(source='candidate.phone', read_only=True)
    candidate_country = serializers.CharField(source='candidate.country', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_class_name = serializers.CharField(source='category.category_class.name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    files = CandidatureFileSerializer(many=True, read_only=True)
    vote_count = serializers.SerializerMethodField()
    ranking = serializers.SerializerMethodField()
    can_be_modified = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'candidate_name', 'candidate_email',
            'candidate_phone', 'candidate_country', 'category', 'category_name',
            'category_class_name', 'status', 'published', 'submitted_at', 
            'reviewed_at', 'reviewed_by', 'reviewed_by_name', 'rejection_reason', 
            'description', 'files', 'vote_count', 'ranking', 'can_be_modified'
        ]
        read_only_fields = [
            'id', 'candidate', 'category', 'submitted_at'
        ]
    
    def get_vote_count(self, obj):
        """Retourne le nombre de votes reçus"""
        return obj.get_vote_count()
    
    def get_ranking(self, obj):
        """Retourne le rang dans la catégorie"""
        return obj.get_ranking_in_category()
    
    def get_can_be_modified(self, obj):
        """Retourne si la candidature peut être modifiée"""
        return obj.can_be_modified()


class CandidatureAdminCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour la création de candidatures par l'admin
    """
    candidate_name = serializers.CharField(source='candidate.get_full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_class_name = serializers.CharField(source='category.category_class.name', read_only=True)
    can_be_modified = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'candidate_name', 'candidate_email', 'category', 
            'category_name', 'category_class_name', 'description', 'status', 
            'published', 'submitted_at', 'can_be_modified'
        ]
        read_only_fields = ['id', 'submitted_at']
    
    def create(self, validated_data):
        # S'assurer que submitted_at est défini
        validated_data['submitted_at'] = timezone.now()
        return super().create(validated_data)
    
    def get_can_be_modified(self, obj):
        """Retourne si la candidature peut être modifiée"""
        return obj.can_be_modified()
