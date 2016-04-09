import json

from rest_framework import status, views, permissions, viewsets
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from recipies.models import Recipe
from recipies.serializers import RecipeSerializer

# Create your views here.
class RecipeViewSet(viewsets.ViewSet):
  """Handle requests for CRUD opts on recipes"""
  serializer_class = RecipeSerializer

  def list(self, request):
    """
      List all of a user's recipes. Only return the ID and the name.
      While this may seem initially uneeded, as the number of recipes
      grows limiting data will be important.
    """

    if not request.user.is_active:
      return Response({
        'status'  : 'UNAUTHORIZED',
        'message' : 'Requesting user is no longer active.',
        },status=status.HTTP_401_UNAUTHORIZED);

    queryset = Recipe.objects.filter(account=request.user)

    serializer = RecipeSerializer(queryset, many=True)

    retData = [dict(id=x.get('id'),name=x.get('recipe_name')) for x in serializer.data]

    if len(retData) == 0:
      return Response({},status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(retData)

  def retrieve(self, request, pk):
    """Get all the specifics of a recipe."""

    recipe = get_object_or_404(Recipe, pk=pk)

    serializer = RecipeSerializer(recipe)

    return Response(serializer.data)


  def create(self, request):
    """Create a new recipe"""
    user = request.user
    recipe_data = json.loads(request.body)

    incoming_serialized_data = RecipeSerializer(data=recipe_data)

    if incoming_serialized_data.is_valid():
      new_recipe = incoming_serialized_data.save(user=user)
      # Serialize the new recipe to return it as part of the return data.
      # TODO: Evaluate if there is any value to this action
      serialized_recipe = RecipeSerializer(new_recipe)
      return Response({
        'message': 'Recipe has been created.',
        'recipe': serialized_recipe.data,
        },status=status.HTTP_201_CREATED)
    else:
      return Response({
        'status': 'Bad Request',
        'message': 'Recipe could not be created with the received data.',
        'errors': incoming_serialized_data.errors
      }, status=status.HTTP_400_BAD_REQUEST)

  def update(self, request, pk=None):
    """Update a specific recipe."""

  def destroy(self, request, pk=None):
    """Get rid of a recipe."""

    recipe = get_object_or_404(Recipe, pk=pk)

    recipe.delete()

    return Response({},status=status.HTTP_204_NO_CONTENT)
