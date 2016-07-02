    // create the module and name it scotchApp
        // also include ngRoute for all our routing needs
    var scotchApp = angular.module('scotchApp', ['ngRoute']);

    scotchApp.filter('urlencode', function() {
      return function(input) {
        return window.encodeURIComponent(input);
      }
    });

    // configure our routes
    scotchApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/play/:title/:image', {
                templateUrl : 'pages/play.html',
                controller  : 'playController'
            })

            // route for the contact page
            .when('/recent', {
                templateUrl : 'pages/recent.html',
                controller  : 'recentController'
            });
    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('mainController', function($scope,$http) {
        $scope.next_href = null;
        // create a message to display in our view
        parse_tracks = function(tracks) {
              console.log(tracks);
              if (tracks.next_href)
                $scope.next_href = tracks.next_href;
              else
                $scope.next_href = null;
              results = [];
              for (var i=0;i<tracks.collection.length;i++) {
                  var track = tracks.collection[i];
                  results.push({title:track.title,image:track.artwork_url});
              }
              $scope.results = results;
              console.log($scope.results);
        };
        $scope.search = function() {
            SC.initialize({
              client_id: 'd652006c469530a4a7d6184b18e16c81'
            });

            SC.get('/tracks', {
              q: $scope.searchString, license: 'cc-by-sa',
                limit: 6, linked_partitioning: 1
            }).then(function(tracks) {
                parse_tracks(tracks);
            });
        };
        $scope.next = function() {
            console.log($scope.next_href);
            $http.get($scope.next_href).then(function(tracks) {
                parse_tracks(tracks.data);
            });
        };
    });

    scotchApp.controller('playController', function($scope,$routeParams) {
        $scope.init = function() {
            console.log(1);
            $scope.title = $routeParams.title;
            $scope.image_url = $routeParams.image;
            console.log($scope.title);
            console.log($scope.image_url);
        }
    });

    scotchApp.controller('recentController', function($scope) {
        searches = [];
        for (var i=0;i<10;i++) {
            searches.push({text:"book_"+(i+1),price:(i+1)*15});
        }
        $scope.searches = searches;
    });
