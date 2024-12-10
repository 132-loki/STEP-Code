////check if dish rcipe can be approved

var missing = "N";
var messStr2 = '';
var twistIDBlank = "N";
//////////////////////////// added new code below after PR-2202 (STB mandatory)

//get the sub menus of the current folder
var menuSubMenus = node.getChildren();
var twistIDBlankmsg = '';


//looop through sub menus
for(var a = 0; a<menuSubMenus.size();a++){
	//for each one......
	var currSM = menuSubMenus.get(a);
	var currSMID = currSM.getID();
	var currSMName = currSM.getName();
	logger.info(currSMName);
	var ObjType = currSM.getObjectType().getID();
	if(ObjType == "SubMenu")
	{
	// get the products (dish recipes)
	var pLinks = currSM.getClassificationProductLinks().iterator();

	while(pLinks.hasNext()){
		var currPLink = pLinks.next();//this is what needs to be deleted once copied
		var currProd = currPLink.getProduct();
		var myObj = currProd.getObjectType().getID();

		//for each Dish Recipe found do this.....
		if(myObj == "DishRecipe" && currPLink.getClassification().getID() == currSMID)
		{
		
			var dishID = currProd.getID();
				var stbnVal = currPLink.getValue("StickTwistBustNew").getSimpleValue();	

				if(stbnVal == null)
				{
					missing = "Y";
					if(messStr2 == ''){
						messStr2 = "Please fill the attribute 'Stick Twist Bust or New' status on the Dish "+dishID+" linked to the Submenu(s)";
					}else{
						messStr2 = messStr2+", Please fill the attribute 'Stick Twist Bust or New' status on the Dish "+dishID+" linked to the Submenu(s)";
					}
				}
				else
				{
					if(stbnVal == "Twist")
					{
						var twistRecipeID = currPLink.getValue("TwistRecipeID").getSimpleValue();
						if (currPLink.getValue("TwistRecipeID").getSimpleValue() == "" || currPLink.getValue("TwistRecipeID").getSimpleValue() == null) {
							twistIDBlankmsg = twistIDBlankmsg + ", " + dishID;
							twistIDBlank = "Y";
						}
					}
				}

///PR-2535		//////########## PR-2388 extra check do not allow approved dishes as 'New' ##################//
/*				if(stbnVal == "New" && currProd.getApprovalStatus().toString()!= "Not in Approved workspace")
				{
					
					missing = "Y";
					if(messStr2 == ''){
						messStr2 = "Dish "+dishID+" is approved so can't have a 'Stick Twist Bust or New' status of 'New'";
					}else{
						messStr2 = messStr2+", Dish "+dishID+" is approved so can't have a 'Stick Twist Bust or New' status of 'New'";
					}

				}
*/
		}
	}
}

}

////////////////////////////

	
	//fail condition and output message.
	if(missing == "Y"){
		
		issue.addError("The following mandatory data is missing - "+messStr2,node);
		return issue;
		//return "The following mandatory data is missing - "+messStr1+messStr2;
		
		}
		else if(twistIDBlank == "Y")
		{
			issue.addError("The Twist Recipe ID is Blank for the twisted Dish Recipes :" + twistIDBlankmsg,node);
		return issue;	
		}
		else{
			return true;
			}