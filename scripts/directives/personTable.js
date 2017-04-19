"use strict";
angular.module("app").directive("personTable",[function(){
    return{
        restrict :"E",
        templateUrl :"/views/table.html",
        controller:"appCtrl"
    }
}])