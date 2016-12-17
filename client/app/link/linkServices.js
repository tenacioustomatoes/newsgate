angular.module('link.services', [])
.factory('LinkFactory', function($http) {
  var getLinks = function () {
    return $http({
      method: 'GET',
      //update links
      url: 'http://localhost:8000/api/pokemon' //i'm using the escape option for server 
    }, function(response) {
      return response;
    })
  }

  return {
    getLinks: getLinks 
  }
})
