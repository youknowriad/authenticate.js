// Router
angular.module('authenticate.js', ['ngRoute']);

// Handling Authorisations
angular.module('authenticate.js').run(['$rootScope', '$location', 'AuthenticateJS', function ($rootScope, $location, AuthenticateJS) {
    $rootScope.$on("$routeChangeStart", function (event, next) {
        if (!AuthenticateJS.authorize(next.security)) {
            if (AuthenticateJS.isLoggedIn()) {
                $location.path(AuthenticateJS.unauthorizedPage);
            } else {
                $location.path(AuthenticateJS.loginPage);
            }
        }
    });
}]);
