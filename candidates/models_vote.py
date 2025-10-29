"""
Modèles pour le système de vote
"""
from django.db import models
from django.contrib.auth import get_user_model
from .models import Candidature

User = get_user_model()


class Vote(models.Model):
    """
    Modèle pour les votes des utilisateurs sur les candidatures
    """
    candidature = models.ForeignKey(
        Candidature,
        on_delete=models.CASCADE,
        related_name='votes',
        verbose_name="Candidature"
    )
    voter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='votes_given',
        verbose_name="Votant"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de vote"
    )
    
    class Meta:
        verbose_name = "Vote"
        verbose_name_plural = "Votes"
        unique_together = ('candidature', 'voter')  # Un utilisateur ne peut voter qu'une fois par candidature
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.voter.get_full_name()} a voté pour {self.candidature.candidate.get_full_name()}"
