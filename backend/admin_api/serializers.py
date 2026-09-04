from rest_framework import serializers

from accounts.models import User
from bookings.models import Booking
from trucks.models import Truck
from drivers.models import Driver


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",
            "date_joined",
        ]

        read_only_fields = [
            "id",
            "username",
            "date_joined",
        ]

    def validate_role(self, value):
        value = value.lower()
        valid_roles = ["customer", "driver", "admin"]

        if value not in valid_roles:
            raise serializers.ValidationError(
                "Invalid user role."
            )

        return value


class AdminBookingSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(
        source="user.id",
        read_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "booking_id",
            "user_id",
            "username",
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
            "user_id",
            "username",
            "created_at",
            "updated_at",
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Price cannot be negative."
            )

        return value


class AdminTruckSerializer(serializers.ModelSerializer):
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


class AdminDriverSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True,
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True,
    )

    class Meta:
        model = Driver

        fields = [
            "id",
            "user",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "license_number",
            "license_expiry",
            "truck_number",
            "experience_years",
            "status",
            "rating",
            "total_trips",
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

    def validate_user(self, user):
        if str(getattr(user, "role", "")).lower() != "driver":
            raise serializers.ValidationError(
                "Selected user must have DRIVER role."
            )

        if Driver.objects.filter(user=user).exists():
            if self.instance and self.instance.user_id == user.id:
                return user

            raise serializers.ValidationError(
                "This user already has a driver profile."
            )

        return user

    def validate_experience_years(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Experience cannot be negative."
            )

        return value

    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 0 and 5."
            )

        return value