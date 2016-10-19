angular.module('ninzazAngular.controllers', ['ui.router','ngDialog'])

.controller('HomeCtrl', function($scope,$rootScope,leadGenerator,ngDialog,getPrefilledLeads,$window,$state,$filter) {
    var t = $filter('date');
	var getLeadsData = new Object();

    $scope.signMeOut = function(){
        sessionStorage.clear();
        sessionStorage.setItem("userLoggedIn",false);
        $state.go('login');
    }

    $scope.showNotification = function(type,id,trRowData){
        //console.log(id+'  '+type+'  '+JSON.stringify(trRowData));
        $scope.currentMode = {};
        $scope.currentMode = {
            type: type,
            id:id,
            currentView:'View_one'
        };
        if(trRowData != null){
            $scope.currentMode.data = {};
            angular.copy(trRowData,$scope.currentMode.data);
        }
        $scope.displayPopUp = ngDialog.open({ 
            template: 'pages/editDialogPage.html', 
            className: 'ngdialog-theme-default common-ngdilaog-class' ,
            scope:$scope,
            closeByDocument:false
        });
    }

    $scope.closeNotifyDialog = function(){
        ngDialog.close();
    }

    $scope.updateLeadData = function(){
        //console.log($scope.currentMode.data);
        if($scope.currentMode.data.st_id != null){
            //call updated
            leadGenerator.updateData($scope.currentMode.data).success(function(response) {
                console.log(response);
                $scope.commonAlertBox(response.message);
            },function(err){
                console.log(err);
            });
        }
    };


    $scope.commonAlertBox = function (message) {
        $scope.messageToBeDisplayed = message;
        $scope.closeThisPopup = ngDialog.open({
            template: 'pages/submission_alertPage.html',
            className: 'ngdialog-theme-default pictures-warning-notification-popup',
            scope: $scope,
            closeByDocument: false
        });
        $scope.closeDialogAlert = function(x) {
            ngDialog.close();
            $window.location.href = '/LeadTracker';
            //$window.location.href = '/LeadTracker_Syproatek';
            $state.go('home');
        };
    }

    $scope.addDetails = function(data){
        $rootScope.showLoader = true;
        data.st_createdby = $scope.loggedInUser;
        data.st_timeofentry = $scope.currentDate;
		data.func = 'leadGenerate';
        //console.log("pppp");
        
        var g = angular.copy(data.st_new_callerdate);
        data.st_callerdate = t(g, 'yyyy-MM-dd');
        delete data['st_new_callerdate'];
        //console.log(data.st_callerdate);        
		
        leadGenerator.leadCreator(data).success(function(response) {
            //console.log(response);
            $rootScope.showLoader = false;
            if(response.status == 'success'){
                $scope.commonAlertBox(response.message);
            } else {
            	alert("Insertion not happened");
            }
        }).error(function(e) {
        	console.log(e);
        });
	}

	function getData(){
		var d = new Date();
		var m = d.getMonth()+1;
		var date = d.getFullYear()+'-'+m+'-'+d.getDate();
		
        $scope.currentDate = date;

		getLeadsData.st_callerdate = date;
		getLeadsData.func = 'getLastUpdatedLeads';
        
		getPrefilledLeads.getLeads(getLeadsData).success(function(res) {
            $rootScope.showLoader = false;
            console.log(JSON.stringify(res));
            var table = $('#leadDataTable').DataTable({
                "paging": true,
                "ordering": true,
                "info": false,
                "data": res,
                "columns": [{
                    "data": "st_id"
                },{
                    "data": "st_source"
                },{
                    "data": "st_company"
                },{
                    "data": "st_contactperson"
                },{
                    "data": "st_mobile"
                },{
                    "data": "st_serviceCategory"
                },{
                    "data": "st_sector"
                },{
                    "data": "st_city"
                },{
                    "data": "st_requirement"
                },{
                    "data": "st_createdby"
                },{
                    "data": "st_status"
                },{
                    "data": "st_callerdate"
                },{
                    "data": "st_nextAction"
                },{
                    "data": "st_leadStatus"
                },{
                    "data": "st_exClosureDate"
                },{
                    "data": "st_businessDetails"
                },{
                    "data": null,
                    "render":function(data,type,full){
                        return "<a ui-sref='#'><button class = 'btn btn-success faButtonEdit' id ='faEid_"+full.st_id+"'> Edit </button></a>"
                    }
                }],
                columnDefs: [{ type: 'natural', targets: 0 }]
            });
                $("table#leadDataTable tbody").on('click','button.faButtonEdit',function(e){
                    var trRowData = table.row( $(this).parents('tr') ).data();
                    $scope.showNotification('Edit',this.id.substring(6),trRowData);
                });
            //console.log($scope.loadData);
        }).error(function(e) {
        	console.log(e);
        });
	}

	$scope.init = function(){
        $rootScope.showLoader = true;
        if(sessionStorage.getItem("userLoggedIn") != 'true')
            $state.go('login');

        var x = sessionStorage.getItem("leadAgent");
        //console.log(x);
        $scope.loggedInUser = sessionStorage.getItem('UserName');
        var x = sessionStorage.getItem("leadAgent");
        $scope.leadAgentLoggedIN = x != null ? true : false;
        //console.log($scope.leadAgentLoggedIN);
		getData();
	}
	$scope.init();
})
.controller('leadDetailsCtrl', function($scope,getLeadsByID,ngDialog,updateLeadsByID,$state,$stateParams,$filter) {
    var t = $filter('date');

    //console.log($stateParams);
    $scope.formData ={};
    $scope.commonAlertBox = function (message) {
        $scope.messageToBeDisplayed = message;
        $scope.closeThisPopup = ngDialog.open({
            template: 'pages/submission_alertPage.html',
            className: 'ngdialog-theme-default pictures-warning-notification-popup',
            scope: $scope,
            closeByDocument: false
        });
        $scope.closeDialogAlert = function(x) {
            ngDialog.close();
        };
    }

    $scope.currentValue=$stateParams.id;
    var getDataByIDCall = new Object();
    getDataByIDCall.st_id = $scope.currentValue;
    getDataByIDCall.func = 'getDataByID';
    

    $scope.LableNames = [
        {   name:"Source of reference", value:"st_source" },
        {   name:"Prospect Org's name", value:"st_company" },
        {   name:"Prospect Org's Contact Person", value:"st_contactperson" },
        {   name:"Prospect Org's Contact Email", value:"st_email" },
        {   name:"Prospect Mobile Number", value:"st_mobile" },
        {   name:"Prospect Other Mobile Number", value:"st_mobile2" },
        {   name:"Prospect Landline Number", value:"st_landline" },
        {   name:"Prospect Org's Address", value:"st_address" },
        {   name:"Prospect Org's Website", value:"st_website" },
        {   name:"Data Created By", value:"st_createdby" },
        {   name:"Sector", value:"st_sector" },
        {   name:"Service Category", value:"st_serviceCategory" },
        {   name:"Standard's Reference", value:"st_requirement" },
        {   name:"Caller Date", value:"st_callerdate" },
        {   name:"Business Details", value:"st_businessDetails" },
    ];
    getLeadsByID.getLeadsUsingID(getDataByIDCall).success(function(response) {
        console.log(response);
        $scope.prefilledValues = response;
        $scope.formData.st_serviceCategory = response.st_serviceCategory;
        $scope.formData.st_requirement = response.st_requirement;
    }).error(function(e) {
        console.log(e);
    });

    $scope.updateDetails = function(req){
        //console.log(req.st_new_nextActionDate+'  '+req.st_new_exClosureDate);
        var g = angular.copy(req.st_new_nextActionDate);
        req.st_nextActionDate = t(g, 'yyyy-MM-dd');

        var k = angular.copy(req.st_new_exClosureDate);
        req.st_exClosureDate = t(k, 'yyyy-MM-dd');
        delete req['st_new_nextActionDate'];
        delete req['st_new_exClosureDate'];

        req.func = 'updateLeadDetails';
        req.st_id = $scope.currentValue;
        console.log(req);

        updateLeadsByID.updateLeadsUsingID(req).success(function(response) {
            //console.log(response);
            $scope.commonAlertBox(response.message);
            $scope.formData = '';
                        
        }).error(function(e) {
            console.log(e);
        });
    }

    $scope.init = function(){
        if(sessionStorage.getItem("userLoggedIn") != 'true')
            $state.go('login');
        $scope.loggedInUser = sessionStorage.getItem('UserName');
        $scope.formData.st_salesExecutive = $scope.loggedInUser;
    }

    $scope.init();
})
.controller('SignUpCtrl', function($scope,$rootScope,AgentSignUpFactory,ngDialog,$window,$state) {
    console.log($rootScope.showLoader);
    $scope.commonAlertBox = function (message) {
        $scope.messageToBeDisplayed = message;
        $scope.closeThisPopup = ngDialog.open({
            template: 'pages/submission_alertPage.html',
            className: 'ngdialog-theme-default pictures-warning-notification-popup',
            scope: $scope,
            closeByDocument: false
        });
        $scope.closeDialogAlert = function(x) {
            ngDialog.close();
        };
    }


    $scope.signUpButton = function(data){
        $rootScope.showLoader = true;
        console.log(data); 
        if(data.st_reg_password === data.st_repeat_password) {
            data.func = 'AgentSignUp';
            AgentSignUpFactory.AgentSignUpService(data).success(function(response) {
                console.log(response);
                if(response.isavailable == 'true'){
                    $rootScope.showLoader = false;
                    $state.go('login');
                }
            }).error(function(e) {
                console.log(e);
            });
        } else {
            $scope.commonAlertBox("Pasword Not matching");
        }
    }

    $scope.agentLogin = function(req){
        $rootScope.showLoader = true;
        AgentSignUpFactory.AgentLoginService(req).success(function(response) {
            console.log(response);
            sessionStorage.setItem('UserName',response.UserName);
            if(response.isavailable == 'true'){
                $rootScope.showLoader = false;
                sessionStorage.setItem("userLoggedIn",true);
                if(response.USERROLE == 'leadAgent'){
                    sessionStorage.setItem("leadAgent",true);
                    $state.go('home');
                } else {
                    sessionStorage.setItem("leadAgent",false);
                    $state.go('salesCallerHome');
                }
            } else {
                $rootScope.showLoader = false;
                $scope.commonAlertBox(response.status);
            }

        }).error(function(e) {
            console.log(e);
        });
    }
})
.controller('SalesCallerHomeCtrl', function($scope,$rootScope,leadGenerator,ngDialog,getPrefilledLeads,$window,$state) {
    var getLeadsData = new Object();

    $scope.signMeOut = function(){
        sessionStorage.clear();
        sessionStorage.setItem("userLoggedIn",false);
        $state.go('login');
    }

    $scope.showNotification = function(type,id,trRowData){
        //console.log(id+'  '+type+'  '+JSON.stringify(trRowData));
        $scope.currentMode = {};
        $scope.currentMode = {
            type: type,
            id:id,
            currentView:'View_one'
        };
        if(trRowData != null){
            $scope.currentMode.data = {};
            angular.copy(trRowData,$scope.currentMode.data);
        }
        $scope.displayPopUp = ngDialog.open({ 
            template: 'pages/editDialogPage.html', 
            className: 'ngdialog-theme-default common-ngdilaog-class' ,
            scope:$scope,
            closeByDocument:false
        });
    }

    $scope.closeNotifyDialog = function(){
        ngDialog.close();
    }

    $scope.updateLeadData = function(){
        //console.log($scope.currentMode.data);
        if($scope.currentMode.data.st_id != null){
            //call updated
            leadGenerator.updateData($scope.currentMode.data).success(function(response) {
                console.log(response);
                $scope.commonAlertBox(response.message);
            },function(err){
                console.log(err);
            });
        }
    };


    $scope.commonAlertBox = function (message) {
        $scope.messageToBeDisplayed = message;
        $scope.closeThisPopup = ngDialog.open({
            template: 'pages/submission_alertPage.html',
            className: 'ngdialog-theme-default pictures-warning-notification-popup',
            scope: $scope,
            closeByDocument: false
        });
        $scope.closeDialogAlert = function(x) {
            ngDialog.close();
            $window.location.href = '/LeadTracker';
            //$window.location.href = '/LeadTracker_Syproatek';
            $state.go('home');
        };
    }

    function getData(){
        var d = new Date();
        var m = d.getMonth()+1;
        var date = d.getFullYear()+'-'+m+'-'+d.getDate();

        getLeadsData.loggedInUserName = sessionStorage.getItem('UserName');
        getLeadsData.st_callerdate = date;
        getLeadsData.func = 'getLeadByDate';
        
        getPrefilledLeads.getLeads(getLeadsData).success(function(res) {
            $rootScope.showLoader = false;
            console.log(res);
            var table = $('#leadDataTable').DataTable({
                "paging": true,
                "ordering": true,
                "info": false,
                "data": res,
                "columns": [{
                    "data": "st_id"
                },{
                    "data": "st_source"
                },{
                    "data": "st_company"
                },{
                    "data": "st_contactperson"
                },{
                    "data": "st_serviceCategory"
                },{
                    "data": "st_requirement"
                },{
                    "data": "st_createdby"
                },{
                    "data": "st_callerdate"
                },{
                    "data": "st_leadStatus"
                },{
                    "data": null,
                    "render":function(data,type,complete){
                        return "<a href='#/leadSummary/"+complete.st_id+"'><button class = 'btn btn-warning rqButton' id ='rq_id_"+complete.st_id+"'> Details </button></a>"
                    }
                },{
                    "data": null,
                    "render":function(data,type,complete){
                        return "<a href='#/leadDetails/"+complete.st_id+"' target='_blank'><button class = 'btn btn-primary rqButton' id ='rq_id_"+complete.st_id+"'> Convert </button></a>"
                    }
                },{
                    "data": null,
                    "render":function(data,type,full){
                        return "<a ui-sref='#'><button class = 'btn btn-success faButtonEdit' id ='faEid_"+full.st_id+"'> Edit </button></a>"
                    }
                }],
                columnDefs: [{ type: 'natural', targets: 0 }]
            });
            
            $("table#leadDataTable tbody").on('click','button.faButtonEdit',function(e){
                var trRowData = table.row( $(this).parents('tr') ).data();
                $scope.showNotification('Edit',this.id.substring(6),trRowData);
            });
            //console.log($scope.loadData);
        }).error(function(e) {
            console.log(e);
        });
    }

    $scope.init = function(){
        $rootScope.showLoader = true;
        if(sessionStorage.getItem("userLoggedIn") != 'true')
            $state.go('login');

        $scope.loggedInUser = sessionStorage.getItem('UserName');
        getData();
    }
    $scope.init();
})
.controller('leadSummaryViewCtrl', function($scope,getLeadsByID,leadGenerator,ngDialog,updateLeadsByID,$state,$stateParams,$window) {
    
    $scope.signMeOut = function(){
        sessionStorage.clear();
        sessionStorage.setItem("userLoggedIn",false);
        $state.go('login');
    }

    $scope.showNotification = function(type,id,trRowData){
        $scope.currentMode = {};
        $scope.currentMode = {
            type: type,
            id:id,
            currentView:'View_two'
        };
        if(trRowData == null){
            $scope.currentMode.data_Label = angular.copy($scope.SalesCallerLableNames);
            $scope.currentMode.data_value = angular.copy($scope.prefilledValues);
        }
        $scope.displayPopUp = ngDialog.open({ 
            template: 'pages/editDialogPage.html', 
            className: 'ngdialog-theme-default common-ngdilaog-class' ,
            scope:$scope,
            closeByDocument:false
        });
    }

    $scope.closeNotifyDialog = function(){
        ngDialog.close();
    }

    $scope.updateLeadData = function(){
        console.log($scope.currentMode.data_value);
        if($scope.currentMode.data_value.st_id != null){
            //call updated
            leadGenerator.updateSalesCallerData($scope.currentMode.data_value).success(function(response) {
                console.log(response);
                $scope.commonAlertBox(response.message);
            },function(err){
                console.log(err);
            });
        }
    };

    //console.log($stateParams);
    $scope.formData ={};
    $scope.commonAlertBox = function (message) {
        $scope.messageToBeDisplayed = message;
        $scope.closeThisPopup = ngDialog.open({
            template: 'pages/submission_alertPage.html',
            className: 'ngdialog-theme-default pictures-warning-notification-popup',
            scope: $scope,
            closeByDocument: false
        });
        $scope.closeDialogAlert = function(x) {
            ngDialog.close();
        };
    }

    $scope.currentValue=$stateParams.id;
    var getDataByIDCall = new Object();
    getDataByIDCall.st_id = $scope.currentValue;
    getDataByIDCall.func = 'getDataByID';
    $scope.LableNames = [
        {   name:"Source of reference", value:"st_source" },
        {   name:"Prospect Org's name", value:"st_company" },
        {   name:"Prospect Org's Contact Person", value:"st_contactperson" },
        {   name:"Prospect Org's Contact Email", value:"st_email" },
        {   name:"Prospect Mobile Number", value:"st_mobile" },
        {   name:"Prospect Other Mobile Number", value:"st_mobile2" },
        {   name:"Prospect Landline Number", value:"st_landline" },
        {   name:"Prospect Org's Address", value:"st_address" },
        {   name:"Prospect Org's City", value:"st_city" },
        {   name:"Prospect Org's Website", value:"st_website" },
        {   name:"Data Created By", value:"st_createdby" },
        {   name:"Sector", value:"st_sector" },
        {   name:"Caller Date", value:"st_callerdate" },
        {   name:"Business Details", value:"st_businessDetails" },
    ];

    $scope.SalesCallerLableNames = [
        {   name:"Service Category", value:"st_serviceCategory" },
        {   name:"Standard's Reference", value:"st_requirement" },
        {   name:"Next Action", value:"st_nextAction" },
        {   name:"Next Action Date", value:"st_nextActionDate" },
        {   name:"Sales Executive", value:"st_salesExecutive" },
        {   name:"Expected Closure Date", value:"st_exClosureDate" },
        {   name:"Lead Status", value:"st_leadStatus" },
        {   name:"Lead Value", value:"st_leadValue" },
        {   name:"Lead Remarks", value:"st_remarks" }
    ];
    getLeadsByID.getLeadsUsingID(getDataByIDCall).success(function(response) {
        console.log(response);
        $scope.prefilledValues = response;
        $scope.formData.st_serviceCategory = response.st_serviceCategory;
        $scope.formData.st_requirement = response.st_requirement;
    }).error(function(e) {
        console.log(e);
    });

    $scope.updateDetails = function(req){
        console.log(req);
        req.func = 'updateLeadDetails';
        req.st_id = $scope.currentValue;

        updateLeadsByID.updateLeadsUsingID(req).success(function(response) {
            console.log(response);
            $scope.commonAlertBox(response.message);
            $scope.formData = '';
                        
        }).error(function(e) {
            console.log(e);
        });
    }

    $scope.init = function(){
        if(sessionStorage.getItem("userLoggedIn") != 'true')
            $state.go('login');
        $scope.loggedInUser = sessionStorage.getItem('UserName');
        $scope.formData.st_salesExecutive = $scope.loggedInUser;
    }

    $scope.init();
});