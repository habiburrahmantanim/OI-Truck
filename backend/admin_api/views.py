from django.contrib.auth import get_user_model
from django.db.models import Sum

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from trucks.models import Truck
from drivers.models import Driver

from .permissions import IsAdminUser
from .serializers import (
    AdminUserSerializer,
    AdminBookingSerializer,
    AdminTruckSerializer,
    AdminDriverSerializer,
)


User = get_user_model()


# ============================================================
# USER MANAGEMENT
# ============================================================

class AdminUserListView(generics.ListAPIView):
    """
    GET /api/admin/users/
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/users/<id>/
    PATCH  /api/admin/users/<id>/
    PUT    /api/admin/users/<id>/
    DELETE /api/admin/users/<id>/
    """

    queryset = User.objects.all()
    serializer_class = AdminUserSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()

        if user.id == request.user.id:
            return Response(
                {
                    "detail": "You cannot delete your own admin account."
                },
                status=400,
            )

        return super().destroy(request, *args, **kwargs)


# ============================================================
# BOOKING MANAGEMENT
# ============================================================

class AdminBookingListView(generics.ListAPIView):
    """
    GET /api/admin/bookings/
    """

    queryset = Booking.objects.select_related(
        "user"
    ).all().order_by("-created_at")

    serializer_class = AdminBookingSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]


class AdminBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/bookings/<id>/
    PATCH  /api/admin/bookings/<id>/
    PUT    /api/admin/bookings/<id>/
    DELETE /api/admin/bookings/<id>/
    """

    queryset = Booking.objects.select_related(
        "user"
    ).all()

    serializer_class = AdminBookingSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]


# ============================================================
# TRUCK MANAGEMENT
# ============================================================

class AdminTruckListView(generics.ListCreateAPIView):
    """
    GET  /api/admin/trucks/
    POST /api/admin/trucks/
    """

    queryset = Truck.objects.all().order_by("-created_at")
    serializer_class = AdminTruckSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]


class AdminTruckDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/trucks/<id>/
    PATCH  /api/admin/trucks/<id>/
    PUT    /api/admin/trucks/<id>/
    DELETE /api/admin/trucks/<id>/
    """

    queryset = Truck.objects.all()
    serializer_class = AdminTruckSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]


# ============================================================
# DRIVER MANAGEMENT
# ============================================================

class AdminDriverListView(generics.ListCreateAPIView):
    """
    GET  /api/admin/drivers/
    POST /api/admin/drivers/
    """

    queryset = Driver.objects.select_related(
        "user"
    ).all().order_by("-created_at")

    serializer_class = AdminDriverSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]


class AdminDriverDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/drivers/<id>/
    PATCH  /api/admin/drivers/<id>/
    PUT    /api/admin/drivers/<id>/
    DELETE /api/admin/drivers/<id>/
    """

    queryset = Driver.objects.select_related(
        "user"
    ).all()

    serializer_class = AdminDriverSerializer

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]


# ============================================================
# ADMIN DASHBOARD
# ============================================================

class AdminDashboardView(APIView):
    """
    GET /api/admin/dashboard/
    """

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get(self, request):

        total_users = User.objects.count()

        total_customers = User.objects.filter(
            role="CUSTOMER"
        ).count()

        total_drivers = Driver.objects.count()

        total_trucks = Truck.objects.count()

        available_trucks = Truck.objects.filter(
            available=True
        ).count()

        unavailable_trucks = Truck.objects.filter(
            available=False
        ).count()

        total_bookings = Booking.objects.count()

        pending_bookings = Booking.objects.filter(
            status=Booking.Status.PENDING
        ).count()

        confirmed_bookings = Booking.objects.filter(
            status=Booking.Status.CONFIRMED
        ).count()

        accepted_bookings = Booking.objects.filter(
            status=Booking.Status.ACCEPTED
        ).count()

        in_transit_bookings = Booking.objects.filter(
            status=Booking.Status.IN_TRANSIT
        ).count()

        completed_bookings = Booking.objects.filter(
            status=Booking.Status.COMPLETED
        ).count()

        cancelled_bookings = Booking.objects.filter(
            status=Booking.Status.CANCELLED
        ).count()

        paid_bookings = Booking.objects.filter(
            payment_status=Booking.PaymentStatus.PAID
        ).count()

        total_revenue = (
            Booking.objects.filter(
                payment_status=Booking.PaymentStatus.PAID
            ).aggregate(
                total=Sum("price")
            )["total"]
            or 0
        )

        data = {
            "users": {
                "total": total_users,
                "customers": total_customers,
                "drivers": total_drivers,
            },

            "trucks": {
                "total": total_trucks,
                "available": available_trucks,
                "unavailable": unavailable_trucks,
            },

            "bookings": {
                "total": total_bookings,
                "pending": pending_bookings,
                "confirmed": confirmed_bookings,
                "accepted": accepted_bookings,
                "in_transit": in_transit_bookings,
                "completed": completed_bookings,
                "cancelled": cancelled_bookings,
            },

            "payments": {
                "paid_bookings": paid_bookings,
                "total_revenue": total_revenue,
            },
        }

        return Response(data)