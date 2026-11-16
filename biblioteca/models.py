from django.db import models

# Create your models here.

class autor (models.Model):
    nombre = models.CharField(max_length=100)
    nacionalidad = models.CharField(max_length=200)
    anio_nacimiento = models.DateField()

    class Meta:
        verbose_name_plural = 'autores'
        ordering = ('nombre',)
