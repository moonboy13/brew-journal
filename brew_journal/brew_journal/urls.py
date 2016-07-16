from django.conf.urls import patterns, include, url

from brew_journal.views import IndexView

from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView
from recipies.views import RecipeViewSet, RecipeStepsViewSet

# Splitting accounts and recipes onto two different routers for better nesting capabilities
account_router = routers.SimpleRouter()
account_router.register(r'account', AccountViewSet)

recipe_router = routers.SimpleRouter()
recipe_router.register(r'recipe', RecipeViewSet, base_name='recipe')

# Create a router nested on the recipe router for recipe_steps
recipe_steps_router = routers.NestedSimpleRouter(recipe_router, r'recipe', lookup='recipe')
recipe_steps_router.register(r'step', RecipeStepsViewSet, base_name='recipe-step')

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'brew_journal.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # Include the accounts router
    url(r'^api/v1/', include(account_router.urls)),
    # Next comes the recipe routes
    url(r'^api/v1/', include(recipe_router.urls)),
    # Now dem steps
    url(r'^api/v1/', include(recipe_steps_router.urls)),

    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),

    # Default index view. Must be last to avoid accidentially catching other URLs
    url(r'^(?!/+view).*$', IndexView.as_view(), name='index'),
)
