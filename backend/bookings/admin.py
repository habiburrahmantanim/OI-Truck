from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        "booking_id",
        "customer_name",
        "customer_phone",
        "pickup_location",
        "delivery_location",
        "status",
        "payment_status",
        "price",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_status",
        "payment_method",
    )

    search_fields = (
        "booking_id",
        "customer_name",
        "customer_phone",
        "customer_email",
        "pickup_location",
        "delivery_location",
    )

    readonly_fields = (
        "booking_id",
        "created_at",
        "updated_at",
    )