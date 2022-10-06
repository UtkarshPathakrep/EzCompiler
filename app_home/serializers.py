from .models import CompilerAPIModel
from rest_framework import serializers

class CompilerAPIModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompilerAPIModel
        fields = ["source_code_file", "additional_file", "code_language", "final_response"]