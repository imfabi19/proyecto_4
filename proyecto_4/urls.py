"""
URL configuration for proyecto_4 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
rutas
from django.contrib import admin
from django.urls import path
from biblioteca.views import crear_libro, listar_libros, modificar_libro, eliminar_libro

urlpatterns = [
    path('admin/', admin.site.urls),
    path('libro/crear', crear_libro),
    path('libros', listar_libros),
    path('libro/modificar/<int:id>', modificar_libro),
    path('libro/eliminar/<int:id>', eliminar_libro),
]
