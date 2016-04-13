# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recipies', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='account',
            field=models.ForeignKey(related_name='account', to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='recipehops',
            name='recipe',
            field=models.ForeignKey(related_name='recipe_hops', to='recipies.Recipe', null=True),
        ),
        migrations.AddField(
            model_name='recipemalts',
            name='recipe',
            field=models.ForeignKey(related_name='recipe_malts', to='recipies.Recipe', null=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='last_brew_date',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
