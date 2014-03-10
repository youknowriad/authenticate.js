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
