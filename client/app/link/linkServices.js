angular.module('link.services', [])
.factory('LinkFactory', function($http) {
  var getLinks = function () {
    return $http({
      method: 'GET',
      url: 'http://localhost:8000/api/links' //i'm using the escape option for server 
    }, function(response) {
      return response;
    })
  }
  return {
    getLinks: getLinks 
  }
})
