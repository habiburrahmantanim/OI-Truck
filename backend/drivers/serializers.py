from rest_framework import serializers

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )

    class Meta:
        model = Driver

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "license_number",
            "license_expiry",
            "address",
            "experience_years",
            "status",
            "rating",
            "total_trips",
            "available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "rating",
            "total_trips",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 0 and 5."
            )

        return value