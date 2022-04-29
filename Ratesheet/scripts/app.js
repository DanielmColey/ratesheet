'use strict';

angular.module('mytechtipdemoApp', [
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
      .when('/', {
        template: '<button ng-click="logout()">Logout</button>',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        template: '<form ng-submit="login()" name="loginForm"> username: <input type="text" ng-model="user.username"> <br/> password: <input type="password" ng-model="user.password"><button>login</button></form>',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
})
.factory('Auth', function ($rootScope, $window, $http) {
  return {
    login: function (user, successHandler, errorHandler) {
      if (user.username == 't' && user.password == 't') {
        this.setLoggedInUser(user);
        successHandler(user);
      } else {
        alert("Invalid login");
        errorHandler(user);
      }
    },
    getLoggedInUser: function () {
      if ($rootScope.user === undefined || $rootScope.user == null) {
        var userStr = $window.sessionStorage.getItem('user');
        if (userStr) {
          $rootScope.user = angular.fromJson(userStr);
        }
      }
      return $rootScope.user;
    },
    isLoggedIn: function () {
      return this.getLoggedInUser() != null;
    },
    setLoggedInUser: function (user) {
      $rootScope.user = user;
      if (user == null) {
        $window.sessionStorage.removeItem('user');
      } else {
        $window.sessionStorage.setItem('user', angular.toJson($rootScope.user));
      }
    }
  };
})
.controller('LoginCtrl', function ($scope, Auth, $location, $http) {
  $scope.user = {};

  $scope.login = function () {
    Auth.login($scope.user, function () {
      $location.path('/index.html');
    }, function (e) {
    });
  };
})
.controller('MainCtrl', function ($scope, Auth, $location) {

  $scope.logout = function () {
    Auth.setLoggedInUser(null);
    $location.path('/somewhere');
  };
})
.run(['$window', '$rootScope', '$location', 'Auth', function ($window, $rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event) {
      if (!Auth.isLoggedIn() &&
          $location.path() !== '/login') {
        $location.path('/login');
      }
    });
}]);