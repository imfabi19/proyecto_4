from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AutorViewSet, LibroViewSet

router = DefaultRouter()
router.register('autors', AutorViewSet)
router.register('libros', LibroViewSet)

urlpatterns = [
    path('', include(router.urls)),
]