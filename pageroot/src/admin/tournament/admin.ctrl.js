'use strict';

angular.module('kibAdmin').controller('AdminTournament', function($stateParams, $scope, tournamentInstance, tournamentService){
	tournamentInstance.init($stateParams.tournamentId).then(function(){
		$scope.rounds = tournamentInstance.rounds;
	}, function(){
		//Handle load error
	});
	
	$scope.saveScore = function(matchup){
        tournamentInstance.reportScore(matchup.id, matchup.player1Score, matchup.player2Score).then(function(){
           alert('Saved'); 
        }, function(data){
          alert('Error: ' + data.message);
        });
    }
    
	$scope.createNewMatch = function(){
        if(!$scope.allMatchesReported())
            return;
        
        tournamentInstance.generateNextRound().then(function(rounds){
            $scope.rounds = rounds;
        }, function(){
            alert('Error ocurred when generating matchups');
        });
	}
	
	$scope.allMatchesReported = function(){
        if(!$scope.rounds || $scope.rounds.length == 0)
            return true;
        
        var isReported = true;
        var currentRound = $scope.rounds[$scope.rounds.length - 1];
        currentRound.matchups.forEach(function(matchup){
            if(!isReported)
                return;
            
           if(matchup.player1Score == undefined || matchup.player2Score == undefined || (matchup.player1Score == 0 && matchup.player2Score == 0)){
               isReported = false;
           } 
        });
        
		return isReported;	
	};
    
    $scope.makePublic = function(round){
      tournamentService.makeRoundPublic($stateParams.tournamentId, round.id).then(function(){
          round.public = true;
      }, function(){
          alert('Error when setting round public');
      });
    };
});