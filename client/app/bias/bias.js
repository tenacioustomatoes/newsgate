//allsides: scale 0-4
//0 - left left
//1 - left
//2 - center
//3 - right
//4 - right right
//http://www.allsides.com/bias/bias-ratings

angular.module('newsgate.reportcard', [])
.controller('ReportCardController', function($scope, $rootScope, $http, Data) {

  $scope.validEmos = function(emoObj){
    $scope.joy = false;
    $scope.emoBool = [];
    for (var emo in emoObj){
      console.log(emoObj);
      if (emoObj[emo] === true){
        if (emoObj[emo] === 'joy'){
          $scope.joy = true;
        }
        $scope.emoBool.push(emo)
      }
    }
    console.log('joy',$scope.joy);
    if ($scope.emoBool.length === 0){
      $scope.joy = true;
      $scope.emoBool.push('No significant emotions detected');
    }
    console.log('emo bools',$scope.emoBool);
  };

  reqUrl = location.search.substring(1);
  console.log(reqUrl);
  $http.post('/api/reportcard', {url: reqUrl})
    .then(function(res) {
      console.log('res', res);
      $scope.bias = res.data.bias.bias[0];
      $scope.leaning($scope.bias);
      $scope.sentiment = res.data.sentiment.docSentiment.type; // positive or negative
      console.log($scope.sentiment);

      var emos = res.data.emotions.docEmotions;
      $scope.emotions = {};  // key is emotion and value is true/false, ng-repeat, if none true, N/A
      for (var emo in emos) {
        $scope.emotions[emo] = emos[emo] > 0.5;
      }
      $scope.validEmos($scope.emotions);
    })
    .catch(function(err) {
      console.log('err', err);
    });
  // };

  $scope.leaning = function(bias){
    if ($scope.bias === 'Left' || 'Lean Left') {
      $scope.lean = 'left';
    }
    if ($scope.bias === 'Right' || 'Lean Right') {
      $scope.lean = 'right';
    }
    if ($scope.bias === 'Center') {
      $scope.lean = 'center';
    }
  }


});
