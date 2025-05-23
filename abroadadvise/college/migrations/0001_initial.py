# Generated by Django 5.1.5 on 2025-03-31 13:20

import django.db.models.deletion
import tinymce.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        ('destination', '0001_initial'),
        ('university', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='College',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(blank=True, null=True, unique=True)),
                ('brochure', models.FileField(blank=True, null=True, upload_to='college/brochure/')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='college/logo/')),
                ('cover_photo', models.ImageField(blank=True, null=True, upload_to='college/cover/')),
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
                ('affiliated_universities', models.ManyToManyField(blank=True, related_name='colleges', to='university.university')),
                ('districts', models.ManyToManyField(blank=True, to='core.district')),
                ('study_abroad_destinations', models.ManyToManyField(blank=True, related_name='college_destinations', to='destination.destination')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CollegeBranch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('branch_name', models.CharField(max_length=255)),
                ('location', models.TextField()),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('college', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='branches', to='college.college')),
            ],
        ),
        migrations.CreateModel(
            name='CollegeGallery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='college/gallery/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('college', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gallery_images', to='college.college')),
            ],
        ),
    ]
