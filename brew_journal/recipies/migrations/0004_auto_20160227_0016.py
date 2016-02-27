# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipies', '0003_auto_20160224_0357'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipehops',
            name='beta_acid_content',
            field=models.FloatField(null=True, blank=True),
        ),
    ]
