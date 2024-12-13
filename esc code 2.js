var FinalDishArr = [];
var getTheEnt = step.getEntityHome().getEntityByID("MailSwitch");
var switchVal = getTheEnt.getValue("MailSwitchSendMails").getSimpleValue();
var refsToDelete = [];
var NoDishinDishtoMenu ="Y";
var NoDishinDishAmd="Y";
var messString = "<br>Hi All,<br><br>" + 
"Please find below the list of Dish Recipes currently under the <b>Dish to Menu</b> and <b>Dish Recipe Amendment</b> workflows that have been in their respective states for more than 10 days.<br><br>" +
"These Dish Recipes are currently in the following workflow states for an extended period. Kindly review the details and take necessary action if required.<br><br>";
var footer = 'If you have any questions or need further details, please feel free to reach out to <a href="mailto:WhitbreadSTEPSupport@cognizant.com">WhitbreadSTEPSupport@cognizant.com</a>.<br><br>' + 
'Thank you,<br>' + 
'STEP Team<br>' + 
'This is an Autogenerated Email. PLEASE DO NOT REPLY.<br>';
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

    var table1 = "<style>" +
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
   // logger.info(new1[0]);
   if(new1[0] == "Dish to Menu Workflow")
   {
    NoDishinDishtoMenu = 'N';


    var stateIndex = dishtoMenuStates.indexOf(new1[1]);
    
    // If the state is found in the dishtoMenuStates array, we push the dish along with the state index
    if (stateIndex != -1) {
        dishesWithStateIndex.push({
            stateIndex: stateIndex,
            dish: new1
        });
    }
















    table += "<tr>" +
    "<td>" + new1[0] + "</td>" +
    "<td>" + new1[1] + "</td>" +
    "<td>" + new1[2] + "</td>" +
    "<td>" + new1[3] + "</td>" +
    "<td>" + new1[4] + "</td>" +
    "<td>" + new1[5] + "</td>" +
    "</tr>";

   }
   else{
    NoDishinDishAmd = 'N';
    table1 += "<tr>" +
    "<td>" + new1[0] + "</td>" +
    "<td>" + new1[1] + "</td>" +
    "<td>" + new1[2] + "</td>" +
    "<td>" + new1[3] + "</td>" +
    "<td>" + new1[4] + "</td>" +
    "<td>" + new1[5] + "</td>" +
    "</tr>";
   }
   
});

table += "</tbody></table>";
table1 += "</tbody></table>";
var UserList =[];
//logger.info(table);


var AdminUser = step.getGroupHome().getGroupByID("EscalationAdminUsers");
var userList = AdminUser.getUsers().iterator();
while (userList.hasNext()) {
    var currUser = userList.next();
    if (currUser.getEMail())
        UserList.push(currUser.getEMail());
}

if (NoDishinDishtoMenu == "Y") {
    // If there are no dishes in Dish to Menu workflow for over 10 days
    messString = messString + "<b>Dish to Menu Workflow - </b><br>" + "No Dish Recipe in Workflow for over 10 days." + "<br>";
} else {
    // If there are dishes in Dish to Menu workflow, show the table
    messString = messString + "<b>Dish to Menu Workflow - </b><br>" + table + "<br>";
}

if (NoDishinDishRecipeAmendment == "Y") {
    // If there are no dishes in Dish Recipe Amendment workflow
    messString = messString + "<b>Dish Recipe Amendment Workflow - </b><br>" + "No Dish Recipe in Workflow for over 10 days." + "<br>" + footer;
} else {
    // If there are dishes in Dish Recipe Amendment workflow, show the table1
    messString = messString + "<b>Dish Recipe Amendment Workflow - </b><br>" + table1 + "<br>" + footer;
}

var Users = UserList.join(";");



var mailer = mailHome.mail();
mailer.addTo(Users);
mailer.from("noreply@cloudmail.stibo.com");
mailer.subject("Dish Recipes in Workflow States for Over 10 Days");
//mailer.footer(footer);
mailer.htmlMessage(messString);
mailer.send();

