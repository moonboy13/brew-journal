from rest_framework import serializers

from recipies.models import Recipe, RecipeMalts, RecipeHops

class RecipeSerializer(serializers.ModelSerializer):
  """Serialization class for all your yummy recipes."""

  class Meta:
    model = Recipe
    fields = '__all__'

    def create(self, validated_data, **kwargs):
      """Create the recipe and all related data"""
      # As hops and malt will be handled separately, remove them from the current data.
      hops  = validated_data.get('recipe_hops')
      del validated_data['recipe_hops']
      malts = validated_data.get('recipe_malts')
      del validated_data['malts']
      user = kwargs.get('user')

      return Account.object.create_recipe(user, validated_data, malts, hops)

class RecipeMaltsSerializer(serializers.ModelSerializer):
  """Subserializer for Recipes. Handles the malts."""
  class Meta:
    model = RecipeMalts
    exclude = ('id',)

class RecipeHopsSerializers(serializers.ModelSerializer):
  """Subserializer for Recipes. Handles the hops."""
  class Meta:
    model  = RecipeHops
    exclude = ('id',)