app

  .factory('LeagueInvite', function($http){

    var markRead = function(inviteId, data){
      return $http({
        method: 'PUT',
        url: '/api/leagueinvites/invite/'+inviteId,
        data: data
      })
      .then(function(data){
        return data;
      });
    };

    var getInvitesByUserId = function(userId){
      return $http({
        method: 'GET',
        url: '/api/leagueinvites/'+userId
      })
      .then(function(data){
        return data.data[0];
      });
    };

    var sendInvite = function(senderId, receiverId, data){
      return $http({
        method: 'POST',
        url: '/api/leagueinvites/'+senderId+'/'+receiverId,
        data: data
      })
      .then(function(data){
        return data;
      });
    };

    return {
      getInvitesByUserId: getInvitesByUserId,
      markRead: markRead,
      sendInvite: sendInvite
    };

  })