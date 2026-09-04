from django.utils import timezone
from rest_framework import serializers

from bookings.models import Booking

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    booking_id = serializers.CharField(
        source="booking.booking_id",
        read_only=True,
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "booking",
            "booking_id",
            "transaction_id",
            "amount",
            "method",
            "status",
            "paid_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "transaction_id",
            "booking_id",
            "paid_at",
            "created_at",
            "updated_at",
        ]

    def validate_booking(self, booking):
        request = self.context["request"]

        if booking.user != request.user:
            raise serializers.ValidationError(
                "You can only pay for your own booking."
            )

        if Payment.objects.filter(booking=booking).exists():
            raise serializers.ValidationError(
                "A payment already exists for this booking."
            )

        if booking.status == Booking.Status.CANCELLED:
            raise serializers.ValidationError(
                "Cancelled bookings cannot be paid."
            )

        return booking

    def validate_amount(self, amount):
        if amount <= 0:
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        return amount

    def create(self, validated_data):
        booking = validated_data["booking"]

        validated_data["amount"] = booking.price
        validated_data["status"] = Payment.Status.PENDING

    payment = Payment.objects.create(
            user=self.context["request"].user,
            **validated_data,
    )

    return payment

    def update(self, instance, validated_data):
        old_status = instance.status
        new_status = validated_data.get(
            "status",
            instance.status,
        )

        instance = super().update(
            instance,
            validated_data,
        )

        if (
            old_status != Payment.Status.PAID
            and new_status == Payment.Status.PAID
        ):
            instance.paid_at = timezone.now()
            instance.save(update_fields=["paid_at"])

        return instance