angular.module('ninzazAngular.services', [])

.factory('leadGenerator', function($http,$q) {
    
    var service = {};
    service.leadCreator = function(senddata) {
    	//console.log("Into Service File", JSON.stringify(senddata));
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
			headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: senddata
        })
            
    },
    service.updateData = function(data) {
        data.func = 'updateData';
        //console.log("Into Service File", JSON.stringify(data));
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: data
        })    
    },
    service.updateSalesCallerData = function(data) {
        data.func = 'updateSalesCallerData';
        //console.log("Into Service File", JSON.stringify(data));
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: data
        })    
    }
    return service;
})
.factory('getPrefilledLeads', function($http,$q){
    var service = {};
    service.getLeads = function(req) {
        //console.log("Into Get Leads File", JSON.stringify(req));
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: req
        })
            
    }
    return service;
})
.factory('getLeadsByID', function($http,$q){
    var service = {};
    service.getLeadsUsingID = function(req) {
        //console.log("Into Get Leads File", JSON.stringify(req));
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: req
        })
            
    }
    return service;
})
.factory('updateLeadsByID', function($http,$q){
    var service = {};
    service.updateLeadsUsingID = function(req) {
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: req
        })
            
    }
    return service;
})
.factory('AgentSignUpFactory', function($http,$q){
    var service = {};
    service.AgentSignUpService = function(req) {
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: req
        })
            
    },
    service.AgentLoginService = function(req) {
        req.func = 'AgentLogin';
        //console.log("Into Service File", JSON.stringify(req));
        return $http({
            method: 'POST',
            url: "http://syproatek.org/LeadTracker/backend.php",
            //url: "http://localhost/LeadTracker_Syproatek/backend.php",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, // set the headers so angular passing info as form data (not request payload)
            data: req
        })    
    }
    return service;
});