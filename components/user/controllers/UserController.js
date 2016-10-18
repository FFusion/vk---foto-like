// Generated by CoffeeScript 1.7.1
'use strict';
UserModule.controller('UserController', function($scope, $stateParams, $window, $location, $state, RestModel, Notification, UserModel, LocalStorage, user, params) {
  $scope.window = window;
  $scope.params = params;
  $scope.user = RestModel.isWorkingFriendsObject(user);
  $scope.relationStatus = UserModel.getRelationStatus($scope.user);
  $scope.lastSeen = LocalStorage.getItem('last');
  $scope.back = function() {
    return $scope.window.history.back();
  };
  $scope.home = function() {
    if (LocalStorage.getItem('page')) {
      LocalStorage.removeItem('page');
    }
    return $state.transitionTo('friends');
  };
  $scope.login = function() {
    return $window.location = '/login';
  };
  $scope.checkWall = function(user) {
    return $state.transitionTo('selected', {
      userId: user.id,
      type: 'wall'
    });
  };
  $scope.getUserFriends = function(user) {
    return $state.transitionTo('user-friend', {
      userId: user.id
    });
  };
  $scope.checkPhotoOne = function(user) {
    return $state.transitionTo('selected', {
      userId: user.id,
      type: 'photo'
    });
  };
  $scope.checkPhotoAll = function(user) {
    return $state.transitionTo('processingPhoto', {
      userId: user.id
    });
  };
  $scope.checkWallAll = function(user) {
    return $state.transitionTo('processingWall', {
      userId: user.id
    });
  };
  $scope.getCommentsOfPhoto = function(user) {
    return $state.transitionTo('commentsPhoto', {
      userId: user.id
    });
  };
  return $scope.getCommentsOfGroup = function(user) {
    return $state.transitionTo('commentsGroup', {
      userId: user.id
    });
  };
});

//# sourceMappingURL=UserController.map
