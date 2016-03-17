from rest_framework import serializers

from recipies.models import Recipe, RecipeMalts, RecipeHops

class RecipeMaltsSerializer(serializers.ModelSerializer):
  """Subserializer for Recipes. Handles the malts."""
  class Meta:
    model = RecipeMalts
    exclude = ('id',)

class RecipeHopsSerializer(serializers.ModelSerializer):
  """Subserializer for Recipes. Handles the hops."""
  class Meta:
    model  = RecipeHops
    exclude = ('id',)

class RecipeSerializer(serializers.ModelSerializer):
  """Serialization class for all your yummy recipes."""

  recipe_malts = RecipeMaltsSerializer(many=True)
  recipe_hops = RecipeHopsSerializer(many=True)

  class Meta:
    model = Recipe
    fields = '__all__'

  def create(self, validated_data):
    """Create the recipe and all related data"""
    # As hops and malt will be handled separately, remove them from the current data.
    hops  = validated_data.pop("recipe_hops")
    malts = validated_data.pop('recipe_malts')
    user = validated_data.pop('user')

    return Recipe.objects.create_recipe(user, validated_data, malts, hops)
