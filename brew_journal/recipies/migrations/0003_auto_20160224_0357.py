# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('recipies', '0002_auto_20160224_0318'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='account',
            field=models.ForeignKey(related_name='recipe', to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
