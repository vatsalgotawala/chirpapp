angular.module('chirpController',['userServices'])

.controller('chirpCtrl', function($scope, $rootScope, postService, $interval){

	$scope.posts = [];
	$scope.newPost = {created_by: '', text: '', created_at: ''};

	function getAll(){
		postService.getAll().success(function(data){
			$scope.posts = data;
		});
	}
	
	getAll();

	this.getPosts = function(){
		var interval = $interval(function(){
			getAll();
		},10000);
	};
	
	this.getPosts();

	$scope.post = function(){
		$scope.newPost.created_by = $scope.main.username;
	  	$scope.newPost.created_at = Date.now();

	  	postService.postMessage($scope.newPost).then(function(){ 
	  		getAll();
	  		$scope.newPost = {created_by: '', text: '', created_at: ''};
	  	});		
	};	
});