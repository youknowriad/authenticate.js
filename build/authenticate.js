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

angular.module('authenticate.js').directive('authenticateLoginForm', function () {
    return {
        controller: ['$scope', '$location', 'AuthenticateJS', function ($scope, $location, AuthenticateJS) {
            $scope.error    = false;
            $scope.loading  = true;

            // Check Login
            AuthenticateJS.check().then(function() {
                $location.path(AuthenticateJS.targetPage);
            }, function() {
                $scope.loading = false;
            });

            // Login
            $scope.submit = function() {
                AuthenticateJS.login($scope.username, $scope.password).then(function() {
                    $location.path(AuthenticateJS.targetPage);
                }, function() {
                    $scope.error = true;
                });
            };
        }],

        template: '\
            <form class="login-form" data-ng-hide="loading" data-ng-submit="submit()">\
                <div class="alert alert-error" ng-show="error">\
                    Check your username or password\
                    <button class="close" ng-click="error = false">&times;</button>\
                </div>\
                <input type="text" placeholder="Username" data-ng-model="username" />\
                <input type="password" placeholder="Password" data-ng-model="password" />\
                <input type="submit" value="Login" />\
            </div>\
        '
    };
});

angular.module('authenticate.js').provider('AuthenticateJS', function () {

    var config = {
        host: '/',
        loginUrl: 'login',
        logoutUrl: 'logout',
        loggedinUrl: 'loggedin',

        unauthorizedPage: '/unauthorized',
        targetPage: '/',
        loginPage: '/login',
        logoutPage: '/logout'
    };

    this.setConfig = function (configuration) {
        config = configuration;
    };

    this.$get = ['$http', '$q', function ($http, $q) {

        var user = null,
            lastUser = null;

        return {

            targetPage: config.targetPage,
            loginPage: config.loginPage,
            unauthorizedPage: config.unauthorizedPage,
            logoutPage: config.logoutPage,

            getUser: function () {
                return user;
            },

            getLastUser: function () {
                return lastUser;
            },

            isLoggedIn: function () {
                return user !== null;
            },

            authorize: function (role) {
                return !role || (
                    user !== null &&
                    (role === true || _.contains(user.roles, role))
                );
            },

            login: function (username, password) {
                var defer = $q.defer();
                $http({
                    url: config.host + config.loginUrl,
                    method: 'POST',
                    data: {
                        username: username,
                        password: password
                    }
                }).success(function (data) {
                    user = data;
                    lastUser = data;
                    defer.resolve(user);
                }).error(function () {
                    defer.reject();
                });

                return defer.promise;
            },

            logout: function () {
                var defer = $q.defer();
                $http.get(config.host + config.logoutUrl).success(function () {
                    user = null;
                    $location.path(config.logoutPage);
                    defer.resolve();
                }).error(function () {
                    defer.reject();
                });

                return defer.promise;
            },

            check: function () {
                var defer = $q.defer();
                $http({
                    url: config.host + config.loggedinUrl,
                    method: 'GET'
                }).success(function (data) {
                    user = data;
                    lastUser = data;
                    defer.resolve(user);
                }).error(function () {
                    user = null;
                    defer.reject();
                });

                return defer.promise;
            }
        };
    }];
});
