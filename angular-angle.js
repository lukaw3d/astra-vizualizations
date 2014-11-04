'use strict';

function Ctrl($scope) {
  $scope.w = 1.2;
  $scope.dw = 1;
  $scope.tw = 0.015*$scope.w; //tick width
  $scope.tx = 0.08*$scope.w; //text size
  $scope._ = _;
  $scope.M = Math;

  var svg = document.getElementById('imSvg');
  var dot = document.getElementById('dot');
  var normalizedDot = document.getElementById('normalizedDot');
  var pt = svg.createSVGPoint();
  var roundAngleM = 1;

  $scope.lastAngle = transformPt({x: -1, y: 0}).a;
  $scope.lastPos = {x: 0, y: -2};
  $scope.rotating = false;
  $scope.positioning = false;
  function evToDataPt(svgPivot, ev) {
    pt.x = ev.pageX;
    pt.y = ev.pageY - window.scrollY;
    var dataPt = pt.matrixTransform(svgPivot.getScreenCTM().inverse());
    dataPt.y *= -1;
    return dataPt;
  }
  $scope.move = function (ev) {
    if ($scope.positioning) $scope.lastPos = evToDataPt(normalizedDot, ev);
    if ($scope.rotating) $scope.lastAngle = transformPt(evToDataPt(dot, ev)).a;
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

  $scope.regenAngle = function () {
    $scope.anglePos = {
      x: _.random(-1.85+$scope.w*1.1, 3.85-1.85-$scope.w*1.1, true),
      y: _.random(-1.2+$scope.w*1.1, 3.85-1.2-$scope.w*1.1, true),
      a: Math.floor(_.random(5, 180)/5)*5,
      pivotA: _.random(0, 360),
      input: 0
    };
  };
  $scope.correct = function (obj) {
    return obj.input == obj.a;
  };
  $scope.regenAngle();

  $scope.log = [];
  $scope.savePos = function (dontLoad) {
    var prevLoaded = $scope.anglePos.saved;

    $scope.anglePos.saved = true;
    $scope.log.push({
      anglePos: $scope.anglePos,
      lastPos: $scope.lastPos,
      lastAngle: $scope.lastAngle
    });

    if (prevLoaded && $scope.correct($scope.anglePos) && !dontLoad) {
      var ix = _.findIndex($scope.log, function (item) {
        return !$scope.correct(item.anglePos);
      });
      if (ix >= 0) $scope.loadPos($scope.log[ix], ix, true);
      else $scope.regenAngle();
    } else {
      $scope.regenAngle();
    }
  };
  $scope.loadPos = function (pos, ix, dontLog) {
    $scope.log.splice(ix, 1);
    if (!dontLog) $scope.savePos(true);
    $scope.anglePos = pos.anglePos;
    $scope.lastPos = pos.lastPos;
    $scope.lastAngle = pos.lastAngle;
  };

}
