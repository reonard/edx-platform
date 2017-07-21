"""
Admin site bindings for contentstore
"""

from config_models.admin import ConfigurationModelAdmin
from django.contrib import admin

from contentstore.models import PushNotificationConfig, VideoUploadConfig, MigrateVerifiedTrackCohortsSetting

admin.site.register(VideoUploadConfig, ConfigurationModelAdmin)
admin.site.register(PushNotificationConfig, ConfigurationModelAdmin)
admin.site.register(MigrateVerifiedTrackCohortsSetting, admin.ModelAdmin)
