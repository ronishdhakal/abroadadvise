# Generated by Django 5.1.6 on 2025-04-07 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('featured', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='featuredpage',
            name='destination',
            field=models.CharField(blank=True, help_text='e.g., Canada, USA, UK', max_length=100, null=True),
        ),
    ]
