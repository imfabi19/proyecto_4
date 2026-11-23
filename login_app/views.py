from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_frameworks.decorators import api_view, permission_classes
from rest_framework.permission import  AllowAny, isAuthenticated
from rest_framework.response import Response

# Create your views here.
@api_view(['POST'])
@permission_classes(['AllowAny'])

def login(request):
    pass
    #Obtiene el username y password desde el json
    usuario = request.data.get('usuario')
    password= request.data.get('password')

    #Validacion  muy simple para identificar el nombre de usuario
    if not usuario or not password:
        return Response(
            data :{'error': 'Se requieren usuario y contraseña'},
            status=status.HTTP_400_BAD_REQUEST
        )
    @api_view(['POST'])
    @permission_classes(['IsAuthenticated'])

def logout(request):
    pass
