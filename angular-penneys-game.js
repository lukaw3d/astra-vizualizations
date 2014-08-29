'use strict';

function Ctrl($scope) {
  $scope.player1 = [{v: true}, {v: true}, {v: true}];
  $scope.player2 = [{v: false}, {v: true}, {v: true}];

  $scope.doesLastMatch = function (player, seq) {
    return _.isEqual(_.last(seq, 3), player);
  };

  $scope.numGen = 100;
  $scope.regenerate = function () {
    var player1 = _.map($scope.player1, 'v');
    var player2 = _.map($scope.player2, 'v');

    $scope.generated = _.map(_.range($scope.numGen), function () {
      var seq = [_.random(0,1) ? true : false, _.random(0,1) ? true : false, _.random(0,1) ? true : false];
      var p1 = $scope.doesLastMatch(player1, seq);
      var p2 = $scope.doesLastMatch(player2, seq);
      while (!p1 && !p2) {
        seq.push(_.random(0,1) ? true : false);
        p1 = $scope.doesLastMatch(player1, seq);
        p2 = $scope.doesLastMatch(player2, seq);
      }
      return {
        seq: seq,
        p1: p1,
        p2: p2
      };
    });

    $scope.stats = {
      rows: $scope.generated.length,
      p1: _.filter($scope.generated, 'p1').length,
      p2: _.filter($scope.generated, 'p2').length,
      diceOnes: _.reduce($scope.generated, function (s, r) { return s + _.filter(r.seq, _.identity).length; }, 0),
      dices: _.reduce($scope.generated, function (s, r) { return s + r.seq.length; }, 0)
    };
  };
}
