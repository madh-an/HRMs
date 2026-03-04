from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, AttendanceViewSet, dashboard_summary, today_attendance

routerer = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard_summary),
    path('today-attendance/', today_attendance),  # 👈 THIS LINE MUST EXIST
]