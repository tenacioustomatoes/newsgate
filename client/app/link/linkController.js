angular.module('link.controllers', ['link.services'])
.controller('HomeController', function($scope, LinkFactory, $location, $window) {
  $scope.starter = 'hi from link controller!';
  $scope.showlink = false
  $scope.showkeyword = true
  $scope.link = [];
  $scope.filteredLinks = [];
  var getKeywords = function (responseObject) {
    console.log('in function');
    var keywordsArray = responseObject.map(link => link.keywords);
    keywordsArray = [].concat.apply([], keywordsArray);
    console.log(keywordsArray);
    var keywordsObj = keywordsArray.reduce(function (totalKeyWords, keyword) {
      if (!totalKeyWords.hasOwnProperty(keyword.text)) {
        totalKeyWords[keyword.text] = Number(keyword.relevance);
      } else {
        totalKeyWords[keyword.text] = totalKeyWords[keyword.text] + Number(keyword.relevance);
      }
      return totalKeyWords;
    }, {});
    console.log('keywords object --->', keywordsObj);
    keywordsArray = [];
    for (var key in keywordsObj) {
      keywordsArray.push({
        text: key, 
        relevance: keywordsObj[key] 
      })
    }
    keywordsArray.sort((a, b) => {
      return Number(b.relevance) - Number(a.relevance)
    })
    console.log('key words array --->', keywordsArray);
    return keywordsArray;    
  }

  $scope.getLinks = function() {
    LinkFactory.getLinks().then(response => {
      console.log(response.data.link)
      $scope.linksNum = response.data.link.length;
      $scope.links = response.data.link.reverse();
      $scope.keywords = getKeywords($scope.links);
      // $scope.keywords = response.data.link.map(link => link.keywords)
      // $scope.keywords = [].concat.apply([], $scope.keywords)
      console.log($scope.keywords)
    }) 
  }
  $scope.filterByKeyword = function (keyword) {
    console.log(keyword);
    $scope.filteredLinks = $scope.links.filter(link=> {
      var linkKeywordArr = link.keywords.map(linkkeyword => linkkeyword.text);
      return linkKeywordArr.indexOf(keyword.text) > -1
    });
    $scope.showfiltered  = true;
  }

  $scope.goToLink = function (url) {
    $window.location.href = url
  }

  $scope.showKeywords = function () {
    $scope.showlink = false;
    $scope.showkeyword = true;   
  }

  $scope.showLinks = function() {
    $scope.showlink = true;
    $scope.showkeyword = false;      
  }

  $scope.login = function () {
    $window.location.href = 'http://localhost:8000/login/facebook'
  }
  $scope.getLinks();
})


  