# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contentstore', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MigrateVerifiedTrackCohortsSetting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('change_date', models.DateTimeField(auto_now_add=True, verbose_name='Change date')),
                ('enabled', models.BooleanField(default=False, verbose_name='Enabled')),
                ('old_course_id', models.TextField(help_text=b'Course key for which to migrate verified track cohorts from')),
                ('rerun_course_id', models.TextField(help_text=b'Course key for which to migrate verified track cohorts to enrollment tracks to')),
                ('audit_cohort_names', models.TextField(help_text=b'Comma-separated list of audit cohort names')),
                ('changed_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, editable=False, to=settings.AUTH_USER_MODEL, null=True, verbose_name='Changed by')),
            ],
        ),
    ]
