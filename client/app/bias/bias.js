//allsides: scale 0-4
//0 - left left
//1 - left
//2 - center
//3 - right
//4 - right right
//http://www.allsides.com/bias/bias-ratings

angular.module('newsgate.bias', [])
.controller('BiasController', function($scope, $rootScope, $http, Data) {
  $scope.biasResult = '';

  var rating = {
    '0': "Far Left",
    '1': 'Left',
    '2': 'Center',
    '3': 'Right',
    '4': 'Far Right'
  };

  //should be fired when query is set off
  $scope.searchBias = function(url) {
    url = 'cnn.com';
    $http.get('/bias')
      .then(function(res) {
        $scope.biasData = res.data[0];
        console.log('bias data',$scope.biasData);
        if ($scope.biasData[url]) {
          console.log('rating',rating[$scope.biasData[url]]);
        }
      });
  };

});
