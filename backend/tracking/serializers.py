from rest_framework import serializers

from .models import Tracking


class TrackingSerializer(serializers.ModelSerializer):
    booking_id = serializers.CharField(
        source="booking.booking_id",
        read_only=True,
    )

    driver_name = serializers.CharField(
        source="driver.user.username",
        read_only=True,
    )

    class Meta:
        model = Tracking
        fields = [
            "id",
            "booking",
            "booking_id",
            "driver",
            "driver_name",
            "latitude",
            "longitude",
            "status",
            "last_updated",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "booking_id",
            "driver_name",
            "last_updated",
            "created_at",
        ]

    def validate_latitude(self, value):
        if value < -90 or value > 90:
            raise serializers.ValidationError(
                "Latitude must be between -90 and 90."
            )

        return value

    def validate_longitude(self, value):
        if value < -180 or value > 180:
            raise serializers.ValidationError(
                "Longitude must be between -180 and 180."
            )

        return value