(function () {

  //Starts the main app module
  var app = angular.module('myreddit', ['ionic', 'angularMoment'])

  app.controller("RedditCtrl", function ($http, $scope) {

    $scope.stories = [];

    //Fetches the data from Reddit API
    function loadStories(params, callback) {
      $http.get("https://www.reddit.com/r/Android/new/.json", {params: params})
          .success(function (response) {
            var stories = [];
            angular.forEach(response.data.children, function (child) {
              $scope.stories.push(child.data);
            });
        callback(stories);
          });
    }

    //Performs the pulling old records 
    $scope.loadOlderStories = function () {
      var params = {};
      if($scope.stories.length > 0)
          params['after'] = $scope.stories[$scope.stories.length-1].name;

      loadStories(params, function (olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    
    //Realizes the getting new records
    $scope.loadNewerStories = function () {
      var params = {'before': $scope.stories[0].name};

      loadStories(params, function (newerStories) {
        $scope.stories = $scope.stories.concat(newerStories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    
    //Opens the record in new window
    $scope.openLink = function (url) {
      window.open(url, "_blank");
    }
  });
  
  //Implements the cordova setting  
  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

})();