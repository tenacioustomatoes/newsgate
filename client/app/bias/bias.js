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

  $http.get('/bias')
    .then(function(res) {
      $scope.biasData = res.data[0];
      console.log($scope.biasData);
    });

  var rating = {
    '0': "Far Left",
    '1': 'Left',
    '2': 'Center',
    '3': 'Right',
    '4': 'Far Right'
  };

  //should be fired when query is set off
  $scope.searchBias = function(url) {
    //checks url against urls in biased list
    console.log('url',url);
    // for (var data in $scope.biasData) {
    //   console.log(data);
    //   if (data === $scope.biasData) {
    //     //if url found in data, return scoring
    //     console.log(rating[data[$scope.biasData]]);
    //     return rating[data[$scope.biasData]];
    //   }
    // }
  };

  //call the function with the url to return rating
  $scope.searchBias('cnn.com');
  console.log($scope.biasResult);

});
