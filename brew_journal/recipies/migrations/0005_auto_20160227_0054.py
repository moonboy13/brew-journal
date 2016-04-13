# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipies', '0004_auto_20160227_0016'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='date_created',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='date_updated',
            field=models.DateField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='last_brew_date',
            field=models.DateField(null=True, blank=True),
        ),
    ]
