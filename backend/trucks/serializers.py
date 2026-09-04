from rest_framework import serializers

from .models import Truck


class TruckSerializer(serializers.ModelSerializer):

    class Meta:
        model = Truck
        fields = [
            "id",
            "name",
            "image",
            "capacity",
            "price",
            "category",
            "description",
            "ideal_for",
            "available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Price cannot be negative."
            )

        return value