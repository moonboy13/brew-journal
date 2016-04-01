import json

from rest_framework import status, views, permissions, viewsets
from rest_framework.response import Response

from recipies.models import Recipe
from recipies.serializers import RecipeSerializer

# Create your views here.
class RecipeViewSet(viewsets.ModelViewSet):
  """Handle requests for CRUD opts on recipes"""
  queryset = Recipe.objects.all()
  serializer_class = RecipeSerializer

  def list(self, request):
    """List all of a user's recipes and names."""

  def detail(self, request, pk=None):
    """Get all the specifics of a recipe."""

  def create(self, request):
    """Create a new recipe"""

  def update(self, request, pk=None):
    """Update a specific recipe."""

  def destroy(self, request, pk=None):
    """Get rid of a recipe."""