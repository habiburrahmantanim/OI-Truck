from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Booking
from .serializers import BookingSerializer

# Create your views here.



class BookingListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = BookingSerializer
    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class BookingDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = BookingSerializer
    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        )