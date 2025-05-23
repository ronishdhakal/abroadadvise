# Generated by Django 5.1.6 on 2025-03-26 07:57

import tinymce.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Consultancy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(blank=True, null=True, unique=True)),
                ('brochure', models.FileField(blank=True, null=True, upload_to='brochure/')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='logo/')),
                ('cover_photo', models.ImageField(blank=True, null=True, upload_to='cover/')),
                ('verified', models.BooleanField(default=False)),
                ('address', models.TextField()),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('establishment_date', models.DateField(blank=True, null=True)),
                ('website', models.URLField(blank=True, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True, unique=True)),
                ('phone', models.CharField(blank=True, max_length=20, null=True, unique=True)),
                ('moe_certified', models.BooleanField(default=False)),
                ('about', tinymce.models.HTMLField(blank=True, null=True)),
                ('priority', models.PositiveIntegerField(blank=True, default=None, help_text='Lower the number, higher the priority', null=True)),
                ('google_map_url', models.URLField(blank=True, null=True)),
                ('services', tinymce.models.HTMLField(blank=True, null=True)),
                ('has_branches', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ConsultancyBranch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('branch_name', models.CharField(max_length=255)),
                ('location', models.TextField()),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ConsultancyGallery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='gallery/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
