from rest_framework import serializers
from .models import Employee, Attendance
from django.core.validators import validate_email


class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee
        fields = "__all__"

    def validate_email(self, value):

        validate_email(value)

        if Employee.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Employee with this email already exists."
            )

        return value

    def validate_employee_id(self, value):

        if Employee.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError(
                "Employee with this ID already exists."
            )

        return value


class AttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = "__all__"