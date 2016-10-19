<?php
include('common.php');


$jsonData = file_get_contents('php://input');
$jsonDecodedArray = json_decode($jsonData,true);
//print_r($var1);

if($jsonDecodedArray['func'] == 'leadGenerate'){
	leadGenerate($jsonDecodedArray,'syprotek_salestracker','leadGenerate');	
} else if($jsonDecodedArray['func'] == 'getLeadByDate'){
	getOldLeadByDate($jsonDecodedArray,'syprotek_salestracker','getLeadByDate');
} else if($jsonDecodedArray['func'] == 'getDataByID'){
	getDataByID($jsonDecodedArray,'syprotek_salestracker','getDataByID');
} else if($jsonDecodedArray['func'] == 'updateLeadDetails'){
	updateLeadDetails($jsonDecodedArray,'syprotek_salestracker','updateLeadDetails');
} else if($jsonDecodedArray['func'] == 'updateData'){
	updateData($jsonDecodedArray,'syprotek_salestracker','updateData');
} else if($jsonDecodedArray['func'] == 'updateSalesCallerData'){
	updateSalesCallerData($jsonDecodedArray,'syprotek_salestracker','updateSalesCallerData');
} else if($jsonDecodedArray['func'] == 'AgentSignUp'){
	AgentSignUpLogic($jsonDecodedArray,'syprotek_user_registration','AgentSignUp');
} else if($jsonDecodedArray['func'] == 'AgentLogin'){
	AgentLoginLogic($jsonDecodedArray,'syprotek_user_registration','AgentLogin');
} else if($jsonDecodedArray['func'] == 'getLastUpdatedLeads'){
	getLastUpdatedLead($jsonDecodedArray,'syprotek_salestracker','getLastUpdatedLeads');
} 


?>