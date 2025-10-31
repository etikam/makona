"""
Serializers pour l'app categories
"""
from rest_framework import serializers
from .models import Category, CategoryClass


class CategoryClassSerializer(serializers.ModelSerializer):
    """
    Serializer pour les classes de catégories
    """
    categories_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CategoryClass
        fields = [
            'id', 'name', 'slug', 'description',
            'is_active', 'order', 'categories_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_categories_count(self, obj):
        return obj.get_categories_count()


class CategoryClassDetailSerializer(serializers.ModelSerializer):
    """
    Serializer détaillé pour les classes de catégories avec leurs catégories
    """
    categories = serializers.SerializerMethodField()
    categories_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CategoryClass
        fields = [
            'id', 'name', 'slug', 'description',
            'is_active', 'order', 'categories', 'categories_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_categories(self, obj):
        from .serializers import CategoryListSerializer
        categories = obj.categories.filter(is_active=True)
        return CategoryListSerializer(categories, many=True).data
    
    def get_categories_count(self, obj):
        return obj.get_categories_count()


class CategoryClassCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer et modifier les classes de catégories
    """
    
    class Meta:
        model = CategoryClass
        fields = [
            'name', 'description', 'is_active', 'order'
        ]
    
    def validate_name(self, value):
        # Vérifier l'unicité du nom
        if self.instance and self.instance.name == value:
            return value
        
        if CategoryClass.objects.filter(name=value).exists():
            raise serializers.ValidationError("Une classe de catégorie avec ce nom existe déjà.")
        
        return value


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer pour les catégories
    """
    file_requirements = serializers.SerializerMethodField()
    required_file_types = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'category_class', 'name', 'slug', 'description',
            'is_active', 'requires_photo', 'requires_video', 'requires_portfolio',
            'requires_audio', 'requires_documents', 'max_video_duration', 'max_audio_duration',
            'awards_trophy', 'awards_certificate', 'awards_monetary', 'awards_plaque',
            'file_requirements', 'required_file_types', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_file_requirements(self, obj):
        return obj.get_file_requirements()
    
    def get_required_file_types(self, obj):
        return obj.get_required_file_types()


class CategoryListSerializer(serializers.ModelSerializer):
    """
    Serializer simplifié pour la liste des catégories
    """
    class Meta:
        model = Category
        fields = [
            'id', 'category_class', 'name', 'slug', 'description',
            'is_active', 'requires_photo', 
            'requires_video', 'requires_portfolio', 'requires_audio', 
            'requires_documents', 'max_video_duration', 'max_audio_duration',
            'awards_trophy', 'awards_certificate', 'awards_monetary', 'awards_plaque'
        ]


class CategoryDetailSerializer(serializers.ModelSerializer):
    """
    Serializer détaillé pour une catégorie
    """
    file_requirements = serializers.SerializerMethodField()
    required_file_types = serializers.SerializerMethodField()
    candidatures_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'category_class', 'name', 'slug', 'description',
            'is_active', 'requires_photo', 'requires_video', 'requires_portfolio',
            'requires_audio', 'requires_documents', 'max_video_duration', 'max_audio_duration',
            'awards_trophy', 'awards_certificate', 'awards_monetary', 'awards_plaque',
            'file_requirements', 'required_file_types', 'candidatures_count', 'created_at', 'updated_at'
        ]
    
    def get_file_requirements(self, obj):
        return obj.get_file_requirements()
    
    def get_required_file_types(self, obj):
        return obj.get_required_file_types()
    
    def get_candidatures_count(self, obj):
        # Compter les candidatures approuvées pour cette catégorie
        return obj.candidatures.filter(status='approved').count()


class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer/modifier une catégorie (admin uniquement)
    """
    class Meta:
        model = Category
        fields = [
            'category_class', 'name', 'description', 'is_active',
            'requires_photo', 'requires_video', 'requires_portfolio',
            'requires_audio', 'requires_documents', 'max_video_duration', 'max_audio_duration',
            'awards_trophy', 'awards_certificate', 'awards_monetary', 'awards_plaque'
        ]
    
    def validate_name(self, value):
        # Vérifier l'unicité du nom
        if self.instance and self.instance.name == value:
            return value
        
        if Category.objects.filter(name=value).exists():
            raise serializers.ValidationError("Une catégorie avec ce nom existe déjà.")
        
        return value
    
    def validate_max_video_duration(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("La durée maximale doit être positive.")
        return value
    
    def validate_max_audio_duration(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("La durée maximale doit être positive.")
        return value
    
    def validate(self, attrs):
        # Validation logique des exigences de fichiers
        requires_video = attrs.get('requires_video', False)
        max_video_duration = attrs.get('max_video_duration')
        requires_audio = attrs.get('requires_audio', False)
        max_audio_duration = attrs.get('max_audio_duration')
        
        if requires_video and max_video_duration is None:
            raise serializers.ValidationError(
                "Si une vidéo est requise, la durée maximale doit être spécifiée."
            )
        
        # Pour l'audio, on peut utiliser une durée par défaut si non spécifiée
        if requires_audio and max_audio_duration is None:
            attrs['max_audio_duration'] = 180  # 3 minutes par défaut
        
        return attrs
