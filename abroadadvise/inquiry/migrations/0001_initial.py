# Generated by Django 5.1.6 on 2025-03-26 07:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('consultancy', '0002_initial'),
        ('course', '0001_initial'),
        ('destination', '0001_initial'),
        ('event', '0001_initial'),
        ('exam', '0001_initial'),
        ('university', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_type', models.CharField(choices=[('university', 'University'), ('consultancy', 'Consultancy'), ('destination', 'Destination'), ('exam', 'Exam'), ('event', 'Event'), ('course', 'Course')], max_length=20)),
                ('entity_id', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('consultancy', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='consultancy.consultancy')),
                ('course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='course.course')),
                ('destination', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='destination.destination')),
                ('event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='event.event')),
                ('exam', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='exam.exam')),
                ('university', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='university.university')),
            ],
        ),
    ]
