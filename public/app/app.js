angular.module('userApp', ['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','emailController','managementController','chirpController'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});


