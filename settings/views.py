"""
Vues pour l'app settings
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404

from .models import Settings, HeroCarouselImage, TeamMember, HallOfFame
from .serializers import (
    SettingsSerializer, HeroCarouselImageSerializer,
    TeamMemberSerializer, HallOfFameSerializer
)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_public_settings(request):
    """Endpoint public pour récupérer les paramètres"""
    settings, created = Settings.objects.get_or_create(pk=1)
    serializer = SettingsSerializer(settings, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([permissions.IsAdminUser])
def admin_settings(request):
    """Endpoint admin pour gérer les paramètres"""
    settings, created = Settings.objects.get_or_create(pk=1)
    
    if request.method == 'GET':
        serializer = SettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = SettingsSerializer(settings, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HeroCarouselImageView(APIView):
    """Vue pour gérer les images du carousel"""
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request):
        """Récupérer toutes les images"""
        images = HeroCarouselImage.objects.all().order_by('order')
        serializer = HeroCarouselImageSerializer(images, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        """Créer une nouvelle image"""
        serializer = HeroCarouselImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HeroCarouselImageDetailView(APIView):
    """Vue pour gérer une image spécifique du carousel"""
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request, pk):
        """Récupérer une image"""
        image = get_object_or_404(HeroCarouselImage, pk=pk)
        serializer = HeroCarouselImageSerializer(image, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Mettre à jour une image"""
        image = get_object_or_404(HeroCarouselImage, pk=pk)
        serializer = HeroCarouselImageSerializer(image, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        """Mettre à jour partiellement une image"""
        image = get_object_or_404(HeroCarouselImage, pk=pk)
        serializer = HeroCarouselImageSerializer(image, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Supprimer une image"""
        image = get_object_or_404(HeroCarouselImage, pk=pk)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_active_carousel_images(request):
    """Endpoint public pour récupérer les images actives du carousel"""
    images = HeroCarouselImage.objects.filter(is_active=True).order_by('order')
    serializer = HeroCarouselImageSerializer(images, many=True, context={'request': request})
    return Response(serializer.data)


class TeamMemberListView(APIView):
    """Vue pour gérer les membres de l'équipe"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Récupérer les membres actifs"""
        member_type = request.query_params.get('member_type', None)
        queryset = TeamMember.objects.filter(is_active=True)
        
        if member_type:
            queryset = queryset.filter(member_type=member_type)
        
        queryset = queryset.order_by('member_type', 'order', 'last_name')
        serializer = TeamMemberSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class TeamMemberAdminView(APIView):
    """Vue admin pour gérer les membres de l'équipe"""
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request):
        """Récupérer tous les membres"""
        members = TeamMember.objects.all().order_by('member_type', 'order', 'last_name')
        serializer = TeamMemberSerializer(members, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        """Créer un nouveau membre"""
        serializer = TeamMemberSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamMemberDetailView(APIView):
    """Vue pour gérer un membre spécifique"""
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request, pk):
        """Récupérer un membre"""
        member = get_object_or_404(TeamMember, pk=pk)
        serializer = TeamMemberSerializer(member, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Mettre à jour un membre"""
        member = get_object_or_404(TeamMember, pk=pk)
        serializer = TeamMemberSerializer(member, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        """Mettre à jour partiellement un membre"""
        member = get_object_or_404(TeamMember, pk=pk)
        serializer = TeamMemberSerializer(member, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Supprimer un membre"""
        member = get_object_or_404(TeamMember, pk=pk)
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_hall_of_fame(request):
    """Endpoint public pour récupérer le Hall of Fame"""
    year = request.query_params.get('year', None)
    is_featured = request.query_params.get('featured', None)
    
    queryset = HallOfFame.objects.all()
    
    if year:
        queryset = queryset.filter(year=year)
    
    if is_featured == 'true':
        queryset = queryset.filter(is_featured=True)
    
    queryset = queryset.order_by('-year', 'order')
    serializer = HallOfFameSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)


class HallOfFameAdminView(APIView):
    """Vue admin pour gérer le Hall of Fame"""
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request):
        """Récupérer toutes les entrées"""
        entries = HallOfFame.objects.all().order_by('-year', 'order')
        serializer = HallOfFameSerializer(entries, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        """Créer une nouvelle entrée"""
        serializer = HallOfFameSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HallOfFameDetailView(APIView):
    """Vue pour gérer une entrée spécifique du Hall of Fame"""
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request, pk):
        """Récupérer une entrée"""
        entry = get_object_or_404(HallOfFame, pk=pk)
        serializer = HallOfFameSerializer(entry, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Mettre à jour une entrée"""
        entry = get_object_or_404(HallOfFame, pk=pk)
        serializer = HallOfFameSerializer(entry, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        """Mettre à jour partiellement une entrée"""
        entry = get_object_or_404(HallOfFame, pk=pk)
        serializer = HallOfFameSerializer(entry, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Supprimer une entrée"""
        entry = get_object_or_404(HallOfFame, pk=pk)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

