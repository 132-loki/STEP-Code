
//Code 1:

var FinalDishArr = [];
var wfEventInt ="";
var messString = "<br>"+"Hi, "+"<br>"+"<br>The following Dish Recipes are in the state for more than 10days .<br>"+"<br>";
var footer = 'Thank you,'+'<br>'+'STEP Team'+'<br>'+'This is an Autogenerated Email. PLEASE DO NOT REPLY'+'<br>'+'For any queries, please reach out to - WhitbreadSTEPSupport@cognizant.com"';
//messString = messString + footer;

/*
var table = "<style>" +
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
*/
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
            var enteredDate = new Date(node.getTaskByID("DishtoMenuWorkflow", state).getEntryTime());
            var differenceInMilliseconds = currDate - enteredDate;
            var noOfDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            if (noOfDays > 10) {
                var task = node.getWorkflowInstanceByID("DishtoMenuWorkflow").getTaskByID(state);
               // logger.info("Dish to Menu Workflow " + state + " " + node.getID() + " " + node.getName() + " " + task.getAssignee().getID() + " " + noOfDays);
               // FinalDishArr.push("Dish to Menu Workflow#" + state + "#" + node.getID() + "#" + node.getName() + "#" + task.getAssignee().getID() + "#" + noOfDays);
           	wfEventInt = wfEventInt +"Dish to Menu Workflow#" + state + "#" + node.getID() + "#" + node.getName() + "#" + task.getAssignee().getID() + "#" + noOfDays;
            }
        }
    });
}

FinalDishArr.forEach(function(dish) {
    var new1 = dish.split("#");
    logger.info(new1[0]);
    table += "<tr>" +
             "<td>" + new1[0] + "</td>" +
             "<td>" + new1[1] + "</td>" +
             "<td>" + new1[2] + "</td>" +
             "<td>" + new1[3] + "</td>" +
             "<td>" + new1[4] + "</td>" +
             "<td>" + new1[5] + "</td>" +
             "</tr>";
});
/*
table += "</tbody></table>";
var UserList =[];
logger.info(table);
var AdminUser = step.getGroupHome().getGroupByID("EscalationAdminUsers");
var userList = AdminUser.getUsers().iterator();
while (userList.hasNext()) {
    var currUser = userList.next();
    if (currUser.getEMail())
        UserList.push(currUser.getEMail());
}
messString = messString +table+"<br>"+footer;
var Users = UserList.join(";");
var mailer = mailHome.mail();
mailer.addTo(Users);
mailer.from("noreply@cloudmail.stibo.com");
mailer.subject("Dish Recipes in state more than 10 days");
//mailer.footer(footer);
mailer.htmlMessage(messString);
mailer.send();*/

var mailTypeInt = "SellSideEscalationAdminUsers";
WHB_LIB.createRefMailType(step, node, mailTypeInt, wfEventInt);



//code 2:

var FinalDishArr = [];
var getTheEnt = step.getEntityHome().getEntityByID("MailSwitch");
var switchVal = getTheEnt.getValue("MailSwitchSendMails").getSimpleValue();
var refsToDelete = [];
var messString = "<br>"+"Hi, "+"<br>"+"<br>The following Dish Recipes are in the state for more than 10days .<br>"+"<br>";
var footer = 'Thank you,'+'<br>'+'STEP Team'+'<br>'+'This is an Autogenerated Email. PLEASE DO NOT REPLY'+'<br>'+'For any queries, please reach out to - WhitbreadSTEPSupport@cognizant.com"';
//messString = messString + footer;
var mailTypeID = node.getID();
	var mailType = step.getEntityHome().getEntityByID(mailTypeID);
var table = "<style>" +
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

// Process all references
	var allMTRefs = node.getReferencedBy().iterator();
	while (allMTRefs.hasNext()) {
		var currMTRef = allMTRefs.next();
		if (currMTRef.getTarget().getID() == mailTypeID) {
			var multiVals = currMTRef.getValue("ProdToMailTypeWorkflowEvent").getSimpleValue().split("<multisep/>");
			
			
			//var currMailRefID = currMTRef.getSource().getID();
			//var currMailRefName = currMTRef.getSource().getName();

			//if (currMTRef.getValue("ArchiveComment").getSimpleValue() != null) {
				//var multiValsArc = currMTRef.getValue("ArchiveComment").getSimpleValue().split("<multisep/>");
				multiVals.forEach(function(val) {
					FinalDishArr.push(val);
					//	allValsArchive.push(val + " # " + currMailRefID + " # " + currMailRefName);
				});
			}
	

			refsToDelete.push(currMTRef);
		}

FinalDishArr.forEach(function(dish) {
    var new1 = dish.split("#");
    logger.info(new1[0]);
    table += "<tr>" +
             "<td>" + new1[0] + "</td>" +
             "<td>" + new1[1] + "</td>" +
             "<td>" + new1[2] + "</td>" +
             "<td>" + new1[3] + "</td>" +
             "<td>" + new1[4] + "</td>" +
             "<td>" + new1[5] + "</td>" +
             "</tr>";
});

table += "</tbody></table>";
var UserList =[];
logger.info(table);


var AdminUser = step.getGroupHome().getGroupByID("EscalationAdminUsers");
var userList = AdminUser.getUsers().iterator();
while (userList.hasNext()) {
    var currUser = userList.next();
    if (currUser.getEMail())
        UserList.push(currUser.getEMail());
}
messString = messString +table+"<br>"+footer;
var Users = UserList.join(";");



var mailer = mailHome.mail();
mailer.addTo(Users);
mailer.from("noreply@cloudmail.stibo.com");
mailer.subject("Dish Recipes in state more than 10 days");
//mailer.footer(footer);
mailer.htmlMessage(messString);
mailer.send();

