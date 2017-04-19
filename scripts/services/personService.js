"use strict";
angular.module("app").service("personService",["$http",function($http){
    this.getPersonList = function(){
        return $http({
            method:"GET",
            url:"/service/person"
        }).then(function(result){
            return result.data
        });
    };
    
    this.postPerson = function(dataParam){
        return $http({
            method:"POST",
            url:"/service/person",
            data:dataParam
        }).then(function(result){
            return result.status;
        });
    };
    
}]);