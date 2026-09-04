import uuid

from django.conf import settings
from django.db import models

from bookings.models import Booking


class Payment(models.Model):

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        PAID = "Paid", "Paid"
        FAILED = "Failed", "Failed"
        REFUNDED = "Refunded", "Refunded"

    class Method(models.TextChoices):
        BKASH = "bKash", "bKash"
        NAGAD = "Nagad", "Nagad"
        CARD = "Card", "Card"
        CASH = "Cash", "Cash"

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="payment",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
    )

    transaction_id = models.CharField(
        max_length=100,
        unique=True,
        editable=False,
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    method = models.CharField(
        max_length=20,
        choices=Method.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = (
                f"TXN-{uuid.uuid4().hex[:12].upper()}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.transaction_id