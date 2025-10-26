"""
Vues pour l'app accounts
"""
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password

from .models import User, CandidateProfile, DeviceFingerprint
from .serializers import (
    UserRegistrationSerializer, UserSerializer, CandidateProfileSerializer,
    CandidateProfileCreateSerializer, DeviceFingerprintSerializer,
    DeviceFingerprintCreateSerializer, OTPRequestSerializer,
    OTPVerifySerializer, UserLoginSerializer, PasswordChangeSerializer
)
from .permissions import (
    IsAdminUser, IsCandidateUser, IsOwnerOrAdmin, IsVerifiedUser,
    IsPublicOrAuthenticated
)
from .services import OTPService, UserService, DeviceFingerprintService


class UserRegistrationView(APIView):
    """
    Vue pour l'inscription des utilisateurs
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Créer et envoyer un code OTP
            otp = OTPService.create_otp(user)
            OTPService.send_otp_email(user, otp.code)
            
            return Response({
                'message': 'Utilisateur créé avec succès. Un code de vérification a été envoyé à votre email.',
                'user_id': user.id,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPRequestView(APIView):
    """
    Vue pour demander un code OTP
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = OTPRequestSerializer
    
    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Créer et envoyer un nouveau code OTP
            otp = OTPService.create_otp(user)
            OTPService.send_otp_email(user, otp.code)
            
            return Response({
                'message': f'Un nouveau code de vérification a été envoyé à {email}'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(APIView):
    """
    Vue pour vérifier un code OTP et connecter l'utilisateur
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = OTPVerifySerializer
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Vérifier l'OTP
            is_valid, message = OTPService.verify_otp(user, serializer.validated_data['code'])
            
            if not is_valid:
                return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
            
            # Marquer l'utilisateur comme vérifié
            user = UserService.verify_user_email(user)
            
            # Créer une session Django
            login(request, user)
            
            return Response({
                'message': 'Connexion réussie',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    Vue pour la connexion utilisateur (avec mot de passe)
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = UserLoginSerializer
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Créer une session Django
            login(request, user)
            
            return Response({
                'message': 'Connexion réussie',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vue pour récupérer et mettre à jour le profil utilisateur
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        return self.request.user


class CandidateProfileView(generics.RetrieveUpdateAPIView, generics.CreateAPIView):
    """
    Vue pour gérer le profil candidat
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidateUser]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CandidateProfileSerializer
        return CandidateProfileCreateSerializer
    
    def get_object(self):
        try:
            return self.request.user.candidate_profile
        except CandidateProfile.DoesNotExist:
            return None
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class DeviceFingerprintView(APIView):
    """
    Vue pour créer un fingerprint de device
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = DeviceFingerprintCreateSerializer
    
    def post(self, request):
        serializer = DeviceFingerprintCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            fingerprint = serializer.save()
            return Response({
                'fingerprint_id': fingerprint.id,
                'fingerprint_hash': fingerprint.fingerprint_hash,
                'message': 'Fingerprint créé avec succès'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """
    Vue pour changer le mot de passe
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PasswordChangeSerializer
    
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Mot de passe modifié avec succès'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserStatsView(APIView):
    """
    Vue pour récupérer les statistiques d'un utilisateur
    """
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get(self, request):
        user = request.user
        stats = UserService.get_user_stats(user)
        return Response(stats, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Vue pour déconnecter un utilisateur
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Déconnecter l'utilisateur (détruire la session)
        logout(request)
        return Response({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)