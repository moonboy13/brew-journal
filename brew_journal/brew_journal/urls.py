from django.conf.urls import patterns, include, url

from brew_journal.views import IndexView

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView

router = routers.SimpleRouter()
router.register(r'account', AccountViewSet)

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'brew_journal.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),

    # Default index view. Must be last to avoid accidentially catching other URLs
    url(r'^$', IndexView.as_view(), name='index'),
)
