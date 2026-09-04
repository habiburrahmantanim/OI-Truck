from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Tracking
from .serializers import TrackingSerializer


class TrackingListCreateView(generics.ListCreateAPIView):
    serializer_class = TrackingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) == "ADMIN":
            return Tracking.objects.select_related(
                "booking",
                "driver__user",
            ).all().order_by("-last_updated")

        if getattr(user, "role", None) == "DRIVER":
            return Tracking.objects.select_related(
                "booking",
                "driver__user",
            ).filter(
                driver__user=user
            ).order_by("-last_updated")

        return Tracking.objects.select_related(
            "booking",
            "driver__user",
        ).filter(
            booking__user=user
        ).order_by("-last_updated")


class TrackingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TrackingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) == "ADMIN":
            return Tracking.objects.all()

        if getattr(user, "role", None) == "DRIVER":
            return Tracking.objects.filter(
                driver__user=user
            )

        return Tracking.objects.filter(
            booking__user=user
        )