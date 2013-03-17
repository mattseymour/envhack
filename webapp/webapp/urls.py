from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'app.views.home', name='home'),
    url(r'data/$', 'app.views.data', name='data'),
    url(r'^submit/$', 'app.views.submission', name='submission'),
    url(r'^view/$', 'app.views.view', name='view'),
    url(r'^import/$', 'app.views.importer', name='import'),
    url(r'^random/$', 'app.views.random', name='random'),
    url(r'^thanks/$', 'app.views.thanks', name='thanks'),
    # url(r'^webapp/', include('webapp.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)


urlpatterns += staticfiles_urlpatterns()
