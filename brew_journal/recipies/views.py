import json

from rest_framework import status, views, permissions, viewsets
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from recipies.models import Recipe, RecipeSteps
from recipies.serializers import RecipeSerializer, RecipeStepsSerializer

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
            }, status=status.HTTP_401_UNAUTHORIZED);

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
        recipe_data = request.data
        user = request.user

        incoming_serialized_data = RecipeSerializer(data=recipe_data)

        if incoming_serialized_data.is_valid():
            new_recipe = incoming_serialized_data.save(user=user)
            # Serialize the new recipe to return it as part of the return data.
            # TODO: Evaluate if there is any value to this action
            serialized_recipe = RecipeSerializer(new_recipe)
            return Response({
                'message': 'Recipe has been created.',
                'recipe': serialized_recipe.data,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'status': 'Bad Request',
                'message': 'Recipe could not be created with the received data.',
                'errors': incoming_serialized_data.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    def update(self, request, pk=None):
        """Update a specific recipe."""

        recipe = get_object_or_404(Recipe, pk=pk)

        # Apparently, the framework is JSON decoding things for me...
        serializer = RecipeSerializer(instance=recipe, data=request.data)

        if serializer.is_valid():
            updated_recipe = serializer.save()
            updated_serializer = RecipeSerializer(updated_recipe)
            return Response({
                'message': 'Recipe has been updated.',
                'recipe': updated_serializer.data,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'status': 'Bad Request',
                'message': 'Recipe could not be updated with the received data.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """Get rid of a recipe."""

        recipe = get_object_or_404(Recipe, pk=pk)

        recipe.delete()

        return Response({},status=status.HTTP_204_NO_CONTENT)

class RecipeStepsViewSet(viewsets.ViewSet):
    serializer_class = RecipeStepsSerializer

    def list(self, request, recipe_pk=None):

        # Make sure the recipe exists before trying to get its steps
        get_object_or_404(Recipe, pk=recipe_pk)

        queryset = RecipeSteps.objects.filter(recipe_id = recipe_pk)

        serializer = RecipeStepsSerializer(queryset, many=True)

        if len(serializer.data) == 0:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.data)

    def create(self, request, recipe_pk=None):

        # Remove all existing steps. Always doing a full smash and replace for steps.
        for step in RecipeSteps.objects.filter(recipe_id=recipe_pk):
            step.delete()

        for new_step in request.data:
            new_step['recipe'] = recipe_pk
            serialized_step = self.serializer_class(data=new_step)
            if serialized_step.is_valid():
                serialized_step.save(recipe_id=recipe_pk)

        return Response({
            'message': 'Steps have been created.'
        },status=status.HTTP_201_CREATED)
