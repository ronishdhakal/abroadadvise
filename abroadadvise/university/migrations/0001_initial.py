# Generated by Django 5.1.6 on 2025-03-26 07:57

import django.db.models.deletion
import tinymce.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('consultancy', '0001_initial'),
        ('core', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='University',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(blank=True, null=True, unique=True)),
                ('brochure', models.FileField(blank=True, null=True, upload_to='brochure/')),
                ('country', models.CharField(max_length=255)),
                ('address', models.TextField()),
                ('map_coordinate', models.CharField(blank=True, max_length=255, null=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone', models.CharField(max_length=20)),
                ('type', models.CharField(choices=[('private', 'Private'), ('community', 'Community')], max_length=20)),
                ('website', models.URLField(blank=True, null=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='logo/')),
                ('cover_photo', models.ImageField(blank=True, null=True, upload_to='cover/')),
                ('priority', models.PositiveIntegerField(blank=True, default=None, help_text='Lower the number, higher the priority', null=True)),
                ('eligibility', tinymce.models.HTMLField(blank=True, null=True)),
                ('facilities_features', tinymce.models.HTMLField(blank=True, null=True)),
                ('scholarship', tinymce.models.HTMLField(blank=True, null=True)),
                ('tuition_fees', models.CharField(blank=True, max_length=100, null=True)),
                ('qs_world_ranking', models.CharField(blank=True, max_length=100, null=True)),
                ('about', tinymce.models.HTMLField(blank=True, null=True)),
                ('faqs', tinymce.models.HTMLField(blank=True, null=True)),
                ('consultancies_to_apply', models.ManyToManyField(blank=True, related_name='universities', to='consultancy.consultancy')),
                ('disciplines', models.ManyToManyField(blank=True, related_name='universities', to='core.discipline')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('verified', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.verifieditem')),
            ],
        ),
    ]
