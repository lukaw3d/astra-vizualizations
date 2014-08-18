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
}
