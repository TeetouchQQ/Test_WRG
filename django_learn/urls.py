"""django_learn URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.contrib import admin
from django.urls import path
from blogs import views

from django.http import StreamingHttpResponse
from camera import VideoCamera, gen

urlpatterns = [
    path('monitor/', lambda r: StreamingHttpResponse(gen(VideoCamera()),content_type='multipart/x-mixed-replace; boundary=frame')),
    path('admin/', admin.site.urls),
    path('',views.render_templates),
    path('page1/',views.render_page1),
    path('createform/',views.render_createform),
    path('addform/',views.addBlock),
    path('test/',views.get_list),
    path('cart/',views.show_cart),
    path('pay_face/',views.show_pay_face),
    path('face_success/',views.face_success),
    path('pay_qr/',views.show_qr),
    path('face_fail/',views.face_fail),
    path('sells/',views.show_sells),
    path('pay/',views.show_pay)
]
