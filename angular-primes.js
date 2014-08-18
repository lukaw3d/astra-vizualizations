'use strict';

function Ctrl($scope) {
  function generatePrimes(max) {
    // Eratosthenes algorithm to find all primes under max
    var array = _.range(max);

    for (var i = 2; i <= Math.sqrt(max); i++) {
      if (array[i]) {
        for (var j = i*i; j < max; j += i) {
          array[j] = false;
        }
      }
    }

    return _.compact(_.tail(array, 2));
  }
  $scope.primes = generatePrimes(100);
  $scope._ = _;
  $scope.M = Math;

  $scope.primeDict = _.indexBy($scope.primes);

  $scope.numClassSingle = function (n, val) {
    if (n == val) return 'label label-primary';

    if (n % val === 0) return 'label label-default';

    return 'label label-empty';
  };

  $scope.numClassAll = function (n, val) {
    if (n == 1) return 'label label-default';
    if (n <= val && $scope.primeDict[n]) return 'label label-primary';
    if (n == val) return 'label label-danger';

    var covered = _.find(_.range(2, val+1), function (v) {
      return n % v === 0;
    });
    if (covered) return 'label label-default';

    return 'label label-empty';
  };

  $scope.numClassPrev = function (n, val) {
    if (n == 1) return 'label label-default';
    if (n < val && $scope.primeDict[n]) return 'label label-primary';

    var covered = _.find(_.range(2, val), function (v) {
      return n % v === 0;
    });
    if (covered) return 'label label-default';

    return 'label label-empty';
  };


  var questionPrimes = _.difference(generatePrimes(400), $scope.primes);
  var qustionPrimeDict = _.indexBy(questionPrimes);
  function generateQuestionPrime() {
    if (Math.random() < 0.75) {
      var r = _.random(101, 400);
      return r + (r%2 === 0);
    } else {
      return _.sample(questionPrimes, 1)[0];
    }
  }
  $scope.questionPrime = generateQuestionPrime();
  $scope.log = [];
  $scope.logStats = {last: 0, acc: 0.5};
  $scope.doLog = function (ans) {
    $scope.log.unshift({
      num: $scope.questionPrime,
      ans: ans,
      truth: !!qustionPrimeDict[$scope.questionPrime]
    });
    $scope.questionPrime = generateQuestionPrime();

    var statLog = _.head($scope.log, 20);
    $scope.logStats = {
      last: statLog.length,
      lastAcc: _.reduce(statLog, function (correct, l) {
        return correct + (l.ans == l.truth);
      }, 0) / statLog.length,
      allAcc: _.reduce($scope.log, function (correct, l) {
        return correct + (l.ans == l.truth);
      }, 0) / $scope.log.length
    };
  };
  $scope.questionClass = function (l, t) {
    if (l.ans != t) return 'btn-default';
    if (l.ans == l.truth) return 'btn-primary';
    if (l.ans != l.truth) return 'btn-danger';
  };
}
