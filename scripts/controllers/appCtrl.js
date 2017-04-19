"use strict";
angular.module("app").controller("appCtrl",["$scope","personService",function($scope,ps){
    $scope.personModel = {
        "firstname":"",
        "lastname":"",
        "email":"",
        "active":1
    };

    $scope.personList = [];
    updateTable();

    

    
    $scope.formSubmit = function(){
        
        event.preventDefault();
        ps.postPerson(angular.copy($scope.personModel)).then(function(){
            updateTable();
        });
    }

    //grabing value from the form and setting on scope variable for table
    function updateTable(){
        //Creating promise for the get method
        var personPromise = ps.getPersonList();
        personPromise.then(function(result){
            $scope.personList = result;
        });
    }
    
}]);