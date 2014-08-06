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
  $scope.primes = generatePrimes(500000);
  $scope._ = _;

  $scope.num = 105000;
  $scope.$watch('num', function primeFactors(n) {
    function isFactor(prime) {
      return n%prime === 0;
    }
    $scope.tries = [];
    $scope.factoring = [];
    while (n > 1) {
      var factor = _.find($scope.primes, isFactor);
      var prevN = n;
      n = n / factor;
      $scope.factoring.push({
        prevN: prevN,
        factor: factor,
        remaining: n
      });
    }
  });
  $scope.$watchCollection('factoring', function (factoring) {
    $scope.exponentFactors = _.countBy(factoring, 'factor');
  });

  $scope.primeClass = function (sc) {
    if ((sc.findex>0) && sc.factoring[sc.findex-1].factor > sc.p) return 'label label-default';
    if (sc.p < sc.f.factor) return 'label label-danger';
    if (sc.p == sc.f.factor) return 'label label-info';
  };

  $scope.Math = Math;
  $scope.getFraction = function (n) {
    if (Math.floor(n) == n) return '';
    var fraction = n - Math.floor(n);
    return fraction.toFixed(2).slice(2);
  };

  $scope.hideSolutions = false;
  $scope.doTry = function (tryN, f) {
    var newRemaining = f.remaining / tryN;
    if (Math.floor(newRemaining) != newRemaining) newRemaining = f.remaining;

    $scope.tries.push({
      factor: tryN,
      prevN: f.remaining,
      remaining: newRemaining
    });
    $scope.tryN = '';
  };
}
