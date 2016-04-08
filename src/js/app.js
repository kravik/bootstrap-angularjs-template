'use strict';

angular.module('mainApp', [])
    .constant('itemsUrl', 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness(20)%20where%20api_key%3D%2292bd0de55a63046155c09f1a06876875%22%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
    .controller('demoController', ['$scope', '$http', 'itemsUrl', function($scope, $http, itemsUrl) {
        $scope.items = [];

        $scope.init = function () {
            $http.get(itemsUrl).success(function(data){
                $scope.items = data.query.results.photo;
                console.log('angular', $scope.items);
            });
        };

        $scope.init();
  }]);