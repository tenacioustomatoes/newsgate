angular.module('link.controllers', ['link.services'])
.controller('HomeController', function($scope, LinkFactory, $location) {
  $scope.starter = 'hi from link controller!';
  $scope.showlink = false
  $scope.showkeyword = true
  $scope.link = [];
  $scope.topKeywordNum = 8;
  $scope.getLinks = function() {
    LinkFactory.getLinks().then(response => {
      console.log(response.data.link)
      $scope.linksNum = response.data.link.length;
      $scope.links = response.data.link;
      $scope.keywords = response.data.link.map(link => {
        return link.keywords
      })
      $scope.keywords = [].concat.apply([], $scope.keywords)
      console.log($scope.keywords)
    }) 
  }
  $scope.showKeywords = function () {
    $scope.showlink = false;
    $scope.showkeyword = true;   
  }

  $scope.showLinks = function() {
    $scope.showlink = true;
    $scope.showkeyword = false;      
  }
  //var merged2 = [].concat(["$6"], ["$12"], ["$25"], ["$25"], ["$18"], ["$22"], ["$10"]);
  $scope.getLinks();
})

// .controller('ShowController', function($scope, PokeFactory, $location) {
//   $scope.starter = 'hello from show pokemon page!!!'
  
//   $scope.goHome = function() {
//     $location.path('/')
//   }
//   $scope.getPokemons = function() {
//     PokeFactory.getAllPokemon().then(response => {
//       console.log(response);
//       $scope.pokemons=response.data;
//     })
//   }
//   $scope.getPokemons();
// })

// .controller('AddController', function($scope, PokeFactory, $location) {
//   $scope.starter = 'hello from add pokemon page!!!'
//   $scope.pokemon = {};
//   $scope.pokemon.types=[];
//   $scope.errMsg = ''
//   $scope.goHome = function() {
//     $location.path('/')
//   }
//   $scope.addAPokemon = function () {
//     if ($scope.pokemon.types.length < 1) {
//       console.log('error adding')
//       $scope.errMessage = 'please add at least 1 type by entering a type and clicking the add type button'
//     } else {
//       console.log('adding pokemon')
//       PokeFactory.addPokemon($scope.pokemon).then(response => {
//         console.log(response);
//         $scope.pokemon.name = ''
//         $scope.pokemon.imageUrl = ''
//         $scope.pokemon.id = ''
//       })
//     }
//   }
//   $scope.addType = function () {
//     $scope.pokemon.types.push($scope.type)
//     $scope.type = ''
//   }
// })

// .controller('FilterController', function($scope, PokeFactory, $location) {
//   $scope.starter = 'hello from filter pokemon page!!!'
//   $scope.goHome = function() {
//     $location.path('/')
//   }

//   $scope.filterByThisType = function() {
//     PokeFactory.getAllPokemon()
//     .then(response => {
//       $scope.pokemons=response.data;
//       $scope.filterPokemons = []
//       console.log($scope.type);
//       console.log($scope.pokemons);
//       var tempArray = []
//       var tempArray = $scope.pokemons.slice();
//       console.log(tempArray);
//       tempArray.forEach(function(pokemon) {
//         //return pokemon.name === "Bulbasaur";
//         if (pokemon.types.indexOf($scope.type) > -1) { //why doesn't this line work????
//         //if(pokemon.types[0] === $scope.type) {
//           $scope.filterPokemons.push(pokemon)
//         }
//       })
//       console.log($scope.filterPokemons);
//     })
//   }
// })
