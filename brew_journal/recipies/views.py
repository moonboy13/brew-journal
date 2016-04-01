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
    """
      List all of a user's recipes. Only return the ID and the name.
      While this may seem initially uneeded, as the number of recipes
      grows limiting data will be important.
    """
    serializer = RecipeSerializer(self.queryset, many=True)
    retData = [dict(id=x.get('id'),name=x.get('recipe_name')) for x in serializer.data]

    return Response(retData)

  def detail(self, request, pk=None):
    """Get all the specifics of a recipe."""

  def create(self, request):
    """Create a new recipe"""

  def update(self, request, pk=None):
    """Update a specific recipe."""

  def destroy(self, request, pk=None):
    """Get rid of a recipe."""