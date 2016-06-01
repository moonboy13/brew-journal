# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipies', '0005_auto_20160227_0054'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecipeSteps',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('step_order', models.IntegerField()),
                ('step', models.TextField()),
                ('recipe', models.ForeignKey(related_name='recipe_steps', to='recipies.Recipe')),
            ],
        ),
    ]
