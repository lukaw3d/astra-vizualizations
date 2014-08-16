'use strict';

function Ctrl($scope) {
  $scope.w = 1.2;
  $scope.dw = 1;
  $scope.tw = 0.015*$scope.w; //tick width
  $scope.tx = 0.08*$scope.w; //text size
  $scope._ = _;
  $scope.M = Math;

  var svg = document.getElementById('imSvg');
  var pt = svg.createSVGPoint();
  var roundAngleM = 1;

  $scope.dataPt = transformPt({x: 1, y: 0});
  $scope.position = function (ev) {
    pt.x = ev.x;
    pt.y = ev.y;
    $scope.dataPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    $scope.dataPt.y *= -1;
    $scope.dataPt = transformPt($scope.dataPt);
  };
  function mathMod(a, b) {
    return (a%b + b) % b;
  }
  function transformPt(pt) {
    var dist = Math.sqrt(pt.x*pt.x + pt.y*pt.y);
    if (dist <= 0) {
      pt.x = 1;
      pt.y = 0;
    } else {
      pt.x /= dist;
      pt.y /= dist;
    }

    pt.a = mathMod(Math.atan2(pt.y, pt.x)*180/Math.PI, 360);

    pt.a = Math.round(pt.a*roundAngleM)/roundAngleM;
    pt.x = Math.cos(pt.a/180*Math.PI);
    pt.y = Math.sin(pt.a/180*Math.PI);

    return pt;
  }
  $scope.ptText = function (pt) {
    return 'α = ' + pt.a +
      ', cos(α) = ' + pt.x.toFixed(3) +
      ', sin(α) = ' + pt.y.toFixed(3);
  };

  $scope.log = [];
  $scope.logPos = function () {
    $scope.log.push($scope.dataPt);
  };
  $scope.loadPos = function (pt) {
    $scope.dataPt = pt;
  };

  var exactSinCos = {
    0: {x: '1', y: '0'},
    30: {x: '√3/2', y: '1/2'},
    45: {x: '√2/2', y: '√2/2'},
    60: {x: '1/2', y: '√3/2'},
    90: {x: '0', y: '1'}
  };
  var exactAngle = {
    0: '0',
    180: 'π',
    90: 'π/2',
    270: '3π/2',
    360: '2π',

    30: 'π/6',
    45: 'π/4',
    60: 'π/3',

    120: '2π/3',
    135: '3π/4',
    150: '5π/6',

    210: '7π/6',
    225: '5π/4',
    240: '4π/3',

    300: '5π/3',
    315: '7π/4',
    330: '11π/6'
  };
  $scope.getExact = _.memoize(function (angle) {
    var exact = angular.copy(exactSinCos);
    var ex;
    if (angle <= 90) {
      ex = exact[angle];
      if (!ex) return;
      ex.a = exactAngle[angle];
      return ex;
    }
    if (angle <= 180) {
      ex = exact[180 - angle];
      if (!ex) return;
      ex.x = '−' + ex.x;
      ex.a = exactAngle[angle];
      return ex;
    }
    if (angle <= 270) {
      ex = exact[angle - 180];
      if (!ex) return;
      ex.x = '−' + ex.x;
      ex.y = '−' + ex.y;
      ex.a = exactAngle[angle];
      return ex;
    }
    if (angle <= 360) {
      ex = exact[360 - angle];
      if (!ex) return;
      ex.y = '−' + ex.y;
      ex.a = exactAngle[angle];
      return ex;
    }
  });
}
