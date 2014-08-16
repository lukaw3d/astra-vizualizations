'use strict';

function Ctrl($scope) {
  $scope.w = 5;
  $scope.tw = 0.015*$scope.w; //tick width
  $scope.tx = 0.08*$scope.w; //text size
  $scope._ = _;
  $scope.M = Math;

  var svg = document.getElementById('imSvg');
  var pt = svg.createSVGPoint();
  var roundM = 4;

  $scope.dataPt = {x: 1, y: 1};
  $scope.position = function (ev) {
    pt.x = ev.x;
    pt.y = ev.y;
    $scope.dataPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    $scope.dataPt.y *= -1;

    $scope.dataPt.x = Math.round($scope.dataPt.x*roundM)/roundM;
    $scope.dataPt.y = Math.round($scope.dataPt.y*roundM)/roundM;
    $scope.dataPt.x = Math.min(Math.max($scope.dataPt.x, -$scope.w), $scope.w);
    $scope.dataPt.y = Math.min(Math.max($scope.dataPt.y, -$scope.w), $scope.w);
  };
  $scope.ptText = function (pt) {
    return (pt.x >= 0 ? '' : '− ') + Math.abs(pt.x) + 
      (pt.y >= 0 ? ' + ' : ' − ') + Math.abs(pt.y);
  };

  $scope.log = [];
  $scope.logPos = function () {
    $scope.log.push($scope.dataPt);
  };
  $scope.loadPos = function (pt) {
    $scope.dataPt = pt;
  };
}
