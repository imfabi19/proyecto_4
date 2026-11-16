from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Libro
from .serializers import LibroSerializer

# Create your views here.

@api_view(['POST', 'PUT'])
def crear_libro(request):
    serializer = LibroSerializer(data=request.data)

    if serializer.is_valid(): #Crear Libro
        serializer.save() #Guardar datos
        return Response(serializer.data, status=status.HTTP_201_CREATED) #Libro creado
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def listar_libros(request):
    libros = Libro.objects.all()
    serializer = LibroSerializer(libros, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK) #Libro listado


@api_view(['PATCH'])
def modificar_libro(request, id):
    try:
        libro = Libro.objects.get(pk=id)
    except Libro.DoesNotExist:
        return Response({'error': 'Libro no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    serializer = LibroSerializer(libro, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def eliminar_libro(request, id):
    try:
        libro = Libro.objects.get(pk=id)
    except Libro.DoesNotExist:
        return Response({'error': 'Libro no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    libro.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)