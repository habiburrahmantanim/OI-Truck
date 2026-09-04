from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Payment
from .serializers import PaymentSerializer


class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) == "ADMIN":
            return Payment.objects.select_related(
                "booking",
                "user",
            ).all().order_by("-created_at")

        return Payment.objects.select_related(
            "booking",
            "user",
        ).filter(
            user=user
        ).order_by("-created_at")


class PaymentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) == "ADMIN":
            return Payment.objects.select_related(
                "booking",
                "user",
            ).all()

        return Payment.objects.select_related(
            "booking",
            "user",
        ).filter(
            user=user
        )
