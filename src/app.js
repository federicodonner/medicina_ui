var app = angular.module('amerendar', [
  'ui.router',
  'ngResource',
  'LocalStorageModule',
]);

app.constant('Configuration',configuration);



app.config([
  '$stateProvider',
  function(
    $stateProvider
  ){
    var home = {
      name: 'home',
      url: '/home',
      templateUrl: 'app/states/home/index.html',
      controller: 'HomeController'
    }

    var situacion = {
      name: 'situacion',
      url: '/situacion',
      templateUrl: 'app/states/situacion/index.html',
      controller: 'SituacionController'
    }

    var locations = {
      name: 'locations',
      url: '/locations',
      templateUrl: 'app/states/locations/index.html',
      controller: 'LocationsController'
    }

    var products = {
      name: 'products',
      url: '/products',
      templateUrl: 'app/states/products/index.html',
      controller: 'ProductsController'
    }

    var almuerzos = {
      name: 'almuerzos',
      url: '/almuerzos',
      templateUrl: 'app/states/almuerzos/index.html',
      controller: 'AlmuerzosController'
    }

    var contact = {
      name: 'contact',
      url: '/contact',
      templateUrl: 'app/states/contact/index.html',
      controller: 'ContactController'
    }

    $stateProvider
    .state(home)
    .state(situacion)
    .state(locations)
    .state(products)
    .state(almuerzos)
    .state(contact);

  }]);


  app.run([
    '$state',
    function (
      $state
    ){
      $state.go('home');

    }]);
