from rest_framework import serializers

from recipies.models import Recipe, RecipeMalts, RecipeHops, RecipeSteps

class RecipeStepsSerializer(serializers.ModelSerializer):
    """Subserializer for Recipes. Handles the steps."""

    class Meta:
        model = RecipeSteps
        exclude = ('id',)

    def create(self, validated_data):
        recipe_id = validated_data.pop('recipe_id')

        return RecipeSteps.objects.save_step(validated_data, recipe_id)


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
    recipe_hops  = RecipeHopsSerializer(many=True)

    class Meta:
        model = Recipe
        fields = '__all__'

    def create(self, validated_data):
        """Create the recipe and all related data"""
        # As hops and malt will be handled separately, remove them from the current data.
        hops  = validated_data.pop("recipe_hops")
        malts = validated_data.pop('recipe_malts')
        user  = validated_data.pop('user')

        return Recipe.objects.create_recipe(user, validated_data, malts, hops)

    def update(self, instance, validated_data):
        """Update a recipe. This will clear all previous malts/hops and replace them with a new list"""

        instance.recipe_name    = validated_data.get('recipe_name',    instance.recipe_name)
        instance.recipe_style   = validated_data.get('recipe_style',   instance.recipe_style)
        instance.recipe_notes   = validated_data.get('recipe_notes',   instance.recipe_notes)
        instance.last_brew_date = validated_data.get('last_brew_date', instance.last_brew_date)

        new_hops  = validated_data.get('recipe_hops', instance.recipe_hops)
        new_malts = validated_data.get('recipe_malts', instance.recipe_malts)
        new_steps = validated_data.get('recipe_steps', instance.recipe_steps)

        # Delete all of the hops and then resave them
        instance.recipe_hops.all().delete()
        for hop in new_hops:
            hop['recipe'] = instance.id
            serialized_hop = RecipeHopsSerializer(data=hop)
            serialized_hop.is_valid(raise_exception=True) # Throw an exception if invalid
            serialized_hop.save()

        # Do the same for malts
        instance.recipe_malts.all().delete()
        for malt in new_malts:
            malt['recipe'] = instance.id
            serialized_malt = RecipeMaltsSerializer(data=malt)
            serialized_malt.is_valid(raise_exception=True)
            serialized_malt.save()

        instance.save()

        return instance
