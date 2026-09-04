from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Truck
from .serializers import TruckSerializer


class TruckListCreateView(
    generics.ListCreateAPIView
):
    queryset = Truck.objects.all().order_by("-created_at")
    serializer_class = TruckSerializer
    permission_classes = [IsAuthenticated]


class TruckDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer
    permission_classes = [IsAuthenticated]