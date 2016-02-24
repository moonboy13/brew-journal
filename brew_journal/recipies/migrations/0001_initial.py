# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('recipe_name', models.CharField(max_length=60)),
                ('recipe_style', models.CharField(max_length=140)),
                ('recipe_notes', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('last_brew_date', models.DateTimeField(blank=True)),
                ('status', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='RecipeHops',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('hop_name', models.CharField(max_length=80)),
                ('alpha_acid_content', models.FloatField()),
                ('beta_acid_content', models.FloatField(blank=True)),
                ('add_time', models.FloatField()),
                ('add_time_unit', models.CharField(max_length=7)),
                ('dry_hops', models.BooleanField(default=False)),
                ('status', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='RecipeMalts',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('malt_brand', models.CharField(max_length=120)),
                ('malt_type', models.CharField(max_length=120)),
                ('malt_extract', models.BooleanField(default=True)),
                ('dry_malt', models.BooleanField(default=False)),
                ('amount_by_weight', models.FloatField()),
                ('status', models.BooleanField(default=True)),
            ],
        ),
    ]
