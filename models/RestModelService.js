// Generated by CoffeeScript 1.7.1
'use strict';
MainModule.factory('RestModel', function($q, $http, vk) {
  var RestModel;
  RestModel = (function() {
    function RestModel() {}

    return RestModel;

  })();
  return {
    getLinkAutorization: function() {
      var url;
      console.log(vk);
      url = vk.auth + '?client_id=' + vk.clientId + '&scope=friends,offline,photos,wall&redirect_uri=' + vk.redirectUri + '&display=page&response_type=token';
      return url;
    },
    _getLinkFriends: function(params, userId) {
      var id, url;
      if (userId == null) {
        userId = null;
      }
      if (userId !== null) {
        id = userId;
      } else {
        id = params.user_id;
      }
      console.log(id);
      url = vk.api + '/method/friends.get?user_id=' + id + '&v=5.8&access_token=' + params.access_token + '&order=name&fields=city,online,last_seen,has_mobile,photo_50&callback=JSON_CALLBACK';
      return url;
    },
    _getLinkUser: function(id, params) {
      var url;
      url = vk.api + '/method/users.get?user_id=' + id + '&access_token=' + params.access_token + '&v=5.8&fields=sex,bdate,city,country,photo_200_orig,photo_100,online,contacts,status,followers_count,relation,common_count,counters&callback=JSON_CALLBACK';
      return url;
    },
    _getLinkUserSimply: function(id, params) {
      var url;
      url = vk.api + '/method/users.get?user_id=' + id + '&access_token=' + params.access_token + '&v=5.8&callback=JSON_CALLBACK';
      return url;
    },
    _getLinkDeleteUser: function(id, params) {
      var url;
      url = vk.api + '/method/friends.delete?' + 'user_id=' + id + '&access_token=' + params.access_token + 'callback=JSON_CALLBACK';
      return url;
    },
    getParams: function(url) {
      var listParams, reg;
      listParams = {};
      reg;
      reg = url.replace(/[#&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        return listParams[key] = value;
      });
      return listParams;
    },
    getFriends: function(params, userId) {
      var deferred, url;
      if (userId == null) {
        userId = null;
      }
      deferred = $q.defer();
      url = this._getLinkFriends(params, userId);
      $http.jsonp(url).success(function(friends) {
        return deferred.resolve(friends);
      }).error(function(error) {
        deferred.reject(error);
        return console.log(error);
      });
      return deferred.promise;
    },
    _parseTime: function(time) {
      var currentTime, finishTime, monthArray, userTime;
      currentTime = {};
      userTime = {};
      finishTime = {};
      monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
      currentTime.day = parseFloat(moment().format('Do'));
      currentTime.month = parseFloat(moment().format('MM'));
      currentTime.year = moment().format('YYYY');
      currentTime.hours = moment().format('HH');
      currentTime.minute = moment().format('mm');
      userTime.day = parseFloat(moment.unix(time).format('Do'));
      userTime.month = parseFloat(moment.unix(time).format('MM'));
      userTime.year = moment.unix(time).format('YYYY');
      userTime.hours = moment.unix(time).format('HH');
      userTime.minute = moment.unix(time).format('mm');
      if (currentTime.year !== userTime.year) {
        finishTime.year = userTime.year;
      }
      if (currentTime.month !== userTime.month) {
        finishTime.month = monthArray[userTime.month - 1];
      } else {
        finishTime.currentMonth = monthArray[currentTime.month - 1];
      }
      if (currentTime.day !== userTime.day) {
        if ((parseFloat(currentTime.day) - parseFloat(userTime.day)) === 1) {
          finishTime.day = 'вчера';
        } else {
          finishTime.day = userTime.day;
        }
      }
      if (parseFloat(currentTime.hours) !== parseFloat(userTime.hours)) {
        if ((parseFloat(currentTime.hours) - parseFloat(userTime.hours) === 1) && !finishTime.day && !finishTime.month && !finishTime.year) {
          finishTime.hours = 'час назад';
        } else {
          finishTime.hours = userTime.hours;
        }
      }
      if (parseFloat(currentTime.minute) !== parseFloat(userTime.minute)) {
        finishTime.minute = userTime.minute;
      }
      return finishTime;
    },
    _getLastEntry: function(object) {
      var time;
      time = '';
      if (object.day === 'вчера') {
        time = 'вчера в ' + object.hours + '.' + object.minute;
      }
      if (object.hours === 'час назад' && !angular.isDefined(object.day) && !angular.isDefined(object.month)) {
        time = 'час назад';
      }
      if (object.minute && !angular.isDefined(object.hours) && !angular.isDefined(object.day)) {
        time = object.minute + ' минут назад';
      }
      if (object.minute && object.hours && object.hours !== 'час назад' && !angular.isDefined(object.day) && !angular.isDefined(object.month) && !angular.isDefined(object.year)) {
        time = 'сегодня в ' + object.hours + '.' + object.minute;
      }
      if (object.minute && object.hours && object.day && object.day !== 'вчера' && !angular.isDefined(object.year) && !angular.isDefined(object.month)) {
        time = object.day + ' ' + object.currentMonth + ' в ' + object.hours + '.' + object.minute;
      }
      if (object.minute && object.hours && object.day && object.day !== 'вчера' && object.month && !angular.isDefined(object.year)) {
        time = object.day + ' ' + object.month + ' в ' + object.hours + '.' + object.minute;
      }
      if (object.minute && object.hours && object.day && object.day !== 'вчера' && object.month && object.year) {
        time = object.day + ' ' + object.month + ' ' + object.year + ' года в ' + object.hours + '.' + object.minute;
      }
      if (time === '') {
        console.log(object);
      }
      return time;
    },
    _transformObject: function(object) {
      object.forEach((function(_this) {
        return function(user) {
          var lastTime, objectTime;
          if (angular.isDefined(user.last_seen) && user.online !== 1 && !angular.isDefined(user.deactivated)) {
            lastTime = user.last_seen.time;
            objectTime = _this._parseTime(lastTime);
            return user.last_seen = _this._getLastEntry(objectTime);
          } else if (user.online === 1) {
            return user.last_seen = 'online';
          } else if (user.deactivated === 'deleted' || (user.deactivated = "banned")) {
            return user.last_seen = 'удален';
          }
        };
      })(this));
      return object;
    },
    isWorkingFriendsObject: function(object) {
      var params, temp;
      params = {};
      temp = {};
      if (object.response.items) {
        temp = object.response.items;
        params = this._transformObject(temp);
      } else {
        params = object.response[0];
      }
      return params;
    },
    moreInfo: function(id, params) {
      var deffered, url, userId;
      deffered = $q.defer();
      userId = parseFloat(id);
      url = this._getLinkUser(userId, params);
      $http.jsonp(url).success(function(user) {
        return deffered.resolve(user);
      }).error(function(error) {
        deffered.reject(error);
        return console.log(error);
      });
      return deffered.promise;
    },
    getUserById: function(id, params) {
      var deffered, url, userId;
      deffered = $q.defer();
      userId = parseFloat(id);
      url = this._getLinkUserSimply(userId, params);
      $http.jsonp(url).success(function(user) {
        return deffered.resolve(user);
      }).error(function(error) {
        deffered.reject(error);
        return console.log(error);
      });
      return deffered.promise;
    },
    sendMessage: function(id, params) {
      var deffered, url;
      deffered = $q.defer();
      url = this._getLinkMessage(id, params);
      $http.jsonp(url).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    },
    deleteUser: function(id, params) {
      var deffered, url;
      deffered = $q.defer();
      url = this._getLinkDeleteUser(id, params);
      $http.jsonp(url).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    },
    getWallPost: function(userId, params, count) {
      var deffered, url;
      deffered = $q.defer();
      url = vk.api + '/method/wall.get?' + 'owner_id=' + userId + '&count=' + count + '&filter=owner&v=5.27&access_token=' + params.access_token + '&callback=JSON_CALLBACK';
      $http.jsonp(url).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    },
    getLikes: function(userId, params, postId, type) {
      var deffered, url;
      deffered = $q.defer();
      url = vk.api + '/method/likes.getList?' + 'owner_id=' + userId + '&item_id=' + postId + '&type=' + type + '&filter=likes&friend_only=0&count=1000&v=5.27&access_token=' + params.access_token + '&callback=JSON_CALLBACK';
      $http.jsonp(url).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    },
    friendsOnlineOrDelete: function(type, friends) {
      var friendsArray;
      friendsArray = [];
      if (type === 'online') {
        friends.forEach(function(friend) {
          if (friend.online === 1) {
            return friendsArray.push(friend);
          }
        });
      }
      if (type === 'delete') {
        friends.forEach(function(friend) {
          if (angular.isDefined(friend.deactivated)) {
            return friendsArray.push(friend);
          }
        });
      }
      return friendsArray;
    },
    getPhoto: function(userId, params, count, type) {
      var deffered, url;
      deffered = $q.defer();
      if (type === "all") {
        url = vk.api + '/method/photos.getAll?' + 'owner_id=' + userId + '&count=' + count + '&no_service_albums=1&v=5.27&access_token=' + params.access_token + '&callback=JSON_CALLBACK';
      } else {
        url = vk.api + '/method/photos.get?' + 'owner_id=' + userId + '&album_id=' + type + '&rev=1&count=' + count + '&v=5.27&access_token=' + params.access_token + '&callback=JSON_CALLBACK';
      }
      $http.jsonp(url).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    },
    getComment: function(userId, post, params) {
      var deffered, url;
      deffered = $q.defer();
      url = vk.api + '/method/wall.getComments?' + 'owner_id=' + userId + '&post_id=' + post.id + '&extended=1&count=100&need_likes=1&v=5.28&access_token=' + params.access_token + '&callback=JSON_CALLBACK';
      $http.jsonp(url).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    },
    getWish: function(content) {
      var deffered;
      deffered = $q.defer();
      $http.post('mail.php', {
        fio: content.fio,
        email: content.email,
        wish: content.wish
      }).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    },
    getLikesExecute: function(userId, photos, params) {
      var code, count, deffered, i, url, _i, _ref;
      deffered = $q.defer();
      count = 0;
      code = 'return {';
      for (i = _i = 0, _ref = photos.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (i !== photos.length - 1) {
          code = code + 'listLikes_' + photos[i].id + '_' + i + ':API.likes.getList({"type":"photo", "owner_id":' + photos[i].owner_id + ',"item_id":' + photos[i].id + ',"friends_only":0, "count":1000}),';
        } else {
          code = code + 'listLikes_' + photos[i].id + '_' + i + ':API.likes.getList({"type":"photo", "owner_id":' + photos[i].owner_id + ',"item_id":' + photos[i].id + ',"friends_only":0, "count":1000})';
        }
      }
      code = code + '};';
      url = vk.api + '/method/execute?code=' + code + '&access_token=' + params.access_token + '&callback=JSON_CALLBACK';
      $http.jsonp(url).success(function(data) {
        return deffered.resolve(data);
      }).error(function(error) {
        return deffered.reject(error);
      });
      return deffered.promise;
    }
  };
});

//# sourceMappingURL=RestModelService.map
