from django.conf import settings
from django.db import models

from bookings.models import Booking
from drivers.models import Driver


class Tracking(models.Model):

    class Status(models.TextChoices):
        NOT_STARTED = "Not Started", "Not Started"
        IN_TRANSIT = "In Transit", "In Transit"
        ARRIVED = "Arrived", "Arrived"
        COMPLETED = "Completed", "Completed"

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="tracking",
    )

    driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tracking_records",
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_STARTED,
    )

    last_updated = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tracking - {self.booking.booking_id}"