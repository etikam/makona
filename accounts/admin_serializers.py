"""
Sérialiseurs pour l'administration
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User, CandidateProfile
from candidates.models import Candidature, CandidatureFile
from categories.models import Category

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la gestion des utilisateurs par l'admin"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    candidate_profile = serializers.SerializerMethodField()
    candidatures_count = serializers.SerializerMethodField()
    is_verified_display = serializers.CharField(source='get_is_verified_display', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'phone', 'country', 'user_type', 'is_verified', 'is_verified_display',
            'is_active', 'date_joined', 'created_at', 'updated_at',
            'candidate_profile', 'candidatures_count'
        ]
        read_only_fields = ['id', 'date_joined', 'created_at', 'updated_at']
    
    def get_candidate_profile(self, obj):
        if obj.user_type == 'candidate' and hasattr(obj, 'candidate_profile'):
            return AdminCandidateProfileSerializer(obj.candidate_profile).data
        return None
    
    def get_candidatures_count(self, obj):
        if obj.user_type == 'candidate':
            return obj.candidatures.count()
        return 0


class AdminCandidateProfileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les profils candidats (admin)"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'user_email', 'user_full_name', 'bio', 'facebook_url',
            'instagram_url', 'youtube_url', 'website_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminCandidatureFileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les fichiers de candidature (admin)"""
    file_size = serializers.SerializerMethodField()
    file_extension = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CandidatureFile
        fields = [
            'id', 'file_type', 'file', 'file_url', 'title', 'order',
            'file_size', 'file_extension', 'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_at']
    
    def get_file_size(self, obj):
        return obj.get_file_size()
    
    def get_file_extension(self, obj):
        return obj.get_file_extension()
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class AdminCandidatureSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les candidatures (admin)"""
    candidate_name = serializers.CharField(source='candidate.get_full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    files = AdminCandidatureFileSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    can_be_modified = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'candidate_name', 'candidate_email',
            'category', 'category_name', 'status', 'status_display',
            'submitted_at', 'reviewed_at', 'reviewed_by', 'reviewed_by_name',
            'rejection_reason', 'files', 'can_be_modified'
        ]
        read_only_fields = ['id', 'submitted_at', 'reviewed_at', 'reviewed_by']


class AdminCategorySerializer(serializers.ModelSerializer):
    """Sérialiseur pour les catégories (admin)"""
    candidatures_count = serializers.SerializerMethodField()
    required_file_types = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'icon', 'description', 'color_gradient',
            'is_active', 'requires_photo', 'requires_video', 'requires_portfolio',
            'requires_audio', 'max_video_duration', 'candidatures_count',
            'required_file_types', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_candidatures_count(self, obj):
        return obj.candidatures.count()
    
    def get_required_file_types(self, obj):
        return obj.get_required_file_types()


class CreateUserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour créer un utilisateur (admin)"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    # Champs du profil candidat (optionnels)
    bio = serializers.CharField(write_only=True, required=False, allow_blank=True)
    facebook_url = serializers.URLField(write_only=True, required=False, allow_blank=True)
    instagram_url = serializers.URLField(write_only=True, required=False, allow_blank=True)
    youtube_url = serializers.URLField(write_only=True, required=False, allow_blank=True)
    website_url = serializers.URLField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 'phone',
            'country', 'user_type', 'password', 'password_confirm',
            'bio', 'facebook_url', 'instagram_url', 'youtube_url', 'website_url'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user_type = validated_data.get('user_type')
        
        # Extraire les données du profil candidat
        profile_data = {}
        profile_fields = ['bio', 'facebook_url', 'instagram_url', 'youtube_url', 'website_url']
        for field in profile_fields:
            if field in validated_data:
                profile_data[field] = validated_data.pop(field)
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Si c'est un candidat, créer automatiquement le profil candidat
        if user_type == 'candidate':
            from accounts.models import CandidateProfile
            CandidateProfile.objects.create(
                user=user,
                bio=profile_data.get('bio', ''),
                facebook_url=profile_data.get('facebook_url', ''),
                instagram_url=profile_data.get('instagram_url', ''),
                youtube_url=profile_data.get('youtube_url', ''),
                website_url=profile_data.get('website_url', '')
            )
        
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour mettre à jour un utilisateur (admin)"""
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 'phone',
            'country', 'user_type', 'is_verified', 'is_active'
        ]
    
    def update(self, instance, validated_data):
        # Si l'email change, on doit vérifier l'unicité
        if 'email' in validated_data and validated_data['email'] != instance.email:
            if User.objects.filter(email=validated_data['email']).exclude(id=instance.id).exists():
                raise serializers.ValidationError("Un utilisateur avec cet email existe déjà.")
        
        return super().update(instance, validated_data)


class CreateCandidateProfileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour créer un profil candidat (admin)"""
    
    class Meta:
        model = CandidateProfile
        fields = ['user', 'bio', 'facebook_url', 'instagram_url', 'youtube_url', 'website_url']
    
    def create(self, validated_data):
        # Vérifier que l'utilisateur est un candidat
        user = validated_data['user']
        if user.user_type != 'candidate':
            raise serializers.ValidationError("L'utilisateur doit être un candidat.")
        
        # Vérifier qu'il n'a pas déjà un profil
        if hasattr(user, 'candidate_profile'):
            raise serializers.ValidationError("Cet utilisateur a déjà un profil candidat.")
        
        return super().create(validated_data)


class UpdateCandidateProfileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour mettre à jour un profil candidat (admin)"""
    
    class Meta:
        model = CandidateProfile
        fields = ['bio', 'facebook_url', 'instagram_url', 'youtube_url', 'website_url']
