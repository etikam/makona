"""
Serializers pour l'app settings
"""
from rest_framework import serializers
from .models import Settings, HeroCarouselImage, TeamMember, HallOfFame


class HeroCarouselImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images du carousel"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroCarouselImage
        fields = ['id', 'image', 'image_url', 'title', 'alt_text', 'order', 'is_active']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class SettingsSerializer(serializers.ModelSerializer):
    """Serializer pour les paramètres globaux"""
    hero_carousel_images = serializers.SerializerMethodField()
    
    class Meta:
        model = Settings
        fields = [
            'id', 'countdown_enabled', 'countdown_target_date',
            'hero_carousel_enabled', 'hero_carousel_auto_play', 'hero_carousel_interval',
            'hero_carousel_images',
            'site_title', 'site_description', 'contact_email', 'contact_phone',
            'facebook_url', 'instagram_url', 'twitter_url', 'youtube_url', 'linkedin_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_hero_carousel_images(self, obj):
        """Récupérer uniquement les images actives du carousel"""
        images = HeroCarouselImage.objects.filter(is_active=True).order_by('order')
        return HeroCarouselImageSerializer(images, many=True, context=self.context).data


class TeamMemberSerializer(serializers.ModelSerializer):
    """Serializer pour les membres de l'équipe"""
    full_name = serializers.CharField(read_only=True)
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamMember
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'photo', 'photo_url', 'role', 'member_type', 'bio', 'order',
            'is_active', 'facebook_url', 'linkedin_url', 'twitter_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'full_name', 'created_at', 'updated_at']
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None


class HallOfFameSerializer(serializers.ModelSerializer):
    """Serializer pour le Hall of Fame"""
    winner_photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HallOfFame
        fields = [
            'id', 'year', 'category_name', 'winner_name', 'winner_photo',
            'winner_photo_url', 'description', 'award_type', 'order',
            'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_winner_photo_url(self, obj):
        if obj.winner_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.winner_photo.url)
            return obj.winner_photo.url
        return None

