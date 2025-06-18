from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, IPO, Document


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={
                                     'input_type': 'password'})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'rhp_pdf', 'drhp_pdf']

class IPOSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True)

    class Meta:
        model = IPO
        fields = [
            'id',
            'price_band',
            'open_date',
            'close_date',
            'issue_size',
            'issue_type',
            'listing_date',
            'status',
            'ipo_price',
            'listing_price',
            'listing_gain',
            'current_market_price',
            'current_return',
            'documents'
        ]
    def update(self, instance, validated_data):
        documents_data = validated_data.pop('documents', [])

        # Update IPO fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update documents - clear and recreate strategy (simple way)
        instance.documents.all().delete()
        for doc_data in documents_data:
            Document.objects.create(ipo=instance, **doc_data)

        return instance
class CompanySerializer(serializers.ModelSerializer):
    ipos = IPOSerializer(many=True)

    class Meta:
        model = Company
        fields = ['id', 'company_name', 'company_logo', 'ipos']
    def create(self, validated_data):
        ipos_data = validated_data.pop('ipos', [])
        company = Company.objects.create(**validated_data)

        for ipo_data in ipos_data:
            documents_data = ipo_data.pop('documents', [])
            ipo = IPO.objects.create(company=company, **ipo_data)

            for doc_data in documents_data:
                Document.objects.create(ipo=ipo, **doc_data)

        return company