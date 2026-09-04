from django.conf import settings
from django.db import models


class Driver(models.Model):

    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        BUSY = "Busy", "Busy"
        OFFLINE = "Offline", "Offline"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="driver_profile",
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    license_number = models.CharField(
        max_length=100,
        unique=True,
    )

    license_expiry = models.DateField(
        blank=True,
        null=True,
    )

    truck_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    experience_years = models.PositiveIntegerField(
        default=0,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OFFLINE,
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
    )

    total_trips = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.user.username