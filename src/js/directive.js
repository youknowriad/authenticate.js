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