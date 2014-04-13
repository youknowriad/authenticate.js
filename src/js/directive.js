angular.module('authenticate.js').directive('authenticateLoginForm', function () {
  return {
    scope: true,
    controller: ['$scope', '$location', 'AuthenticateJS', function ($scope, $location, AuthenticateJS) {
      $scope.error    = false;
      $scope.ready  = false;

      // Check Login
      AuthenticateJS.check().then(function() {
        $location.path(AuthenticateJS.targetPage);
      }, function() {
        $scope.ready = true;
      });

      // Login
      $scope.submit = function() {
        if (!$scope.loading) {
          $scope.loading  = true;
          AuthenticateJS.login($scope.username, $scope.password).then(function() {
            $scope.loading  = false;
            $location.path(AuthenticateJS.targetPage);
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