# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipies', '0006_recipesteps'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipehops',
            name='add_time',
        ),
        migrations.RemoveField(
            model_name='recipehops',
            name='add_time_unit',
        ),
        migrations.AddField(
            model_name='recipehops',
            name='hop_weight',
            field=models.FloatField(default=1.0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='recipehops',
            name='hop_weight_uom',
            field=models.CharField(default=b'oz', max_length=2, choices=[(b'oz', b'ounces'), (b'g', b'grams')]),
        ),
    ]
