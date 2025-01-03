//code 1:

var wfEventInt ="";
var wfEventInt1 ="";
var Escalate = "N";
var dishtoMenuStates = [
    "InDevelopment",
    "CompleteCookMethod",
    "MenuMasterLockdownMenuCopy",
    "TechnicalRecipeReview",
    "RevalidateDish",
    "AwaitingCoceptModelReview",
    "ReviewAndApproveDish",
    "AwaitingFullModelReview",
    "Review"
];

var dishRecipeAmendmentStates = [
    "Dish/RecipeBeingAmended",
    "ReviewFeedback",
    "CompleteCookMethod"
];

if (node.isInWorkflow("DishtoMenuWorkflow")) {
    var currDate = new Date();
    dishtoMenuStates.forEach(function(state) {
        if (node.isInState("DishtoMenuWorkflow", state)) {
        	logger.info(state+" "+node.getID());
            var enteredDate = new Date(node.getTaskByID("DishtoMenuWorkflow", state).getEntryTime());
            var differenceInMilliseconds = currDate - enteredDate;
            var noOfDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            if (noOfDays > 10) {
            	Escalate = "Y";
                var task = node.getWorkflowInstanceByID("DishtoMenuWorkflow").getTaskByID(state);
			wfEventInt = wfEventInt +"Dish to Menu Workflow#" + state + "#" + node.getID() + "#" + node.getName() + "#" + task.getAssignee().getID() + "#" + noOfDays;
            }
        }
    });
}
if (node.isInWorkflow("Dish/RecipeAmendmentWorkflow")) {
    var currDate = new Date();
    dishRecipeAmendmentStates.forEach(function(state) {
        if (node.isInState("Dish/RecipeAmendmentWorkflow", state)) {
            var enteredDate = new Date(node.getTaskByID("Dish/RecipeAmendmentWorkflow", state).getEntryTime());
            var differenceInMilliseconds = currDate - enteredDate;
            var noOfDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            if (noOfDays > 10) {
            	Escalate = "Y";
                var task = node.getWorkflowInstanceByID("Dish/RecipeAmendmentWorkflow").getTaskByID(state);
			wfEventInt1 = wfEventInt1 +"Dish Recipe Amendment Workflow#" + state + "#" + node.getID() + "#" + node.getName() + "#" + task.getAssignee().getID() + "#" + noOfDays;
            }
        }
    });
}
//logger.info(wfEventInt);
//logger.info(wfEventInt1);
var mailTypeInt = "SellSideEscalationAdminUsers";
if(Escalate == "Y")
{
	if(node.isInWorkflow("DishtoMenuWorkflow"))
		WHB_LIB.createRefMailType(step, node, mailTypeInt, wfEventInt);
	if(node.isInWorkflow("Dish/RecipeAmendmentWorkflow"))
		WHB_LIB.createRefMailType(step, node, mailTypeInt, wfEventInt1);
}

