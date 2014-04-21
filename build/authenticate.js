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

angular.module('authenticate.js').directive('authenticateLoginForm', function () {
  return {
    scope: true,
    controller: ['$scope', '$location', 'AuthenticateJS', 'Referer',
      function ($scope, $location, AuthenticateJS, Referer) {
      $scope.error    = false;
      $scope.ready  = false;

      var redirect = function () {
        if (Referer.has()) {
          var url = Referer.get();
          Referer.reset();
          $location.path(url);
        } else {
          $location.path(AuthenticateJS.targetPage);
        }
      };

      // Check Login
      AuthenticateJS.check().then(function() {
        redirect();
      }, function() {
        $scope.ready = true;
      });

      // Login
      $scope.submit = function() {
        if (!$scope.loading) {
          $scope.loading  = true;
          AuthenticateJS.login($scope.username, $scope.password).then(function() {
            $scope.loading  = false;
            redirect();
          }, function() {
            $scope.loading  = false;
            $scope.error = true;
          });
        }
      };
    }],

    templateUrl: function(element, attr) {
      return attr.templateUrl ? attr.templateUrl : 'partials/authenticateJS/login.html';
    }
  };
});
angular.module('authenticate.js').factory('Referer', function() {

  return {
    url: false,

    has: function() {
      return this.url !== false;
    },

    reset: function () {
      this.url = false;
    },

    set: function (url) {
      this.url = url;
    },

    get: function () {
      return this.url;
    }
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
    loginPage: '/login'
  };

  this.setConfig = function (configuration) {
    config = configuration;
  };

  this.$get = ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

    var user = null,
        lastUser = null;

    return {

      targetPage: config.targetPage,
      loginPage: config.loginPage,
      unauthorizedPage: config.unauthorizedPage,

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
            $rootScope.$broadcast('AuthenticateJS.login', user);
          }).error(function () {
            defer.reject();
          });

        return defer.promise;
      },

      logout: function () {
        var defer = $q.defer();
        $http.get(config.host + config.logoutUrl).success(function () {
          user = null;
          defer.resolve();
          $rootScope.$broadcast('AuthenticateJS.logout');
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
            var previous = user;
            user = data;
            lastUser = data;
            defer.resolve(user);
            if (!angular.equals(previous, user)) {
              $rootScope.$broadcast('AuthenticateJS.login', user);
            }
          }).error(function () {
            if (user !== null) {
              $rootScope.$broadcast('AuthenticateJS.logout');
            }
            user = null;
            defer.reject();
          });

        return defer.promise;
      }
    };
  }];
});
