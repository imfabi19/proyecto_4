from rest_framework import serializers

from models. import Libro, Autor



class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = ['id', 'nombre', 'nacionalidad', 'anio_nacimiento']

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = ['id', 'titulo', 'isbn', 'anio_publicacion', 'autor_id']