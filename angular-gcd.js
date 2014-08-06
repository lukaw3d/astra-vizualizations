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

  // $scope.nums = [{n: 27}, {n: 36}, {n: 45}];
  $scope.nums = [{n: 3*3*3*3 * 2*2}, {n: 3*3*3*3 * 2}, {n: 3*3*3 * 2*2}, {}, {}, {}];

  function primeFactors(n) {
    function isFactor(prime) {
      return n%prime === 0;
    }

    var factors = [];
    while (n > 1) {
      var factor = _.find($scope.primes, isFactor);
      n = n / factor;
      factors.push({factor: factor, gcd: false});
    }
    return factors;
  }
  function calcGCDab(a, b) {
    if (!b) return a;
    return calcGCDab(b, a%b);
  }
  function calcGCD(arr) {
    return _.reduce(_.compact(arr), calcGCDab);
  }
  function calcLCMab(a, b) {
    return a*b / calcGCDab(a,b);
  }
  function calcLCM(arr) {
    return _.reduce(_.compact(arr), calcLCMab);
  }

  $scope.$watchCollection(function () {
    return _.map($scope.nums, function (num){ return num.n + num.focus; });
  }, function () {
    $scope.nums = _.filter($scope.nums, function (num) {
      return num.n || num.focus;
    });
    _.each($scope.nums, function (num) {
      num.factors = primeFactors(num.n);
      num.expFactors = _.mapValues(_.countBy(num.factors, 'factor'), function (exp) {
        return {exp: exp, gcd: false, lcm: false};
      });
    });
    var goodnums = _.filter($scope.nums, 'n');
    var allFactors = _.map(goodnums, 'expFactors');

    // gcd factors
    var gcdFactorsOnly = _.intersection.apply(_, _.map(allFactors, _.keys));
    $scope.gcdExpFactors = _.mapValues(_.indexBy(gcdFactorsOnly), function (f) {
      return _.min(_.map(_.map(allFactors, f), 'exp'));
    });
    if (_.isEmpty($scope.gcdExpFactors)) $scope.gcdExpFactors = {1: 1};
    $scope.gcdFactors = _.flatten(_.map($scope.gcdExpFactors, function (exp, factor) {
      return _.map(_.range(exp), function () { return factor; });
    }));
    $scope.gcd = _.reduce($scope.gcdFactors, function (acc, f) { return acc*f; }, 1);
    $scope.error = calcGCD(_.map(goodnums, 'n')) != $scope.gcd;

    var expGCD = angular.copy($scope.gcdExpFactors);
    _.each(goodnums, function (num) {
      expGCD = angular.copy($scope.gcdExpFactors);
      _.each(num.factors, function (f) {
        f.gcd = expGCD[f.factor] > 0;
        expGCD[f.factor]--;
      });
    });

    expGCD = angular.copy($scope.gcdExpFactors);
    _.eachRight(goodnums, function (num) {
      _.each(num.expFactors, function (e, f) {
        if (expGCD[f] && expGCD[f] == e.exp) {
          e.gcd = true;
          delete expGCD[f];
        }
      });
    });

    // lcm factors
    var lcmFactorsOnly = _.union.apply(_, _.map(allFactors, _.keys));
    $scope.lcmExpFactors = _.mapValues(_.indexBy(lcmFactorsOnly), function (f) {
      return _.max(_.map(_.compact(_.map(allFactors, f)), 'exp'));
    });
    $scope.lcmFactors = _.flatten(_.map($scope.lcmExpFactors, function (exp, factor) {
      return _.map(_.range(exp), function () { return factor; });
    }));
    $scope.lcm = _.reduce($scope.lcmFactors, function (acc, f) { return acc*f; }, 1);
    $scope.error = calcLCM(_.map(goodnums, 'n')) != $scope.lcm;

    var expLCMfloatingMax = _.mapValues($scope.lcmExpFactors, function () { return 0; });
    _.each(goodnums, function (num) {
      var addableExp = _.mapValues(num.expFactors, function (e, f) {
        var ret = e.exp - expLCMfloatingMax[f];
        if (ret > 0) expLCMfloatingMax[f] = e.exp;
        return ret;
      });
      _.eachRight(num.factors, function (f) {
        f.lcm = addableExp[f.factor] > 0;
        addableExp[f.factor]--;
      });
    });

    var expLCM = angular.copy($scope.lcmExpFactors);
    _.eachRight(goodnums, function (num) {
      _.each(num.expFactors, function (e, f) {
        if (expLCM[f] && expLCM[f] == e.exp) {
          e.lcm = true;
          delete expLCM[f];
        }
      });
    });

  });

}
