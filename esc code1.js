var wfEventInt ="";
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
                var task = node.getWorkflowInstanceByID("Dish/RecipeAmendmentWorkflow").getTaskByID(state);
			wfEventInt = wfEventInt +"Dish Recipe Amendment Workflow#" + state + "#" + node.getID() + "#" + node.getName() + "#" + task.getAssignee().getID() + "#" + noOfDays;
            }
        }
    });
}
var mailTypeInt = "SellSideEscalationAdminUsers";
WHB_LIB.createRefMailType(step, node, mailTypeInt, wfEventInt);