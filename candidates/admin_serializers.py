"""
Sérialiseurs admin pour l'app candidates
"""
from rest_framework import serializers
from .models import Candidature, CandidatureFile
from accounts.models import User
from categories.models import Category


class AdminCandidatureFileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les fichiers de candidature (admin)"""
    file_size = serializers.SerializerMethodField()
    file_extension = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    is_image = serializers.BooleanField(read_only=True)
    is_video = serializers.BooleanField(read_only=True)
    is_audio = serializers.BooleanField(read_only=True)
    is_document = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = CandidatureFile
        fields = [
            'id', 'file_type', 'file', 'file_url', 'title', 'order',
            'file_size', 'file_extension', 'is_image', 'is_video',
            'is_audio', 'is_document', 'uploaded_at'
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
    candidate_phone = serializers.CharField(source='candidate.phone', read_only=True)
    candidate_country = serializers.CharField(source='candidate.get_country_display', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    files = AdminCandidatureFileSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    can_be_modified = serializers.BooleanField(read_only=True)
    days_since_submission = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'candidate_name', 'candidate_email', 'candidate_phone', 'candidate_country',
            'category', 'category_name', 'category_icon', 'status', 'status_display',
            'submitted_at', 'reviewed_at', 'reviewed_by', 'reviewed_by_name',
            'rejection_reason', 'files', 'can_be_modified', 'days_since_submission'
        ]
        read_only_fields = ['id', 'submitted_at', 'reviewed_at', 'reviewed_by']
    
    def get_days_since_submission(self, obj):
        from django.utils import timezone
        delta = timezone.now() - obj.submitted_at
        return delta.days


class AdminCandidatureCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer une candidature (admin)"""
    
    class Meta:
        model = Candidature
        fields = ['candidate', 'category', 'description']
    
    def validate_candidate(self, value):
        """Valider le candidat"""
        if not value:
            raise serializers.ValidationError("Le candidat est obligatoire")
        if not hasattr(value, 'is_candidate') or not value.is_candidate:
            raise serializers.ValidationError("Le candidat spécifié n'est pas valide")
        return value
    
    def validate_category(self, value):
        """Valider la catégorie"""
        if not value:
            raise serializers.ValidationError("La catégorie est obligatoire")
        if not value.is_active:
            raise serializers.ValidationError("La catégorie spécifiée n'est pas active")
        return value
    
    def validate(self, data):
        # Vérifier que le candidat existe et est bien un candidat
        candidate = data.get('candidate')
        if not candidate:
            raise serializers.ValidationError({
                'candidate': ["Le candidat est obligatoire"]
            })
        if not hasattr(candidate, 'is_candidate') or not candidate.is_candidate:
            raise serializers.ValidationError({
                'candidate': ["Le candidat spécifié n'est pas valide"]
            })
        
        # Vérifier que la catégorie est active
        category = data.get('category')
        if not category:
            raise serializers.ValidationError({
                'category': ["La catégorie est obligatoire"]
            })
        if not category.is_active:
            raise serializers.ValidationError({
                'category': ["La catégorie spécifiée n'est pas active"]
            })
        
        # Vérifier qu'il n'y a pas déjà une candidature pour cette catégorie
        existing = Candidature.objects.filter(
            candidate=candidate,
            category=category
        ).exists()
        
        if existing:
            raise serializers.ValidationError({
                'category': ["Ce candidat a déjà une candidature pour cette catégorie. Veuillez choisir une autre catégorie ou modifier la candidature existante."]
            })
        
        return data


class AdminCandidatureUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour mettre à jour une candidature (admin)"""
    
    class Meta:
        model = Candidature
        fields = ['status', 'rejection_reason']
    
    def validate_status(self, value):
        if value not in ['pending', 'approved', 'rejected']:
            raise serializers.ValidationError("Statut invalide.")
        return value
    
    def validate(self, attrs):
        status = attrs.get('status')
        rejection_reason = attrs.get('rejection_reason', '')
        
        if status == 'rejected' and not rejection_reason:
            raise serializers.ValidationError(
                "Une raison de rejet est requise pour rejeter une candidature."
            )
        
        return attrs


class AdminCandidatureFileCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour créer un fichier de candidature (admin)"""
    
    class Meta:
        model = CandidatureFile
        fields = ['candidature', 'file_type', 'file', 'title', 'order']
    
    def validate_file_type(self, value):
        if value not in ['photo', 'video', 'portfolio', 'audio']:
            raise serializers.ValidationError("Type de fichier invalide.")
        return value


class AdminCandidatureFileUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour mettre à jour un fichier de candidature (admin)"""
    
    class Meta:
        model = CandidatureFile
        fields = ['file_type', 'file', 'title', 'order']
    
    def validate_file_type(self, value):
        if value not in ['photo', 'video', 'portfolio', 'audio']:
            raise serializers.ValidationError("Type de fichier invalide.")
        return value