//code 2:
//################### CHECK FOR SWITCH HERE ###########################//
var getTheEnt = manager.getEntityHome().getEntityByID("MailSwitch");
var switchVal = getTheEnt.getValue("MailSwitchSendMails").getSimpleValue();
var tableStyle = "<style>table, th, td {border: 2px solid white;padding:8px;border-collapse: collapse;}th, td {background-color: #e6f5ff;}th {background-color: #1aa3ff;color:white}</style>";
var mailFooter = "<br><br>Thank you,<br>STEP Team<br>This is an Autogenerated Email. PLEASE DO NOT REPLY<br><i>For any queries, please reach out to - WhitbreadSTEPSupport@cognizant.com</i>";
if (switchVal == "Do not send mails") {
    logger.info("Not sending Internal mails - switch is set to 'Do not send mails'.");
} else {
    //##### SEND THE MAILS ############//
    var FinalDishArr = [];
    var mailTypeID = node.getID();
    var mailType = manager.getEntityHome().getEntityByID(mailTypeID);
    var allVals = [];
    var allValsArchive = [];
    var refsToDelete = [];
    //var allCC =["lok.chhetri@cognizant.com"];
    var eventDetails = {
        "InDevelopmentEsc": {
            flag: "N",
            details: [],
            addressField: "EmailFandB"
        },
        "CompleteCookMethodEsc": {
            flag: "N",
            details: [],
            addressField: "MailToAddressFBProcMgr",
            cc: ["lok.chhetri1@whitbread.com"]
        },
        /*"CompleteCookMethodEscAll": {
        	flag: "N",
        	details: [],
        	addressField: "MailToAddressFBProcMgr",
        	//cc: ["lok.chhetri@cognizant.com"]
        },*/
        "MenuMasterLockdownMenuCopyEsc": {
            flag: "N",
            details: [],
            addressField: "MailToAddressMarkting"
        },
        "TechnicalRecipeReviewEsc": {
            flag: "N",
            details: [],
            addressField: "EmailTechnical"
        },
        "RevalidateDishEsc": {
            flag: "N",
            details: [],
            addressField: "EmailFandB"
        },
        "AwaitingCoceptModelReviewEsc": {
            flag: "N",
            details: [],
            addressField: "MailToUserGrpFinance"
        },
        "ReviewAndApproveDishEsc": {
            flag: "N",
            details: [],
            addressField: "EmailFandB"
        },
        "AwaitingFullModelReviewEsc": {
            flag: "N",
            details: [],
            addressField: "MailToUserGrpFinance"
        },
        "ReviewEsc": {
            flag: "N",
            details: [],
            addressField: "MailToAddressFBProcMgr"
        },
        "Dish/RecipeBeingAmended": {
            flag: "N",
            details: [],
            addressField: "EmailTechnical"
        },
        "ReviewFeedbackEsc": {
            flag: "N",
            details: [],
            addressField: "MailToAddressFBProcMgr"
        },
        "DishAmendmentCompleteCookMethod": {
            flag: "N",
            details: [],
            addressField: "MailToFieldImpTeam"
            //cc: ["lok.chhetri1@whitbread.com"]
        }
        /*
        			"DishAmendmentCompleteCookMethodAll": {
        			flag: "N",
        			details: [],
        			addressField: "MailToFieldImpTeam"
        		}*/
    };

    // Process all references
    var allMTRefs = node.getReferencedBy().iterator();
    while (allMTRefs.hasNext()) {
        var currMTRef = allMTRefs.next();
        if (currMTRef.getTarget().getID() == mailTypeID) {
            var multiVals = currMTRef.getValue("ProdToMailTypeWorkflowEvent").getSimpleValue().split("<multisep/>");
            var currMailRefID = currMTRef.getSource().getID();
            var currMailRefName = currMTRef.getSource().getName();

            if (currMTRef.getValue("ArchiveComment").getSimpleValue() != null) {
                var multiValsArc = currMTRef.getValue("ArchiveComment").getSimpleValue().split("<multisep/>");
                multiValsArc.forEach(function(val) {
                    allValsArchive.push(currMailRefID + " # " + currMailRefName + " # " + val);
                    //	allValsArchive.push(val + " # " + currMailRefID + " # " + currMailRefName);
                });
            }
            //	logger.info(multiValsArc);

            multiVals.forEach(function(val) {
                allVals.push(val + " # " + currMailRefID + " # " + currMailRefName);
                FinalDishArr.push(val);
                //	allValsArchive.push(val + " # " + currMailRefID + " # " + currMailRefName);
            });

            refsToDelete.push(currMTRef);
        }
    }

    // Remove duplicates
    function removeDuplicates(array) {
        var uniqueArray = [];
        for (var i = 0; i < array.length; i++) {
            if (uniqueArray.indexOf(array[i]) == -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }

    var evtArr = allVals.map(val => val.split(" # ")[0]);
    var evtList = removeDuplicates(evtArr);
    var valsList = removeDuplicates(allVals);
    var valsListArc = removeDuplicates(allValsArchive);

    if (mailTypeID == "SellSideDishRecipeEscalation") {
        var eSubject = node.getValue("MailSubject").getSimpleValue();
        var eHeader = "Hi, Please find the escalation details below :" + "<br>";
        //eHeader = eHeader +"<br>";
        var eFooter = "Thank you," + "<br>" + "STEP Team" + "<br>" + "This is an Autogenerated Email. PLEASE DO NOT REPLY" + "<br>" + "For any queries, please reach out to - WhitbreadSTEPSupport@cognizant.com";

        evtList.forEach(function(evt) {
            var Counter = 0;
            var result = '';
            var EscDetails = "<tr><th>Sl No.</th><th>Dish Recipe ID</th><th>Dish Recipe Name</th></tr>";

            valsList.forEach(function(item) {
                var parts = item.split('#').map(part => part.trim());
                if (parts.length >= 3 && parts[0] == evt) {
                    var productId = parts[1];
                    var productName = parts[2];

                    Counter++;
                    EscDetails += '<tr>' +
                        '<td>' + Counter + '</td>' +
                        '<td>' + productId + '</td>' +
                        '<td>' + productName + '</td>' +
                        '</tr>';
                }
            });

            if (Counter == 0) {
                EscDetails += "<tr><td colspan='3'>No Dish Recipes</td></tr>";
            }

            eventDetails[evt].details = "<table>" + EscDetails + "</table>";
            eventDetails[evt].flag = "Y";

            var lookupMsg = lookUpHome.getLookupTableValue("InternalEventGroupHeader", evt);
            lookupMsg = lookupMsg + "<br>";
            var messString = "<html><body><br>" + eHeader + "<br>" + lookupMsg + "<br>" + tableStyle + eventDetails[evt].details + "<br>" + "<br>" + eFooter + "</body></html>";

            var addressField = eventDetails[evt].addressField;
            var addresses = mailType.getValue(addressField).getSimpleValue();
            //if(eventDetails[evt].cc != null && evt == "CompleteCookMethodEsc")
            //var ccString = eventDetails[evt].cc.join(";");
            //var ccString = (evt == "CompleteCookMethodEsc" || evt == "DishAmendmentCompleteCookMethod") ? eventDetails[evt].cc.join(";") : allCC.join(";");
            //	logger.info("evt :"+evt +" contmrt :"+messString);
            if (addresses) {
                //var addressList = removeDuplicates(addresses.split(";"));
                var mailer = myMailerHome.mail();
                mailer.addTo(addresses);
                //	mailer.addCc(ccString);
                mailer.from("noreply@cloudmail.stibo.com");
                mailer.subject(eSubject);
                mailer.htmlMessage(messString);
                mailer.send();
            }
        });
    } else if (mailTypeID == "SellSideEscalationAdminUsers") {
        /*
        var messString = "<br>Hi All,<br><br>" +
            "Please find below the list of Dish Recipes currently under the <b>Dish to Menu</b> and <b>Dish Recipe Amendment</b> workflows that have been in their respective states for more than 10 days.<br><br>" +
            "These Dish Recipes are currently in the following workflow states for an extended period. Kindly review the details and take necessary action if required.<br><br>";
        var footer = 'If you have any questions or need further details, please feel free to reach out to <a href="mailto:WhitbreadSTEPSupport@cognizant.com">WhitbreadSTEPSupport@cognizant.com</a>.<br><br>' +
            'Thank you,<br>' +
            'STEP Team<br>' +
            'This is an Autogenerated Email. PLEASE DO NOT REPLY.<br>';

        var tableTemplate = "<style>" +
            "table {" +
            "   border-collapse: collapse;" +
            "   margin: 20px 0;" +
            "}" +
            "th, td {" +
            "   padding: 8px 12px;" +
            "   text-align: left;" +
            "   border: 1px solid #ddd;" +
            "}" +
            "th {" +
            "   background-color: skyblue;" +
            "   color: white;" +
            "}" +
            "tr:nth-child(even) {" +
            "   background-color: #f2f2f2;" +
            "}" +
            "tr:hover {" +
            "   background-color: #ddd;" +
            "}" +
            "</style>" +
            "<table>" +
            "<thead>" +
            "<tr>" +
            "<th>Workflow Name</th>" +
            "<th>Workflow State</th>" +
            "<th>Dish Recipe ID</th>" +
            "<th>Dish Recipe Name</th>" +
            "<th>Assignee</th>" +
            "<th>No of Days</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";

        var dishtoMenuStates = [
            "InDevelopment",
            "CompleteCookMethod",
            "MenuMasterLockdownMenuCopy",
            "TechnicalRecipeReview",
            "RevalidateDish",
            "AwaitingCoceptModelReview",
            "ReviewAndApproveDish",
            "AwaitingFullModelReview",
            "Review"
        ];

        var dishRecipeAmendmentStates = [
            "Dish/RecipeBeingAmended",
            "ReviewFeedback",
            "CompleteCookMethod"
        ];


        var dishtoMenuDishes = [];
        var dishRecipeAmendmentDishes = [];

        function generateTableContent(dishes, states) {
            var tableContent = "";
            dishes.forEach(function(dishData) {
                var new1 = dishData.dish;
                tableContent += "<tr>" +
                    "<td>" + new1[0] + "</td>" +
                    "<td>" + new1[1] + "</td>" +
                    "<td>" + new1[2] + "</td>" +
                    "<td>" + new1[3] + "</td>" +
                    "<td>" + new1[4] + "</td>" +
                    "<td>" + new1[5] + "</td>" +
                    "</tr>";
            });
            return tableContent;
        }

        FinalDishArr.forEach(function(dish) {
            var new1 = dish.split("#");
            if (new1[0] == "Dish to Menu Workflow") {
                var stateIndex = dishtoMenuStates.indexOf(String(new1[1]));
                if (stateIndex != -1) {
                    dishtoMenuDishes.push({
                        stateIndex: stateIndex,
                        dish: new1
                    });
                }
            } else if (new1[0] == "Dish Recipe Amendment Workflow") {
                var stateIndex = dishRecipeAmendmentStates.indexOf(String(new1[1]));
                if (stateIndex != -1) {
                    dishRecipeAmendmentDishes.push({
                        stateIndex: stateIndex,
                        dish: new1
                    });
                }
            }
        });

        dishtoMenuDishes.sort(function(a, b) {
            return a.stateIndex - b.stateIndex;
        });

        dishRecipeAmendmentDishes.sort(function(a, b) {
            return a.stateIndex - b.stateIndex;
        });

        var table = tableTemplate;
        var table1 = tableTemplate;

        if (dishtoMenuDishes.length > 0) {


            table += generateTableContent(dishtoMenuDishes, dishtoMenuStates);
            table += "</tbody></table>";
            logger.info(" 133 " + table);
            messString += "<b>Dish to Menu Workflow - </b><br>" + table + "<br>";
        } else {
            messString = messString + "<b>Dish to Menu Workflow - </b><br>" + "<br>" + "No Dish Recipe in Workflow for over 10 days.<br>" + "<br>";
        }
       // logger.info(" messString 136:" + messString);
        if (dishRecipeAmendmentDishes.length > 0) {
            table1 += generateTableContent(dishRecipeAmendmentDishes, dishRecipeAmendmentStates);
            table1 += "</tbody></table>";
            messString += "<b>Dish Recipe Amendment Workflow - </b><br>" + table1 + "<br>" + footer;
        } else {
            messString = messString + "<b>Dish Recipe Amendment Workflow - </b><br>" + "<br>" + "No Dish Recipe in Workflow for over 10 days.<br>" + "<br>" + footer;
        }

        var UserList = [];
        var AdminUser = manager.getGroupHome().getGroupByID("EscalationAdminUsers");
        var userList = AdminUser.getUsers().iterator();
        while (userList.hasNext()) {
            var currUser = userList.next();
            if (currUser.getEMail()) {
                UserList.push(currUser.getEMail());
            }
        }

        var Users = UserList.join(";");
logger.info("final str :"+messString);
        // Send the email
        var mailer = myMailerHome.mail();
        mailer.addTo(Users);
        mailer.from("noreply@cloudmail.stibo.com");
        mailer.subject("Dish Recipes in Workflow States for Over 10 Days");
        mailer.htmlMessage(messString);
       // mailer.send();*/

        var messString = "<br>Hi All,<br><br>" +
            "Please find below the list of Dish Recipes currently under the <b>Dish to Menu</b> and <b>Dish Recipe Amendment</b> workflows that have been in their respective states for more than 10 days.<br><br>" +
            "These Dish Recipes are currently in the following workflow states for an extended period. Kindly review the details and take necessary action if required.<br><br>";
        var footer = 'If you have any questions or need further details, please feel free to reach out to <a href="mailto:WhitbreadSTEPSupport@cognizant.com">WhitbreadSTEPSupport@cognizant.com</a>.<br><br>' +
            'Thank you,<br>' +
            'STEP Team<br>' +
            'This is an Autogenerated Email. PLEASE DO NOT REPLY.<br>';

        var tableTemplate = "<style>" +
            "table {" +
            "   border-collapse: collapse;" +
            "   margin: 20px 0;" +
            "}" +
            "th, td {" +
            "   padding: 8px 12px;" +
            "   text-align: left;" +
            "   border: 1px solid #ddd;" +
            "}" +
            "th {" +
            "   background-color: skyblue;" +
            "   color: white;" +
            "}" +
            "tr:nth-child(even) {" +
            "   background-color: #f2f2f2;" +
            "}" +
            "tr:hover {" +
            "   background-color: #ddd;" +
            "}" +
            "</style>";

        var dishtoMenuStates = [
            "InDevelopment",
            "CompleteCookMethod",
            "MenuMasterLockdownMenuCopy",
            "TechnicalRecipeReview",
            "RevalidateDish",
            "AwaitingCoceptModelReview",
            "ReviewAndApproveDish",
            "AwaitingFullModelReview",
            "Review"
        ];

        var dishRecipeAmendmentStates = [
            "Dish/RecipeBeingAmended",
            "ReviewFeedback",
            "CompleteCookMethod"
        ];

        var dishtoMenuDishes = [];
        var dishRecipeAmendmentDishes = [];

        function generateTableContent(dishes, states) {
            var tableContent = "";
            dishes.forEach(function(dishData) {
                var new1 = dishData.dish;
                tableContent += "<tr>" +
                    "<td>" + new1[0] + "</td>" +
                    "<td>" + new1[1] + "</td>" +
                    "<td>" + new1[2] + "</td>" +
                    "<td>" + new1[3] + "</td>" +
                    "<td>" + new1[4] + "</td>" +
                    "<td>" + new1[5] + "</td>" +
                    "</tr>";
            });
            return tableContent;
        }

        FinalDishArr.forEach(function(dish) {
            var new1 = dish.split("#");
            if (new1[0] == "Dish to Menu Workflow") {
                var stateIndex = dishtoMenuStates.indexOf(String(new1[1]));
                if (stateIndex != -1) {
                    dishtoMenuDishes.push({
                        stateIndex: stateIndex,
                        dish: new1
                    });
                }
            } else if (new1[0] == "Dish Recipe Amendment Workflow") {
                var stateIndex = dishRecipeAmendmentStates.indexOf(String(new1[1]));
                if (stateIndex != -1) {
                    dishRecipeAmendmentDishes.push({
                        stateIndex: stateIndex,
                        dish: new1
                    });
                }
            }
        });

        dishtoMenuDishes.sort(function(a, b) {
            return a.stateIndex - b.stateIndex;
        });

        dishRecipeAmendmentDishes.sort(function(a, b) {
            return a.stateIndex - b.stateIndex;
        });

        var table = tableTemplate;
	   var table1 = tableTemplate;
	   
        if (dishtoMenuDishes.length > 0) {
            var tableContent = generateTableContent(dishtoMenuDishes, dishtoMenuStates);
            table += "<table><thead><tr>" +
                "<th>Workflow Name</th>" +
                "<th>Workflow State</th>" +
                "<th>Dish Recipe ID</th>" +
                "<th>Dish Recipe Name</th>" +
                "<th>Assignee</th>" +
                "<th>No of Days</th>" +
                "</tr></thead><tbody>" + tableContent + "</tbody></table>";
            messString += "<b>Dish to Menu Workflow - </b><br>" + table + "<br>";
        } else {
            messString += "<b>Dish to Menu Workflow - </b><br><br>" + "No Dish Recipe in Workflow for over 10 days.<br><br>";
        }

        if (dishRecipeAmendmentDishes.length > 0) {
            var tableContent1 = generateTableContent(dishRecipeAmendmentDishes, dishRecipeAmendmentStates);
            var table1 = "<table><thead><tr>" +
                "<th>Workflow Name</th>" +
                "<th>Workflow State</th>" +
                "<th>Dish Recipe ID</th>" +
                "<th>Dish Recipe Name</th>" +
                "<th>Assignee</th>" +
                "<th>No of Days</th>" +
                "</tr></thead><tbody>" + tableContent1 + "</tbody></table>";
            messString += "<b>Dish Recipe Amendment Workflow - </b><br>" + table1 + "<br>" + footer;
        } else {
            messString += "<b>Dish Recipe Amendment Workflow - </b><br><br>" + "No Dish Recipe in Workflow for over 10 days.<br><br>" + footer;
        }

        var UserList = [];
        var AdminUser = manager.getGroupHome().getGroupByID("EscalationAdminUsers");
        var userList = AdminUser.getUsers().iterator();
        while (userList.hasNext()) {
            var currUser = userList.next();
            if (currUser.getEMail()) {
                UserList.push(currUser.getEMail());
            }
        }

        var Users = UserList.join(";");
        logger.info("final str :" + messString);

        // Send the email
        var mailer = myMailerHome.mail();
        mailer.addTo(Users);
        mailer.from("noreply@cloudmail.stibo.com");
        mailer.subject("Dish Recipes in Workflow States for Over 10 Days");
        mailer.htmlMessage(messString);
        mailer.send();

    } else if (mailTypeID == "BuyingArchiveMail") {

        var ArchiveDetails = "<tr><th>Sl No.</th><th>Product ID</th><th>Product Name</th><th>Archive Comment</th></tr>"; // Adjust header
        var Counter = 0;
        var result = '';

        var temp = "";

        for (var i = 0; i < valsListArc.length; i++) {
            var parts = valsListArc[i].split('#').map(part => part.trim());
            logger.info(parts);
            if (parts.length == 3) {
                Counter++;
                temp += '<tr>' +
                    '<td>' + Counter + '</td>' +
                    '<td>' + parts[0] + '</td>' +
                    '<td>' + parts[1] + '</td>' +
                    '<td>' + parts[2] + '</td>' +
                    '</tr>';
            }
        }
        //logger.info(temp);
        if (temp == "") {
            ArchiveDetails += "<tr><td colspan='4'>No archived products found.</td></tr>";
        } else {
            ArchiveDetails += temp;
        }

        result += "<br>Please find the following list of Archived Products : <br><br><table>" + ArchiveDetails + "</table>";

        var eventMsgComplete = "<br><br>The Following Products are currently in Archived state because these products are flagged as Yes for Archive by NSF, F&B Team or Buying Team. Please check below.<br>" + tableStyle + result;
        var address = node.getValue("MailToAddress").getSimpleValue();
        logger.info("address :" + address);
        var eSubject = node.getValue("MailSubject").getSimpleValue();
        var eHeader = node.getValue("MailMessageHeader").getSimpleValue();
        var eFooter = node.getValue("MailMessageFooter").getSimpleValue();
        var cc = [];
        cc.push(node.getValue("EmailTechnical").getSimpleValue());
        cc.push(node.getValue("EmailFandB").getSimpleValue());
        var ccString = cc.join(';');
        var messString = eHeader + "\r\n\r\n" + eventMsgComplete + "<br>" + mailFooter;
        if (address) {
            try {
                var mailer = myMailerHome.mail();
                mailer.addTo(address);
                mailer.addCc(ccString);
                mailer.from("noreply@cloudmail.stibo.com");
                mailer.subject(eSubject);
                mailer.htmlMessage(messString);
                mailer.send();
                logger.info("Internal " + mailTypeID + " mail sent to - " + address + " " + eSubject + " " + messString.replace(/\n|\r/g, " "));
            } catch (error) {
                logger.info("Failed to send email to " + address + ": " + error.message);
            }
        }
    } else {
        var combinedMsgArray = [];
        evtList.forEach(function(evt) {
            var eventMsgArray = [];
            var lookupMsg = lookUpHome.getLookupTableValue("InternalEventGroupHeader", evt);

            valsList.forEach(function(val) {
                var messVals = val.split(" # ");
                if (messVals[0] == evt) {
                    eventMsgArray.push(messVals[2] + " - " + messVals[1]);
                }
            });

            var eventMsgComplete = WHB_LIB.getEventStr(eventMsgArray, lookupMsg);
            combinedMsgArray.push(eventMsgComplete);
        });

        var eSubject = node.getValue("MailSubject").getSimpleValue();
        var eHeader = node.getValue("MailMessageHeader").getSimpleValue();
        var eFooter = node.getValue("MailMessageFooter").getSimpleValue();
        var messString = eHeader + "\r\n\r\n" + combinedMsgArray.join("\r\n\r\n") + (eFooter ? "\r\n" + eFooter : "");

        var entAddrss = mailType.getValue("MailToAddress").getSimpleValue();
        if (!entAddrss) {
            entAddrss = "WhitbreadSTEPSupport@cognizant.com";
            eSubject = "STEP - No addresses found for Internal mail process " + mailTypeID + ", mail not sent!";
        }
        var entUID = mailType.getValue("MailToUser").getSimpleValue();
        var entUGrp = mailType.getValue("MailToUserGrp").getSimpleValue();

        var eMArr = [];
        if (entAddrss) eMArr = entAddrss.split(";");
        if (entUID) {
            var userArr = entUID.split(";");
            userArr.forEach(function(userID) {
                eMArr.push(manager.getUserHome().getUserById(userID).getEMail());
            });
        }
        if (entUGrp) {
            var grpArr = entUGrp.split(";");
            grpArr.forEach(function(groupID) {
                var userGEM = manager.getGroupHome().getGroupByID(groupID);
                var uList = userGEM.getUsers().iterator();
                while (uList.hasNext()) {
                    var uMail = uList.next().getEMail();
                    if (uMail) eMArr.push(uMail);
                }
            });
        }

        var mailList = removeDuplicates(eMArr);
        if (mailList.length == 0) {
            mailList.push("WhitbreadSTEPSupport@cognizant.com");
            eSubject = "STEP - No addresses found for Internal mail process " + mailTypeID + ", mail not sent!";
            messString = eHeader + "\r\n\r\n" + eFooter;
        }

        var mailer = myMailerHome.mail();

        mailer.addTo(entAddrss);
        mailer.from("noreply@cloudmail.stibo.com");
        mailer.subject(eSubject);
        mailer.plainMessage(messString);
        mailer.send();
        //logger.info("Internal " + mailTypeID + " mail sent to - " + address + " " + eSubject + " " + messString.replace(/\n|\r/g, " "));
    }

    // Delete references
    refsToDelete.forEach(function(ref) {
        ref.delete();
    });

    // Reset the schedule flag (for collection)
    node.getValue("MailScheduleFlag").setSimpleValue("No");
}