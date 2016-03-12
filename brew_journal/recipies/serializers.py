from rest_framework import serializers

from recipies.models import Recipe, RecipeMalts, RecipeHops

class RecipeSerializer(serializers.ModelSerializer):
  """Serialization class for all your yummy recipes."""

class RecipeMaltsSerializer(serializers.ModelSerializer):
  """Subserializer for Recipes. Handles the malts."""

class RecipeHopsSerializers(serializers.ModelSerializer):
  """Subserializer for Recipes. Handles the hops."""