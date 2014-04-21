// Router
angular.module('authenticate.js', ['ngRoute']);

// Handling Authorisations
angular.module('authenticate.js').run(['$rootScope', '$location', 'AuthenticateJS', 'Referer',
  function ($rootScope, $location, AuthenticateJS, Referer) {
  $rootScope.$on("$routeChangeStart", function (event, next) {
    if (!AuthenticateJS.authorize(next.security)) {
      if (AuthenticateJS.isLoggedIn()) {
        $location.path(AuthenticateJS.unauthorizedPage);
      } else {
        Referer.set($location.url());
        $location.path(AuthenticateJS.loginPage);
      }
    }
  });
}]);
