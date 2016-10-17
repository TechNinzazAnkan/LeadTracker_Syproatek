angular.module('ninzazAngular', ['ui.router','ngDialog','ninzazAngular.controllers', 'ninzazAngular.services'])

.config(function($stateProvider, $urlRouterProvider){
	//console.log(sessionStorage.getItem("userLoggedIn"));
	if(sessionStorage.getItem("userLoggedIn") == null){
		$urlRouterProvider.otherwise('login');
	} else if(sessionStorage.getItem("userLoggedIn") == 'true'){
		console.log("User already Logged In");
		$urlRouterProvider.otherwise('home');		
	} else {
		console.log("User Not Logged In");
		$urlRouterProvider.otherwise('login');	
	}
		
	
	$stateProvider
		.state('login',{
			url: '/login',
			templateUrl : 'pages/agentLog.html',
			controller : 'SignUpCtrl'
		})
		.state('agentSignUp',{
			url: '/agentSignUp',
			templateUrl : 'pages/agentSignUpPage.html',
			controller : 'SignUpCtrl'
		})
		.state('home',{
			url: '/home',
			templateUrl : 'pages/homePage.html',
			controller :'HomeCtrl'
		})
		.state('salesCallerHome',{
			url: '/salesCallerHome',
			templateUrl : 'pages/salesCallerHomePage.html',
			controller : 'SalesCallerHomeCtrl'
		})
		.state('leadDetails',{
			url: '/leadDetails/:id',
			templateUrl : 'pages/leadDetailsPage.html',
			controller :'leadDetailsCtrl'
		})
		/*
		.state('listingPage',{
			url: '/listingPage',
			templateUrl: 'web/admin/listing.html',
			controller: 'listingController'
		})
		.state('home.blog',{
			url: '/blog',
			templateUrl: 'web/home-list.html',
			controller: function($scope) {
				$scope.dogs = ['The Pitbull','Rottweiller','Huskies','Doberman','Brazillian Mastiff','Great Dane','Akita Inu']
			}
		})
		.state('about',{
			url: '/about',
			views: {

	            // the main template will be placed here (relatively named)
	            '': { templateUrl: 'web/about-us.html' },

	            // the child views will be defined here (absolutely named)
	            'columnOne@about': { template: 'Look I am a column!' },

	            // for column two, we'll define a separate controller 
	            'columnTwo@about': { 
	                templateUrl: 'web/table-data.html',
	                controller: 'scotchController'
	            }
	        }
		})*/

});