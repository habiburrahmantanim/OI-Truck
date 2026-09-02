from django.conf import settings
from django.db import models


class Booking(models.Model):

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        CONFIRMED = "Confirmed", "Confirmed"
        ACCEPTED = "Accepted", "Accepted"
        IN_TRANSIT = "In Transit", "In Transit"
        COMPLETED = "Completed", "Completed"
        CANCELLED = "Cancelled", "Cancelled"

    class PaymentStatus(models.TextChoices):
        UNPAID = "Unpaid", "Unpaid"
        PENDING = "Pending", "Pending"
        PAID = "Paid", "Paid"
        FAILED = "Failed", "Failed"
        REFUNDED = "Refunded", "Refunded"

    class PaymentMethod(models.TextChoices):
        BKASH = "bKash", "bKash"
        NAGAD = "Nagad", "Nagad"
        CARD = "Card", "Card"
        CASH = "Cash", "Cash"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )

    booking_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
    )

    customer_name = models.CharField(max_length=150)

    customer_phone = models.CharField(max_length=20)

    customer_email = models.EmailField(
        blank=True,
        null=True,
    )

    pickup_location = models.CharField(
        max_length=255,
    )

    delivery_location = models.CharField(
        max_length=255,
    )

    vehicle_type = models.CharField(
        max_length=100,
    )

    vehicle_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    truck_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    truck_capacity = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    booking_date = models.DateField()

    booking_time = models.TimeField()

    notes = models.TextField(
        blank=True,
        null=True,
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.UNPAID,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def save(self, *args, **kwargs):
        if not self.booking_id:
            last_booking = (
                Booking.objects
                .order_by("-id")
                .first()
            )

            if last_booking:
                next_number = last_booking.id + 1
            else:
                next_number = 1

            self.booking_id = (
                f"BK{next_number:05d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.booking_id