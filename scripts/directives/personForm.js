"use strict";
angular.module("app").directive("personForm",[function(){
    return{
        restrict :"E",
        templateUrl :"/views/form.html",
        controller:"appCtrl"
    }
}])