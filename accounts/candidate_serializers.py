"""
Serializers pour le profil candidat
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CandidateProfile
from candidates.models import Candidature, CandidatureFile
from categories.models import Category, CategoryClass

User = get_user_model()


class CandidateProfileSerializer(serializers.ModelSerializer):
    """Serializer pour le profil candidat (lecture seule)"""
    
    class Meta:
        model = CandidateProfile
        fields = [
            'bio', 'facebook_url', 'instagram_url', 
            'youtube_url', 'website_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class CandidateProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la mise à jour du profil candidat"""
    
    bio = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    
    class Meta:
        model = CandidateProfile
        fields = [
            'bio', 'facebook_url', 'instagram_url', 
            'youtube_url', 'website_url'
        ]
    
    def validate_bio(self, value):
        if value and len(value) > 1000:
            raise serializers.ValidationError("La biographie ne peut pas dépasser 1000 caractères.")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer pour les informations utilisateur du candidat"""
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'phone', 'country', 'is_verified', 'profile_picture', 'profile_picture_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'username', 'is_verified', 'created_at', 'updated_at']
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                # Utiliser build_absolute_uri pour construire l'URL complète
                url = request.build_absolute_uri(obj.profile_picture.url)
                # Décoder les caractères spéciaux pour éviter les problèmes d'affichage
                import urllib.parse
                return urllib.parse.unquote(url)
            else:
                # Fallback si pas de request (tests, etc.)
                from django.conf import settings
                return f"{settings.MEDIA_URL}{obj.profile_picture.name}"
        return None


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la mise à jour des informations utilisateur"""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'country', 'profile_picture']
    
    def validate_phone(self, value):
        if value and len(value) < 9:
            raise serializers.ValidationError("Le numéro de téléphone doit contenir au moins 9 chiffres.")
        return value


class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories dans le profil candidat"""
    category_class = serializers.StringRelatedField(source='category_class.name', read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'category_class', 'is_active']


class CandidatureFileSerializer(serializers.ModelSerializer):
    """Serializer pour les fichiers de candidature"""
    
    class Meta:
        model = CandidatureFile
        fields = ['id', 'file', 'file_type', 'description', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class CandidatureSerializer(serializers.ModelSerializer):
    """Serializer pour les candidatures du candidat"""
    category = CategorySerializer(read_only=True)
    files = CandidatureFileSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    vote_count = serializers.SerializerMethodField()
    ranking = serializers.SerializerMethodField()
    can_be_modified = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'category', 'status', 'status_display', 'published',
            'submitted_at', 'reviewed_at', 'files', 'vote_count', 'ranking', 'can_be_modified'
        ]
        read_only_fields = ['id', 'submitted_at', 'reviewed_at']
    
    def get_vote_count(self, obj):
        """Retourne le nombre de votes reçus"""
        return obj.get_vote_count()
    
    def get_ranking(self, obj):
        """Retourne le rang dans la catégorie"""
        return obj.get_ranking_in_category()
    
    def get_can_be_modified(self, obj):
        """Retourne si la candidature peut être modifiée"""
        return obj.can_be_modified()


class CandidatureCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer une nouvelle candidature"""
    
    class Meta:
        model = Candidature
        fields = ['category']
    
    def validate_category(self, value):
        if not value.is_active:
            raise serializers.ValidationError("Cette catégorie n'est pas active.")
        return value
    
    def validate(self, attrs):
        category = attrs.get('category')
        user = self.context['request'].user
        
        # Vérifier qu'il n'y a pas déjà une candidature pour cette catégorie
        existing = Candidature.objects.filter(
            candidate__user=user,
            category=category
        ).exists()
        
        if existing:
            raise serializers.ValidationError(
                "Vous avez déjà une candidature pour cette catégorie."
            )
        
        return attrs


class CandidateDashboardSerializer(serializers.ModelSerializer):
    """Serializer complet pour le dashboard candidat"""
    user = UserProfileSerializer(read_only=True)
    candidate_profile = CandidateProfileSerializer(read_only=True)
    candidatures = CandidatureSerializer(many=True, read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = [
            'user', 'candidate_profile', 'candidatures',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer pour le changement de mot de passe"""
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Les nouveaux mots de passe ne correspondent pas.")
        return attrs
    
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Le mot de passe actuel est incorrect.")
        return value
