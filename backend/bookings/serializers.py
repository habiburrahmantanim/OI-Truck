from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking

        fields = [
            "id",
            "booking_id",
            "customer_name",
            "customer_phone",
            "customer_email",
            "pickup_location",
            "delivery_location",
            "vehicle_type",
            "vehicle_name",
            "truck_number",
            "truck_capacity",
            "booking_date",
            "booking_time",
            "notes",
            "price",
            "status",
            "payment_status",
            "payment_method",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "booking_id",
            "status",
            "payment_status",
            "created_at",
            "updated_at",
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Price cannot be negative."
            )

        return value