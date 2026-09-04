from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Driver
from .serializers import DriverSerializer


class DriverListCreateView(
    generics.ListCreateAPIView
):
    queryset = Driver.objects.select_related(
        "user"
    ).all().order_by("-created_at")

    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated]


class DriverDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Driver.objects.select_related(
        "user"
    ).all()

    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated]