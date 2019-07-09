(function () {
   'use strict'

   var app = angular.module('myApp', []);
   app.controller('myController', myController);
   app.service('GetLevelService', GetLevelService);

   myController.$inject = ['$interval', 'GetLevelService'];
   function myController($interval, GetLevelService) {
      var ctrl = this;

      // init variables
      ctrl.changeInProgress = false;
      ctrl.level = {};
      ctrl.level.code = "";
      ctrl.level.author = "";
      ctrl.level.name = "";

      $interval(checkIfLevelChange, 3000);

      // FileWatch function call on every interval
      function checkIfLevelChange() {
         GetLevelService.getLevel().then(function (result) {
            if (ctrl.changeInProgress) {
               // load in new level
               Object.assign(ctrl.level, result.data.level);
               ctrl.changeInProgress = false;
            }
            if (ctrl.level.code !== result.data.level.code || ctrl.level.name !== result.data.level.name ||
            ctrl.level.author !== result.data.level.author) {
               // alert the view that a change is in progress
               ctrl.changeInProgress = true;
            }
         });
      }

      ctrl.levelCodeAvailable = function() {
         if (ctrl.level.code) return true;
      }
   }

   GetLevelService.$inject = ['$http'];
   function GetLevelService($http) {
      var service = this;
      service.getLevel = function () {
         return $http({
            url: "data/ocrLevel.json"
         });
      }
   }
})();