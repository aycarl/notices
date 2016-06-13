var noticesApp = angular.module('noticesApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope){
  $rootScope.authenticated = false;
  console.log('user authenticated:', $rootScope.authenticated);
  $rootScope.current_user = '';

  $rootScope.signout = function(){
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };

});

//displays in the browser console
console.log('inside notices app');

noticesApp.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'notices.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

noticesApp.controller('mainController', ['$scope', '$http', function($scope, $http, postService){

  $http.get('js/data.json').success(function(data){
    $scope.notices = data;
    console.log('List of notices is beings accessed!');
  });

  //creating empty variables
  // $scope.notices = [];
  // $scope.newNotice = {created_by: '', text: '', created_at: ''};
  
  // postService.getAll().success(function(data){
  //   $scope.posts = data;
  // });
  // $scope.notices = postService.query();

  //making a post call to update the list
  // $scope.post = function(){

  //   $scope.newNotice.created_by = $rootScope.current_user;
  //   $scope.newNotice.created_at = Date.now();
  //   postService.save($scope.newNotice, function(){
  //     $scope.posts = postService.query();
  //     $scope.newNotice = {created_by: '', text: '', created_at: ''};
  //   });
    // $scope.newNotice.created_at = Date.now();
    // $scope.notices.push($scope.newNotice);
    // $scope.newNotice = {created_by: '', text: '', created_at: ''};
    // $('#newIcon').css('animation','newEntry');

  // };
}]);

// noticesApp.factory('postService', function($http){
//   var baseUrl = "/api/posts";
//   var factory = {};
//   factory.getAll = function(){
//     return $http.get(baseUrl);
//   };
//   return factory;
// });

noticesApp.factory('postService', function($resource){
  return $resource('/api/notices/:id');
});

noticesApp.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    //test display in the console
    console.log('user authenticated:', $rootScope.authenticated);
    console.log('inside login function');

    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        //text display in the console
        console.log('with current user: ', $rootScope.current_user);
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
      // $scope.error_message = 'login request for ' + $scope.user.username;
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});