"""
Models for contentstore
"""

from config_models.models import ConfigurationModel
from django.db.models.fields import TextField


class VideoUploadConfig(ConfigurationModel):
    """Configuration for the video upload feature."""
    profile_whitelist = TextField(
        blank=True,
        help_text="A comma-separated list of names of profiles to include in video encoding downloads."
    )

    @classmethod
    def get_profile_whitelist(cls):
        """Get the list of profiles to include in the encoding download"""
        return [profile for profile in cls.current().profile_whitelist.split(",") if profile]


class PushNotificationConfig(ConfigurationModel):
    """Configuration for mobile push notifications."""


class MigrateVerifiedTrackCohortsSetting(ConfigurationModel):
    """
    ...
    """
    class Meta(object):
        app_label = "contentstore"

    old_course_id = TextField(
        blank=False,
        help_text="Course key for which to migrate verified track cohorts from"
    )
    rerun_course_id = TextField(
        blank=False,
        help_text="Course key for which to migrate verified track cohorts to enrollment tracks to"
    )
    audit_cohort_names = TextField(
        help_text="Comma-separated list of audit cohort names"
    )

    @classmethod
    def get_audit_cohort_names(cls):
        """Get the list of audit course names for the course"""
        return [cohort_name for cohort_name in cls.current().audit_cohort_names.split(",") if cohort_name]
