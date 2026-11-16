from django.db import models

class Autor(models.Model):
    nombre = models.CharField(max_length=150)
    nacionalidad = models.CharField(max_length=100)
    anio_nacimiento = models.IntegerField()

    class Meta:
        verbose_name_plural = "Autores"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    isbn = models.CharField(max_length=20, unique=True)
    anio_publicacion = models.IntegerField()
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Libros"
        ordering = ['anio_publicacion']

    def __str__(self):
        return self.titulo
