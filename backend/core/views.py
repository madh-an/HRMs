from rest_framework import viewsets
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from django.utils.timezone import now



class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()   # 👈 ADD THIS LINE BACK
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        employee_id = self.request.query_params.get('employee')

        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)

        return queryset
    

@api_view(['GET'])
def dashboard_summary(request):
    total_employees = Employee.objects.count()
    total_attendance = Attendance.objects.count()
    total_present = Attendance.objects.filter(status='Present').count()
    total_absent = Attendance.objects.filter(status='Absent').count()

    return Response({
        "total_employees": total_employees,
        "total_attendance": total_attendance,
        "total_present": total_present,
        "total_absent": total_absent,
    })

@api_view(['GET'])
def dashboard_summary(request):
    status_filter = request.GET.get('status')
    date_filter = request.GET.get('date')
    department_filter = request.GET.get('department')
    name_filter = request.GET.get('name')

    total_employees = Employee.objects.count()
    total_attendance = Attendance.objects.count()
    total_present = Attendance.objects.filter(status='Present').count()
    total_absent = Attendance.objects.filter(status='Absent').count()

    attendance_queryset = Attendance.objects.select_related('employee')

    # Apply Filters
    if status_filter and status_filter != "All":
        attendance_queryset = attendance_queryset.filter(status=status_filter)

    if date_filter:
        attendance_queryset = attendance_queryset.filter(date=date_filter)

    if department_filter and department_filter != "All":
        attendance_queryset = attendance_queryset.filter(
            employee__department=department_filter
        )

    if name_filter:
        attendance_queryset = attendance_queryset.filter(
            employee__full_name__icontains=name_filter
        )

    attendance_list = [
        {
            "employee_name": att.employee.full_name,
            "department": att.employee.department,
            "date": att.date,
            "status": att.status
        }
        for att in attendance_queryset
    ]

    return Response({
        "total_employees": total_employees,
        "total_attendance": total_attendance,
        "total_present": total_present,
        "total_absent": total_absent,
        "attendance_list": attendance_list
    })

@api_view(['GET'])
def today_attendance(request):
    today = now().date()

    attendance = Attendance.objects.select_related('employee').filter(date=today)

    present_count = attendance.filter(status='Present').count()
    absent_count = attendance.filter(status='Absent').count()

    attendance_list = [
        {
            "id": att.id,
            "employee_name": att.employee.full_name,
            "department": att.employee.department,
            "status": att.status,
        }
        for att in attendance
    ]

    return Response({
        "present_count": present_count,
        "absent_count": absent_count,
        "total": attendance.count(),
        "attendance_list": attendance_list
    })