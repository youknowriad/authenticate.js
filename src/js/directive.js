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
