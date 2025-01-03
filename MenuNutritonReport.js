var brand = node.getValue("MENBrand").getSimpleValue();
var menuName = node.getValue("MenuName").getSimpleValue();
var subMenuName = "";
var flag_Upgrade = "No";
var dishGCSRUnique = [];
var DRUP = [];
var Flag = "Y";
var dishGCSRUniqueArray = [];
var dishGCSRUniqueArray1 = [];
var recIngRefType = step.getReferenceTypeHome().getReferenceTypeByID("RecipeToIngredient");
var recSRRefType = step.getReferenceTypeHome().getReferenceTypeByID("RecipeToSubRecipe");
var recGCSRRefType = step.getReferenceTypeHome().getReferenceTypeByID("RecipetoGCSubRecipe");
var DRtoUPRefType = step.getReferenceTypeHome().getReferenceTypeByID("Upgrade");
var UPtoSRRefType = step.getReferenceTypeHome().getReferenceTypeByID("UpgradetoSubRecipe");

var result1 = getMenuNutritionContent1(node);
var result2 = getMenuNutritionContent2(node, Flag);
Flag = "N";
var result3 = getMenuNutritionContent2(node, Flag);
logger.info(result3);
createMenuNutritionAsset(result1, "report1");
createMenuNutritionAsset(result2, "report2");
createMenuNutritionAsset(result3, "report3");
//createMenuNutritionAsset(result2, "report2");


function getMenuNutritionContent1(node) {
    var htmlContent = '';

    var table_style = 'table, th, td {border:1px solid black; border-collapse: collapse;}';
    var menu_style1 = '.MenuDetails1{background-color:#4472C4;text-align: center;color:white}';
    var menu_style2 = '.MenuDetails2{background-color:#9BC2E6;text-align: center;}';
    var item_style1 = '.ItemDetails1{  background-color:#ED7D31;text-align: center;color:white}';
    var item_style2 = '.ItemDetails2{  background-color:#F8CBAD;text-align: center;}';
    var nutrition_style1 = '.NutritionDetails1{  background-color:#70AD47;text-align: center;color:white}';
    var nutrition_style2 = '.NutritionDetails2{  background-color:#A9D08E;text-align: center;}';

    var reportStyle = '<style>' + table_style + menu_style1 + menu_style2 + item_style1 + item_style2 + nutrition_style1 + nutrition_style2 + '</style>';

    var ColHeader1 = '';
    ColHeader1 = ColHeader1 + '<td class="MenuDetails1" colspan="3">MENU Details</td>';
    ColHeader1 = ColHeader1 + '<td class="ItemDetails1" colspan="7">ITEM Details</td>';
    ColHeader1 = ColHeader1 + '<td class="NutritionDetails1" colspan="8">DISH RECIPE - NUTRITION (Per Portion)</td>';
    ColHeader1 = '<tr>' + ColHeader1 + '</tr>';

    var ColHeader2 = '';
    ColHeader2 = ColHeader2 + '<td class="MenuDetails2"><b>' + "Brand" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="MenuDetails2"><b>' + "MENU Name" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="MenuDetails2"><b>' + "Course" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Object Type" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Core RECIPE" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Item ID" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Item Name" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Portion Serving" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Total Weight" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Weight Per Portion" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Energy (KJ)" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Energy (Kcal)" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Fat (g)" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Saturates (g)" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Carbohydrate (g)" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Sugars (g)" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Protein (g)" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Salt (g)" + '</b></td>';

    ColHeader2 = '<tr>' + ColHeader2 + '</tr>';


    var dishArr = [];
    var subMenuArr = [];
    for (var i = 0; i < 2; i++) {
        subMenuArr[i] = [];
    }

    var menuSubMenus = node.getChildren();
    if (menuSubMenus.size() <= 0 || menuSubMenus.size() == null) {
        allHTMLContent = 'This Menu "' + node.getName() + '" does not have any Sub-Menu included';
        return allHTMLContent;
    } else {
        for (var a = 0; a < menuSubMenus.size(); a++) {
            var currSM = menuSubMenus.get(a);
            if (currSM.getObjectType().getID() == "SubMenu") {
                if (currSM.getValue("ShowonDigitalMenu").getSimpleValue() == "Yes") {
                    subMenuArr[0].push(menuSubMenus.get(a));
                    subMenuArr[1].push(currSM.getValue("subMenuSortOrder").getSimpleValue());
                }
            } else if (currSM.getObjectType().getID() == "SubMenuASGCUPSR") {
                if (currSM.getName() == "Upgrade") {
                    SubMenuASGCUPSR_UP = currSM;
                    flag_Upgrade = "Yes";
                }
            }
        }
        subMenuArr = sortingSM(subMenuArr, subMenuArr[0].length);

        // push UPGRADE SUbMENU Type into subMenuArr here at the end of the subMenuArr
        // 
        if (flag_Upgrade == "Yes") {
            subMenuArr[0].push(SubMenuASGCUPSR_UP);
            subMenuArr[1].push(0);
        }

        for (var a = 0; a < subMenuArr[0].length; a++) {
            dishArr = [];
            dishGCSRUnique = [];
            dishGCSRUniqueArray = [];
            var currSM = subMenuArr[0][a];
            var pLinks = currSM.getClassificationProductLinks().iterator();
            while (pLinks.hasNext()) {
                var currPLink = pLinks.next();
                var currDish = currPLink.getProduct();
                if (currDish.getObjectType().getID() == "DishRecipe") {
                    dishArr.push(currDish);
                } else if (currDish.getObjectType().getID() == "UpgradeObj") {
                    dishArr.push(currDish);
                }
            }
            if (dishArr.length > 0) {
                dishArr = sortingRec(dishArr, dishArr.length);

                for (var i = 0; i < dishArr.length; i++) {
                    if (dishArr[i].getObjectType().getID() == "DishRecipe") {
                        if (currSM.getValue("ShowGCWithRecipe").getSimpleValue() == "No") {
							logger.info("12");
                            // ING and SR check
                            var showDishANData = dishArr[i].getValue("ShowAN_From_DishRecipe").getSimpleValue();
                            if (showDishANData == "Yes") {
                                //Print Dish Recipes
                                htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report1");
                            } else {
								htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report1");
                                htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report1");
                            }
                        } else {
							logger.info("13");
                            var showDishANData = dishArr[i].getValue("ShowAN_From_DishRecipe").getSimpleValue();
                            if (showDishANData == "Yes") {
                                //Print Dish Recipes
                                htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report1");
                            } else {
                                //Call Function to Print from ING and SR
								htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report1");
                                htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report1");
                            }
                            //Print GCSR
                            var currDishGCSRRefs = dishArr[i].getReferences(recGCSRRefType).iterator();
                            while (currDishGCSRRefs.hasNext()) {
                                var currDishGCSRRef = currDishGCSRRefs.next();
                                var currDishGCSR = currDishGCSRRef.getTarget();
                                var currDishGCSRID = currDishGCSR.getID();
                                if (currDishGCSRRef.getValue("IncludeGCSRinDigMenu").getSimpleValue() != "No") {
                                    if (!dishGCSRUnique.includes(currDishGCSRID)) {
                                        dishGCSRUnique.push(currDishGCSRID);
                                        dishGCSRUniqueArray.push(currDishGCSR);
                                        htmlContent = htmlContent + getCoreDishContent(currSM, currDishGCSR, dishArr[i], "report1");
                                    }
                                }
                            }
                        }
                    } else // Upgrade
                    {
                        //Print Upgrade
                        htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report1");
                    }
                }

                if (currSM.getValue("ShowGCWithRecipe").getSimpleValue() == "No") {
                    var dishGCSRUnique = [];
                    for (var i = 0; i < dishArr.length; i++) {
                        if (dishArr[i].getObjectType().getID() == "DishRecipe") {
                            var currDishGCSRRefs = dishArr[i].getReferences(recGCSRRefType).iterator();
                            while (currDishGCSRRefs.hasNext()) {
                                var currDishGCSRRef = currDishGCSRRefs.next();
                                var currDishGCSR = currDishGCSRRef.getTarget();
                                var currDishGCSRID = currDishGCSR.getID();

                                if (currDishGCSRRef.getValue("IncludeGCSRinDigMenu").getSimpleValue() != "No") {

                                    if (!dishGCSRUnique.includes(currDishGCSRID)) {
                                        dishGCSRUnique.push(currDishGCSRID);
                                        htmlContent = htmlContent + getCoreDishContent(currSM, currDishGCSR, currSM.getValue("SMGCName").getSimpleValue(), "report1");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        htmlContent = ColHeader1 + ColHeader2 + htmlContent;

        var result = '<html>' + reportStyle + '<body><table style="width:100%">' + htmlContent + '</table></body></html>';
        return result;
    }
}

function getMenuNutritionContent2(node, Flag) {
	logger.info(Flag);
    var htmlContent = '';

    var table_style = 'table, th, td {border:1px solid black; border-collapse: collapse;}';
    var menu_style1 = '.MenuDetails1{background-color:#4472C4;text-align: center;color:white}';
    var menu_style2 = '.MenuDetails2{background-color:#9BC2E6;text-align: center;}';
    var item_style1 = '.ItemDetails1{  background-color:#ED7D31;text-align: center;color:white}';
    var item_style2 = '.ItemDetails2{  background-color:#F8CBAD;text-align: center;}';
    var nutrition_style1 = '.NutritionDetails1{  background-color:#70AD47;text-align: center;color:white}';
    var nutrition_style2 = '.NutritionDetails2{  background-color:#A9D08E;text-align: center;}';
    var allergen_style = '.AllergenDetails {background-color:#4472C4;text-align: center;color:white}';
    var reportStyle = '<style>' + table_style + menu_style1 + menu_style2 + item_style1 + item_style2 + nutrition_style1 + nutrition_style2 + allergen_style + '</style>';

    var ColHeader1 = '';
    ColHeader1 = ColHeader1 + '<td class="MenuDetails1" colspan="3">MENU Details</td>';
    ColHeader1 = ColHeader1 + '<td class="ItemDetails1" colspan="12">ITEM Details</td>';
	if(Flag == "Y"){
    ColHeader1 = ColHeader1 + '<td class="NutritionDetails1" colspan="8">NUTRITION (Per Portion)</td>';
	}
    ColHeader1 = ColHeader1 + '<td class="AllergenDetails" colspan="50">ALLERGEN Details</td>';

    ColHeader1 = '<tr>' + ColHeader1 + '</tr>';

    var ColHeader2 = '';
    ColHeader2 = ColHeader2 + '<td class="MenuDetails2"><b>' + "Brand" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="MenuDetails2"><b>' + "MENU Name" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="MenuDetails2"><b>' + "Course" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Object Type" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Core RECIPE" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Item ID" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Item Name" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Portion Serving" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Total Weight / Base Unit Used" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Weight Per Portion" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Usage Unit" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Base Unit" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "NSF Yield" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Cooked Weight" + '</b></td>';

    ColHeader2 = ColHeader2 + '<td class="ItemDetails2"><b>' + "Volume Of An Each" + '</b></td>';
    if (Flag == "Y") {
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Energy (KJ)" + '</b></td>';
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Energy (Kcal)" + '</b></td>';
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Fat (g)" + '</b></td>';
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Saturates (g)" + '</b></td>';
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Carbohydrate (g)" + '</b></td>';
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Sugars (g)" + '</b></td>';
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Protein (g)" + '</b></td>';
        ColHeader2 = ColHeader2 + '<td class="NutritionDetails2"><b>' + "Salt (g)" + '</b></td>';
    }
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Cereals containing Gluten - Wheat?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Wheat?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Cereals containing Gluten - Rye?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Rye?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Cereals containing Gluten - Barley?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Barley?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Cereals containing Gluten - Oats?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Oats?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Crustaceans Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Crustaceans or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Egg Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Egg or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Fish Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Fish or Products thereof?" + '</b></td>';

    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Peanut Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Peanut or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Soya Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Soya or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Milk Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Milk or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Almond?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Almond?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Hazelnut?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Hazelnut?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Walnut?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Walnut?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Cashew?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Cashew?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Pecan?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Pecan?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Brazil?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Brazil?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Pistachio?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Pistachio?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Tree Nuts -  Macadamia?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross Contamination from Macadamia?" + '</b></td>';

    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Celery Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Celery or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Mustard Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Mustard or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Sesame Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Sesame or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Sulphites" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Sulphites?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Sulphites Above 10ppm" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Sulphites above 10ppm?" + '</b></td>';

    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Lupin Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Lupin or Products thereof?" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Contains Molluscs Or Products thereof" + '</b></td>';
    ColHeader2 = ColHeader2 + '<td class="AllergenDetails"><b>' + "Cross contamination from Molluscs or Products thereof?" + '</b></td>';


    ColHeader2 = '<tr>' + ColHeader2 + '</tr>';


    var dishArr = [];
    var subMenuArr = [];
    for (var i = 0; i < 2; i++) {
        subMenuArr[i] = [];
    }

    var menuSubMenus = node.getChildren();
    if (menuSubMenus.size() <= 0 || menuSubMenus.size() == null) {
        allHTMLContent = 'This Menu "' + node.getName() + '" does not have any Sub-Menu included';
        return allHTMLContent;
    } else {
        for (var a = 0; a < menuSubMenus.size(); a++) {
            var currSM = menuSubMenus.get(a);
            if (currSM.getObjectType().getID() == "SubMenu") {
                if (currSM.getValue("ShowonDigitalMenu").getSimpleValue() == "Yes") {
                    subMenuArr[0].push(menuSubMenus.get(a));
                    subMenuArr[1].push(currSM.getValue("subMenuSortOrder").getSimpleValue());
                }
            }
            //	changed here LC
            /*
            else if (currSM.getObjectType().getID() == "SubMenuASGCUPSR")
            {
                if (currSM.getName() == "Upgrade")
                {
                    SubMenuASGCUPSR_UP = currSM;
                    flag_Upgrade = "Yes";
                }
            }*/
        }
        subMenuArr = sortingSM(subMenuArr, subMenuArr[0].length);

        // push UPGRADE SUbMENU Type into subMenuArr here at the end of the subMenuArr
        // 
        if (flag_Upgrade == "Yes") {
            subMenuArr[0].push(SubMenuASGCUPSR_UP);
            subMenuArr[1].push(0);
        }

        for (var a = 0; a < subMenuArr[0].length; a++) {
            dishArr = [];
            dishGCSRUnique = [];
            DRUP = [];
            dishGCSRUniqueArray = [];
            dishGCSRUniqueArray1 = [];
            var currSM = subMenuArr[0][a];
            var pLinks = currSM.getClassificationProductLinks().iterator();
            while (pLinks.hasNext()) {
                var currPLink = pLinks.next();
                var currDish = currPLink.getProduct();
                if (currDish.getObjectType().getID() == "DishRecipe") {
                    dishArr.push(currDish);
                }
                // Changed here LC
                /*
                else if (currDish.getObjectType().getID() == "UpgradeObj")
                {
                    dishArr.push(currDish);
                }*/
            }
            if (dishArr.length > 0) {
                dishArr = sortingRec(dishArr, dishArr.length);

                for (var i = 0; i < dishArr.length; i++) {
                    if (dishArr[i].getObjectType().getID() == "DishRecipe") {
                        if (currSM.getValue("ShowGCWithRecipe").getSimpleValue() == "No") {
                            // ING and SR check
                            var showDishANData = dishArr[i].getValue("ShowAN_From_DishRecipe").getSimpleValue();
                            if (showDishANData == "Yes") 
                            {
								if(Flag == "Y"){
                            htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report2");
                            //htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report2");
							}
							else
							{
								htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report3");
                           // htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report3");
							}
							}
							else{
                            //Print Dish Recipes
							if(Flag == "Y"){
                            htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report2");
                            htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report2");
							}
							else
							{
								htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report3");
                            htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report3");
							}
							}

                            //changed here LC Added this code
                            var currDishUPRefs = dishArr[i].getReferences(DRtoUPRefType).iterator();
                            while (currDishUPRefs.hasNext()) {
                                var currDishUPRef = currDishUPRefs.next();
                                var currDishUP = currDishUPRef.getTarget();
                                var currDishUPID = currDishUP.getID();
								if(Flag == "Y")
								{
                                htmlContent = htmlContent + getCoreDishContent(currSM, currDishUP, dishArr[i], "report2");
								}
								else
								{
									 htmlContent = htmlContent + getCoreDishContent(currSM, currDishUP, dishArr[i], "report3");
								}
                                var UPtoSRRefs = currDishUP.getReferences(UPtoSRRefType).iterator();
                                // if (currDishUPRef.getValue("IncludeGCSRinDigMenu").getSimpleValue() != "No")
                                // {
                                while (UPtoSRRefs.hasNext()) {
                                    var currUPSRRef = UPtoSRRefs.next();
                                    var currSR = currUPSRRef.getTarget();
                                    var currSRID = currSR.getID();

                                    //if (!DRUP.includes(currDishUPID))
                                    //{
                                    // DRUP.push(currDishUPID);
                                    //dishGCSRUniqueArray1.push(currDishUP);
									if(Flag == "Y")
									{
                                    htmlContent = htmlContent + getCoreDishContent(currSM, currSR, dishArr[i], "report2", "UPSR");
									}
									else
									{
										 htmlContent = htmlContent + getCoreDishContent(currSM, currSR, dishArr[i], "report3", "UPSR");
									}
                                    // getIngSRContent
                                    //  htmlContent = htmlContent + getIngSRContent(currSM, currSR, "report2", "UPSR");
                                    //}
                                }
                                //}
                            }




                            //}
                            //	else
                            //	{
                            //	htmlContent=htmlContent+getIngSRContent(currSM,dishArr[i]);
                            //}
                        } else {
                            var showDishANData = dishArr[i].getValue("ShowAN_From_DishRecipe").getSimpleValue();
                            	if (showDishANData == "Yes") 
                            	{
                            //Print Dish Recipes
							if(Flag == "Y")
							{
                            htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report2");
                         //   htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report2");
							}
							else
							{
							htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report3");
                          //  htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report3");
							}
								}
								else
								{
									if(Flag == "Y")
							{
                            htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report2");
                            htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report2");
							}
							else
							{
							htmlContent = htmlContent + getCoreDishContent(currSM, dishArr[i], "", "report3");
                            htmlContent = htmlContent + getIngSRContent(currSM, dishArr[i], "report3");
							}
									
								}
							
                            //}
                            //	else
                            //	{
                            //Call Function to Print from ING and SR
                            //htmlContent=htmlContent+getIngSRContent(currSM,dishArr[i]);
                            //}
                            //Print GCSR
                            var currDishGCSRRefs = dishArr[i].getReferences(recGCSRRefType).iterator();
                            while (currDishGCSRRefs.hasNext()) {
                                var currDishGCSRRef = currDishGCSRRefs.next();
                                var currDishGCSR = currDishGCSRRef.getTarget();
                                var currDishGCSRID = currDishGCSR.getID();
                                if (currDishGCSRRef.getValue("IncludeGCSRinDigMenu").getSimpleValue() != "No") {
                                    if (!dishGCSRUnique.includes(currDishGCSRID)) {
                                        dishGCSRUnique.push(currDishGCSRID);
                                        dishGCSRUniqueArray.push(currDishGCSR);
										if(Flag == "Y")
										{
											htmlContent = htmlContent + getCoreDishContent(currSM, currDishGCSR, dishArr[i], "report2");
										}
										else
										{
											htmlContent = htmlContent + getCoreDishContent(currSM, currDishGCSR, dishArr[i], "report3");
										}
                                    }
                                }
                            }


                            //changed here LC Added this code
                            var currDishUPRefs = dishArr[i].getReferences(DRtoUPRefType).iterator();
                            while (currDishUPRefs.hasNext()) {
                                var currDishUPRef = currDishUPRefs.next();
                                var currDishUP = currDishUPRef.getTarget();
                                var currDishUPID = currDishUP.getID();
                                //htmlContent = htmlContent + getCoreDishContent(currSM, currDishUP, dishArr[i], "report2");
                                var UPtoSRRefs = currDishUP.getReferences(UPtoSRRefType).iterator();
                                // if (currDishUPRef.getValue("IncludeGCSRinDigMenu").getSimpleValue() != "No")
                                // {
                                while (UPtoSRRefs.hasNext()) {
                                    var currUPSRRef = UPtoSRRefs.next();
                                    var currSR = currUPSRRef.getTarget();
                                    var currSRID = currSR.getID();

                                    //if (!DRUP.includes(currDishUPID))
                                    //{
                                    // DRUP.push(currDishUPID);
                                    //dishGCSRUniqueArray1.push(currDishUP);
									if(Flag == "Y")
									{
										htmlContent = htmlContent + getCoreDishContent(currSM, currSR, dishArr[i], "report2", "UPSR");
									}
									else
									{
										htmlContent = htmlContent + getCoreDishContent(currSM, currSR, dishArr[i], "report3", "UPSR");
									}
                                    // htmlContent = htmlContent + getIngSRContent(currSM, currSR, "report2", "UPSR");
                                    //}
                                }
                                //}
                            }
                        }
                    }
                    //changed here LC
                    /*
                                        else // Upgrade
                                        {
                                        //Print Upgrade
                                        htmlContent=htmlContent+getCoreDishContent(currSM,dishArr[i],"");
                                        }*/
                }

                if (currSM.getValue("ShowGCWithRecipe").getSimpleValue() == "No") {
                    var dishGCSRUnique = [];
                    for (var i = 0; i < dishArr.length; i++) {
                        if (dishArr[i].getObjectType().getID() == "DishRecipe") {
                            var currDishGCSRRefs = dishArr[i].getReferences(recGCSRRefType).iterator();
                            while (currDishGCSRRefs.hasNext()) {
                                var currDishGCSRRef = currDishGCSRRefs.next();
                                var currDishGCSR = currDishGCSRRef.getTarget();
                                var currDishGCSRID = currDishGCSR.getID();

                                if (currDishGCSRRef.getValue("IncludeGCSRinDigMenu").getSimpleValue() != "No") {

                                    if (!dishGCSRUnique.includes(currDishGCSRID)) {
                                        dishGCSRUnique.push(currDishGCSRID);
										if(Flag == "Y")
										{
											htmlContent = htmlContent + getCoreDishContent(currSM, currDishGCSR, currSM.getValue("SMGCName").getSimpleValue(), "report2");
										}
										else
										{
											htmlContent = htmlContent + getCoreDishContent(currSM, currDishGCSR, currSM.getValue("SMGCName").getSimpleValue(), "report3");
										}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        htmlContent = ColHeader1 + ColHeader2 + htmlContent;

        var result = '<html>' + reportStyle + '<body><table style="width:100%">' + htmlContent + '</table></body></html>';
        Flag = "N";
        return result;
    }
}

function createMenuNutritionAsset(result, type) {
    if (type == "report1") {
        var input = cleanString(result);
        var intStream = stringToBytes(String(input));
        var inputStream = new java.io.ByteArrayInputStream(intStream);
        var menuNutritionID = node.getID() + "_MenuNutrition_Report1";
        var menuNutritionName = node.getName() + " - Menu Nutrition Report 1_Claire";
        var menuNutrition = step.getAssetHome().getAssetByID(menuNutritionID);

        if (menuNutrition == null) {
            logger.info("check1");
            menuNutrition = MenuNutritionFolder1.createAsset(menuNutritionID, "Asset user-type root");
            menuNutrition.setName(menuNutritionName);
        }
        logger.info("check2");
        menuNutrition.upload(inputStream, menuNutritionName + ".html");

        try {
            menuNutrition.approve();
        } catch (e) {
            throw "There are some problem Approving the File. Please report to STEP team."
        }

        var refs = step.getReferenceTypeHome().getReferenceTypeByID("MenuNutritionReportRef");
        var clsRef = node.getReferences(refs).toArray();
        if (clsRef.length == 0) {
            node.createReference(step.getAssetHome().getAssetByID(menuNutritionID), "MenuNutritionReportRef");
        }

    }

    if (type == "report2") {
        var input = cleanString(result);
        var intStream = stringToBytes(String(input));
        var inputStream = new java.io.ByteArrayInputStream(intStream);
        //logger.info("Yes 2");
        var menuNutritionID = node.getID() + "_MenuNutrition_Report2";
        var menuNutritionName = node.getName() + " - Menu Nutrition Report 2_Jana";
        var menuNutrition = step.getAssetHome().getAssetByID(menuNutritionID);

        if (menuNutrition == null) {
            menuNutrition = MenuNutritionFolder2.createAsset(menuNutritionID, "Asset user-type root");
            menuNutrition.setName(menuNutritionName);
        }
        menuNutrition.upload(inputStream, menuNutritionName + ".html");

        try {
            menuNutrition.approve();
        } catch (e) {
            throw "There are some problem Approving the File. Please report to STEP team."
        }

        var refs = step.getReferenceTypeHome().getReferenceTypeByID("MenuNutritionReportRef2");
        var clsRef = node.getReferences(refs).toArray();
        if (clsRef.length == 0) {
            node.createReference(step.getAssetHome().getAssetByID(menuNutritionID), "MenuNutritionReportRef2");
        }
    }

    if (type == "report3") {
        var input = cleanString(result);
        var intStream = stringToBytes(String(input));
        var inputStream = new java.io.ByteArrayInputStream(intStream);
        //logger.info("Yes 2");
        var menuNutritionID = node.getID() + "_MenuNutrition_Report3";
        var menuNutritionName = node.getName() + " - Menu Nutrition Report 3_Jana";
        var menuNutrition = step.getAssetHome().getAssetByID(menuNutritionID);

        if (menuNutrition == null) {
            menuNutrition = MenuNutritionFolder2.createAsset(menuNutritionID, "Asset user-type root");
            menuNutrition.setName(menuNutritionName);
        }
        menuNutrition.upload(inputStream, menuNutritionName + ".html");

        try {
            menuNutrition.approve();
        } catch (e) {
            throw "There are some problem Approving the File. Please report to STEP team."
        }

        var refs = step.getReferenceTypeHome().getReferenceTypeByID("MenuNutReport2withoutNutrition");
        var clsRef = node.getReferences(refs).toArray();
        if (clsRef.length == 0) {
            node.createReference(step.getAssetHome().getAssetByID(menuNutritionID), "MenuNutReport2withoutNutrition");
        }
    }

}

function stringToBytes(val) {
    const result = [];
    for (var i = 0; i < val.length; i++) {
        result.push(val.charCodeAt(i));
    }
    return result;
}

function cleanString(input) {
    input = String(input);
    var output = "";
    input = input.replace(/undefined/g, "");
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

function sortingSM(arr, length) {
    if (length > 1) {
        for (var i = 0; i < length - 1; i++) {
            for (var j = i + 1; j < length; j++) {
                if (Number(arr[1][i]) > Number(arr[1][j]) || (Number(arr[1][i]) === Number(arr[1][j]) && i > j)) {
                    var temp = Number(arr[1][i]);
                    arr[1][i] = Number(arr[1][j]);
                    arr[1][j] = temp;

                    temp = arr[0][i];
                    arr[0][i] = arr[0][j];
                    arr[0][j] = temp;
                }
            }
        }
        return arr;
    } else {
        return arr;
    }
}

function sortingRec(arr, length) {
    if (length > 1) {
        for (var i = 0; i < length - 1; i++) {
            for (var j = i + 1; j < length; j++) {
                if (arr[i].getValue("DigitalMenuName_NSF").getSimpleValue() > arr[j].getValue("DigitalMenuName_NSF").getSimpleValue() || (arr[i].getValue("DigitalMenuName_NSF").getSimpleValue() === arr[j].getValue("DigitalMenuName_NSF").getSimpleValue() && i > j)) {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    } else {
        return arr;
    }
}

function sortingGCSR(arr, length) {
    if (length > 1) {
        for (var i = 0; i < length - 1; i++) {
            for (var j = i + 1; j < length; j++) {
                var compTo = step.getProductHome().getProductByID(arr[i]);
                var compwith = step.getProductHome().getProductByID(arr[j]);
                if (compTo.getValue("DigitalMenuName_NSF").getSimpleValue() > compwith.getValue("DigitalMenuName_NSF").getSimpleValue() || (compTo.getValue("DigitalMenuName_NSF").getSimpleValue() === compwith.getValue("DigitalMenuName_NSF").getSimpleValue() && i > j)) {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    } else {
        return arr;
    }
}

function getCoreDishContent(currSM, item, itemDish, reporttype, UPSR) {
    var keyItemDetails = '';
    var subMenuName = currSM.getName();
    var ObjectType = item.getObjectType().getID();
    var CoreDishID = "";
    var ItemID = "";

    if (ObjectType == "GCSubRecipe") {
        ObjectType = "Guest Choice";
        if (itemDish == currSM.getValue("SMGCName").getSimpleValue()) {
            CoreDishID = currSM.getValue("SMGCName").getSimpleValue();
        } else {
            CoreDishID = itemDish.getID();
        }
        ItemID = item.getValue("SourceGCSRID").getSimpleValue();
    }
    /* else if (ObjectType == "UpgradeObj")
    {
        ObjectType = "Upgrade";
		
		
		//changed here LC
		
				var UPtoSRRefs = item.getReferences(UPtoSRRefType).iterator();
                               
								   while (UPtoSRRefs.hasNext())
                            {
								var currUPSRRef = UPtoSRRefs.next();
                                var currSR = currUPSRRef.getTarget();
                                //var currSRID = currSR.getID();
								
                                 
                                        //htmlContent = htmlContent + getCoreDishContent(currSM, "SR"+currSR, "", "report2","UPSR");
									 
							}
		
		
		
		
        CoreDishID = itemDish.getID();
        ItemID =  currSR.getID();
    }*/
    else {
        if (UPSR == "UPSR") {
            ObjectType = "Upgrade";
            CoreDishID = itemDish.getID();
            ItemID = item.getID();
        } else {
            CoreDishID = item.getID();
            ItemID = item.getID();
        }
    }
    var ItemName = item.getValue("DigitalMenuName_NSF").getSimpleValue();

    keyItemDetails = keyItemDetails + '<td>' + brand + '</td>';
    keyItemDetails = keyItemDetails + '<td>' + node.getName() + '</td>';
    keyItemDetails = keyItemDetails + '<td>' + subMenuName + '</td>';
    //  if(ObjectType == "DishRecipe")
    if (reporttype == "report1") {
        keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
    }
    if (reporttype == "report2" || reporttype == "report3") {
        if (ObjectType == "DishRecipe") {
            keyItemDetails = keyItemDetails + '<td style="background-color: green;">' + ObjectType + '</td>';
        } else if (ObjectType == "Ingredient") {
            keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
        } else if (ObjectType == "Guest Choice") {
            keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
        } else if (ObjectType == "Upgrade") {
            keyItemDetails = keyItemDetails + '<td style="background-color: Red;">' + ObjectType + '</td>';
        } else {

            keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
        }
    }
    keyItemDetails = keyItemDetails + '<td>' + CoreDishID + '</td>';
    keyItemDetails = keyItemDetails + '<td>' + ItemID + '</td>';

    keyItemDetails = keyItemDetails + '<td>' + ItemName + '</td>';

    var dishPortion = item.getValue("DishPortionServing").getSimpleValue();
    if (dishPortion == 0 || dishPortion == null) {
        dishPortion = 1;
    }
    var totalWeight = item.getValue("TotalWeight").getSimpleValue();
    if (reporttype == "report2" || reporttype == "report3") {
        var UsageUnit = item.getValue("UsageUnit").getSimpleValue();
        var BaseUnit = item.getValue("BaseUnit").getSimpleValue();
        var VolumeofAnEach = item.getValue("VolumeOfAnEach").getSimpleValue();
    }

    var portionWeight = totalWeight / dishPortion;
    keyItemDetails = keyItemDetails + '<td>' + dishPortion + '</td>';
    keyItemDetails = keyItemDetails + '<td>' + totalWeight + '</td>';
    keyItemDetails = keyItemDetails + '<td>' + portionWeight + '</td>';

    if (reporttype == "report2" || reporttype == "report3") {
        keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
        keyItemDetails = keyItemDetails + '<td>' + 'g' + '</td>';
        keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
        keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
        keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
    }
    var contentItemDIVDishNutritionAllergen;
	var contentItemDIVDishNutrition = ItemNutrition(item, "Core");
    var contentItemDIVDishAllergen = ItemAllergen(item, "Core");

		if(reporttype == "report1"){
    contentItemDIVDishNutrition = '<tr>' + keyItemDetails + contentItemDIVDishNutrition + '</tr>';
    return (contentItemDIVDishNutrition);
}

 if (reporttype == "report2"){

    contentItemDIVDishNutritionAllergen = '<tr>' + keyItemDetails + contentItemDIVDishNutrition + contentItemDIVDishAllergen + '</tr>';
    return (contentItemDIVDishNutritionAllergen);
	}
	
	if (reporttype == "report3"){

    contentItemDIVDishNutritionAllergen = '<tr>' + keyItemDetails  + contentItemDIVDishAllergen + '</tr>';
    return (contentItemDIVDishNutritionAllergen);
	}
}

function getIngSRContent(currSM, item, reporttype, UPSR) {
    var keyItemDetails = '';
    var subMenuName = currSM.getName();
    var CoreDishID = item.getID();
    var contentItemDIVDishNutrition = '';
    var contentItemDIVDishAllergen = '';
    var contentItemDIVDishNutritionAllergen = '';
    if (UPSR != "UPSR")

    {
        var currDishIngRefs = item.getReferences(recIngRefType).iterator();
        while (currDishIngRefs.hasNext()) {
            var currIngRef = currDishIngRefs.next();

            if (reporttype == "report1") {
                var showDishRefANData = currIngRef.getValue("IncludeIngSRIn_DigitalMenu").getSimpleValue();
                if (showDishRefANData != "No") {
                    var ObjectType = currIngRef.getTarget().getObjectType().getID();
                    var ItemID = currIngRef.getTarget().getID();
                    var ItemName = currIngRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();
                    keyItemDetails = '';
                    keyItemDetails = keyItemDetails + '<td>' + brand + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + node.getName() + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + subMenuName + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + CoreDishID + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + ItemID + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + ItemName + '</td>';

                    keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                    keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
				
                    contentItemDIVDishNutritionAllergen = contentItemDIVDishNutritionAllergen + contentItemDIVDishNutrition + '<tr>' + keyItemDetails + ItemNutrition(currIngRef.getTarget(), currIngRef) + '</tr>';
                }
            }

            if (reporttype == "report2") {
                var UsageUnit = currIngRef.getTarget().getValue("UsageUnit").getSimpleValue();
                var BaseUnit = currIngRef.getValue("IngredientBaseUnit").getSimpleValue();
                var BaseUnitUsed = currIngRef.getValue("IngredientBaseUnitsUsed").getSimpleValue();
                var NSFYield = currIngRef.getValue("NSFYield_RecipeToIng").getSimpleValue();
                var CookedWeightOfRecipe = currIngRef.getValue("WeightOfAnEach_NSF").getSimpleValue();
                var VolumeofAnEach = currIngRef.getValue("VolumeOfAnEach").getSimpleValue();

                var ObjectType = currIngRef.getTarget().getObjectType().getID();
                var ItemID = currIngRef.getTarget().getID();
                var ItemName = currIngRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();
                keyItemDetails = '';
                keyItemDetails = keyItemDetails + '<td>' + brand + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + node.getName() + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + subMenuName + '</td>';
                if (ObjectType == "DishRecipe") {
                    keyItemDetails = keyItemDetails + '<td style="background-color: green;">' + ObjectType + '</td>';
                } else if (ObjectType == "Ingredient") {
                    //logger.info("inside ING");
                    //logger.info(keyItemDetails);
                    keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
                } else if (ObjectType == "Guest Choice") {
                    keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
                } else if (ObjectType == "Upgrade") {
                    keyItemDetails = keyItemDetails + '<td style="background-color: Red;">' + ObjectType + '</td>';
                } else {

                    keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
                }
                keyItemDetails = keyItemDetails + '<td>' + CoreDishID + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + ItemID + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + ItemName + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + BaseUnitUsed + '</td>';

                keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + UsageUnit + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + BaseUnit + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + NSFYield + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + CookedWeightOfRecipe + '</td>';

                keyItemDetails = keyItemDetails + '<td>' + VolumeofAnEach + '</td>';
                //logger.info(keyItemDetails);
                contentItemDIVDishNutritionAllergen = contentItemDIVDishNutrition + contentItemDIVDishAllergen + '<tr>' + keyItemDetails + ItemNutrition(currIngRef.getTarget(), currIngRef) + ItemAllergen(currIngRef.getTarget(), currIngRef) + '</tr>';
            }
			
			         if (reporttype == "report3") {
                var UsageUnit = currIngRef.getTarget().getValue("UsageUnit").getSimpleValue();
                var BaseUnit = currIngRef.getValue("IngredientBaseUnit").getSimpleValue();
                var BaseUnitUsed = currIngRef.getValue("IngredientBaseUnitsUsed").getSimpleValue();
                var NSFYield = currIngRef.getValue("NSFYield_RecipeToIng").getSimpleValue();
                var CookedWeightOfRecipe = currIngRef.getValue("WeightOfAnEach_NSF").getSimpleValue();
                var VolumeofAnEach = currIngRef.getValue("VolumeOfAnEach").getSimpleValue();

                var ObjectType = currIngRef.getTarget().getObjectType().getID();
                var ItemID = currIngRef.getTarget().getID();
                var ItemName = currIngRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();
                keyItemDetails = '';
                keyItemDetails = keyItemDetails + '<td>' + brand + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + node.getName() + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + subMenuName + '</td>';
                if (ObjectType == "DishRecipe") {
                    keyItemDetails = keyItemDetails + '<td style="background-color: green;">' + ObjectType + '</td>';
                } else if (ObjectType == "Ingredient") {
                    //logger.info("inside ING");
                    //logger.info(keyItemDetails);
                    keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
                } else if (ObjectType == "Guest Choice") {
                    keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
                } else if (ObjectType == "Upgrade") {
                    keyItemDetails = keyItemDetails + '<td style="background-color: Red;">' + ObjectType + '</td>';
                } else {

                    keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
                }
                keyItemDetails = keyItemDetails + '<td>' + CoreDishID + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + ItemID + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + ItemName + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + BaseUnitUsed + '</td>';

                keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + UsageUnit + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + BaseUnit + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + NSFYield + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + CookedWeightOfRecipe + '</td>';

                keyItemDetails = keyItemDetails + '<td>' + VolumeofAnEach + '</td>';
                //logger.info(keyItemDetails);
                contentItemDIVDishNutritionAllergen = contentItemDIVDishNutritionAllergen + contentItemDIVDishNutrition + contentItemDIVDishAllergen + '<tr>' + keyItemDetails  + ItemAllergen(currIngRef.getTarget(), currIngRef) + '</tr>';
            }
        }
    }
    var currDishSRRefs = item.getReferences(recSRRefType).iterator();
    while (currDishSRRefs.hasNext()) {
        var currSRRef = currDishSRRefs.next();
        if (reporttype == "report1") {
            var showDishRefANData = currSRRef.getValue("IncludeIngSRIn_DigitalMenu").getSimpleValue();
            if (showDishRefANData != "No") {
                var ObjectType = currSRRef.getTarget().getObjectType().getID();
                var ItemID = currSRRef.getTarget().getID();
                var ItemName = currSRRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();
                keyItemDetails = '';
                keyItemDetails = keyItemDetails + '<td>' + brand + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + node.getName() + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + subMenuName + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + CoreDishID + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + ItemID + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + ItemName + '</td>';

                keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
                keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';

                contentItemDIVDishNutritionAllergen = contentItemDIVDishNutritionAllergen + contentItemDIVDishNutrition + '<tr>' + keyItemDetails + ItemNutrition(currSRRef.getTarget(), currSRRef) + '</tr>';
            }
        }

        if (reporttype == "report2") {
            var UsageUnit = currSRRef.getValue("UsageUnit").getSimpleValue();
            var BaseUnit = currSRRef.getValue("IngredientBaseUnit").getSimpleValue();
            var BaseUnitUsed = currSRRef.getValue("IngredientBaseUnitsUsed").getSimpleValue();
            var NSFYield = currSRRef.getValue("NSFYield_RecipeToSR").getSimpleValue();
            var CookedWeightOfRecipe = currSRRef.getValue("WeightOfAnEach_NSF").getSimpleValue();
            var VolumeofAnEach = currSRRef.getValue("VolumeOfAnEach").getSimpleValue();
            if (UPSR == "UPSR") {
                var ObjectType = "Upgrade";
            } else {
                var ObjectType = currSRRef.getTarget().getObjectType().getID();
            }
            var ItemID = currSRRef.getTarget().getID();
            var ItemName = currSRRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();

            keyItemDetails = '';
            keyItemDetails = keyItemDetails + '<td>' + brand + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + node.getName() + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + subMenuName + '</td>';
            if (ObjectType == "DishRecipe") {
                keyItemDetails = keyItemDetails + '<td style="background-color: blue;">' + ObjectType + '</td>';
            } else if (ObjectType == "Ingredient") {
                keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
            } else if (ObjectType == "Guest Choice") {
                keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
            } else if (ObjectType == "Upgrade") {
                keyItemDetails = keyItemDetails + '<td style="background-color: Red;">' + ObjectType + '</td>';
            } else {

                keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
            }

            keyItemDetails = keyItemDetails + '<td>' + CoreDishID + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + ItemID + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + ItemName + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + BaseUnitUsed + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + UsageUnit + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + BaseUnit + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + NSFYield + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + CookedWeightOfRecipe + '</td>';

            keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';

            contentItemDIVDishNutritionAllergen = contentItemDIVDishNutritionAllergen + contentItemDIVDishNutrition + contentItemDIVDishAllergen + '<tr>' + keyItemDetails + ItemNutrition(currSRRef.getTarget(), currSRRef) + ItemAllergen(currSRRef.getTarget(), currSRRef) + '</tr>';

        }
		
		      if (reporttype == "report3") {
            var UsageUnit = currSRRef.getValue("UsageUnit").getSimpleValue();
            var BaseUnit = currSRRef.getValue("IngredientBaseUnit").getSimpleValue();
            var BaseUnitUsed = currSRRef.getValue("IngredientBaseUnitsUsed").getSimpleValue();
            var NSFYield = currSRRef.getValue("NSFYield_RecipeToSR").getSimpleValue();
            var CookedWeightOfRecipe = currSRRef.getValue("WeightOfAnEach_NSF").getSimpleValue();
            var VolumeofAnEach = currSRRef.getValue("VolumeOfAnEach").getSimpleValue();
            if (UPSR == "UPSR") {
                var ObjectType = "Upgrade";
            } else {
                var ObjectType = currSRRef.getTarget().getObjectType().getID();
            }
            var ItemID = currSRRef.getTarget().getID();
            var ItemName = currSRRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();

            keyItemDetails = '';
            keyItemDetails = keyItemDetails + '<td>' + brand + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + node.getName() + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + subMenuName + '</td>';
            if (ObjectType == "DishRecipe") {
                keyItemDetails = keyItemDetails + '<td style="background-color: blue;">' + ObjectType + '</td>';
            } else if (ObjectType == "Ingredient") {
                keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
            } else if (ObjectType == "Guest Choice") {
                keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
            } else if (ObjectType == "Upgrade") {
                keyItemDetails = keyItemDetails + '<td style="background-color: Red;">' + ObjectType + '</td>';
            } else {

                keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
            }

            keyItemDetails = keyItemDetails + '<td>' + CoreDishID + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + ItemID + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + ItemName + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + BaseUnitUsed + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + UsageUnit + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + BaseUnit + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + NSFYield + '</td>';
            keyItemDetails = keyItemDetails + '<td>' + CookedWeightOfRecipe + '</td>';

            keyItemDetails = keyItemDetails + '<td>' + "" + '</td>';

            contentItemDIVDishNutritionAllergen = contentItemDIVDishNutritionAllergen + contentItemDIVDishNutrition + contentItemDIVDishAllergen + '<tr>' + keyItemDetails + ItemAllergen(currSRRef.getTarget(), currSRRef) + '</tr>';

        }
		
		
        // return (contentItemDIVDishNutrition);
    }
    return (contentItemDIVDishNutritionAllergen);
}

function ItemNutrition(Item, ItemRef) {
    var ObjectType = Item.getObjectType().getID();

    if (ObjectType == "DishRecipe") {
        if (ItemRef == "Core" || ItemRef == "" || ItemRef == null) {
            if (Item.getValue("DishPortionServing").getSimpleValue() == "" || Item.getValue("DishPortionServing").getSimpleValue() == null) {
                var nutrition = [
                    "CertifiedTotalEnergyKJ",
                    "CertifiedTotalEnergyKCal",
                    "CertifiedTotalFat",
                    "CertifiedTotalOfWhichSaturates",
                    "CertifiedTotalCarbohydrates",
                    "CertifiedTotalSugars",
                    "CertifiedTotalProtein",
                    "CertifiedTotalSalt"
                ];
            } else {
                var nutrition = [
                    "CertifiedTotalEnergyKJPerPortion",
                    "CertifiedTotalEnergyKCalPerPortion",
                    "CertifiedTotalFatPerPortion",
                    "CertifiedTotalOfWhichSaturatesPerPortion",
                    "CertifiedTotalCarbohydratesPerPortion",
                    "CertifiedTotalSugarsPerPortion",
                    "CertifiedTotalProteinPerPortion",
                    "CertifiedTotalSaltPerPortion"
                ];
            }
        } else if (ItemRef.getTarget().getObjectType().getID() == "DishRecipe") {
            var nutrition = [
                "DishToIngEnergyKJ",
                "DishToIngEnergy (KCal)",
                "DishToIngFat",
                "DishToIngSaturates",
                "DishToIngCarbohydrates",
                "DishToIngSugars",
                "DishToIngProtein",
                "DishToIngSalt"
            ];
            Item = ItemRef;
        } else {
            ////logger.info("Something went wrong while passing the Function with argument");
        }
    } else if (ObjectType == "GuestChoiceObj" || ObjectType == "GCSubRecipe") {
        var nutrition = [
            "GuestChoiceTotalEnergyKJ",
            "GuestChoiceTotalEnergyKCal",
            "GuestChoiceTotalFat",
            "GuestChoiceTotalOfWhichSaturates",
            "GuestChoiceTotalCarbohydrates",
            "GuestChoiceTotalSugars",
            "GuestChoiceTotalProtein",
            "GuestChoiceTotalSalt"
        ];
    } else if (ObjectType == "UpgradeObj") {
        var nutrition = [
            "UpgradeTotalEnergyKJ",
            "UpgradeTotalEnergyKCal",
            "UpgradeTotalFat",
            "UpgradeTotalOfWhichSaturates",
            "UpgradeTotalCarbohydrates",
            "UpgradeTotalSugars",
            "UpgradeTotalProtein",
            "UpgradeTotalSalt"
        ];
    } else if (ObjectType == "Ingredient") {
        var nutrition = [
            "DishToIngEnergyKJ",
            "DishToIngEnergy (KCal)",
            "DishToIngFat",
            "DishToIngSaturates",
            "DishToIngCarbohydrates",
            "DishToIngSugars",
            "DishToIngProtein",
            "DishToIngSalt"
        ];
        Item = ItemRef;
    }

    var nutritionVal = '';
    var nutritionHtml = '';
    for (var i = 0; i < nutrition.length; i++) {
        if (i == 0 || i == 1) {
            nutritionVal = Number(Item.getValue(nutrition[i]).getSimpleValue()).toFixed(0);
        } else {
            if (i == 7) {
                nutritionVal = Number(Item.getValue(nutrition[i]).getSimpleValue()).toFixed(2);
            } else {
                nutritionVal = Number(Item.getValue(nutrition[i]).getSimpleValue()).toFixed(1);
            }
        }
        nutritionHtml = nutritionHtml + '<td style="border: 1px solid black;padding: 1px;text-align: center;">' + nutritionVal + '</td>';
    }
    return (nutritionHtml);
}

function ItemAllergen(Item, ItemRef) {
    var ObjectType = Item.getObjectType().getID();

    if (ObjectType == "DishRecipe") {
        if (ItemRef == "Core" || ItemRef == "" || ItemRef == null) {
            var allergen = [
                "DishRecipeContainsWheat",
                "DishCrossContaminationByWheat",
                "DishRecipeContainsRye",
                "DishCrossContaminationByRyePPP",
                "DishRecipeContainsBarley",
                "DishCrossContaminationByBarley",
                "DishRecipeContainsOats",
                "DishCrossContaminationByContainsOats",
                "DishRecipeContainsCrustaceansOrProducts",
                "DishCrossContaminationByCrustaceansOrPr",
                "DishRecipeContainsEggOrProducts",
                "DishCrossContaminationByEggOrProducts",
                "DishRecipeContainsFishOrProducts",
                "DishCrossContaminationByFishOrProducts",
                "DishRecipeContainsPeanutOrProducts",
                "DishCrossContaminationByPeanutOrProducts",
                "DishRecipeContainsSoyaOrProducts",
                "DishCrossContaminationBySoyaOrProducts",
                "DishRecipeContainsMilkOrProducts",
                "DishCrossContaminationByMilkOrProducts",
                "DishRecipeContainsAlmond",
                "DishCrossContaminationByAlmond",
                "DishRecipeContainsHazelnut",
                "DishCrossContaminationByHazelnut",
                "DishRecipeContainsWalnut",
                "DishCrossContaminationByWalnut",
                "DishRecipeContainsCashew",
                "DishCrossContaminationByCashew",
                "DishRecipeContainsPecan",
                "DishCrossContaminationByPecan",
                "DishRecipeContainsBrazil",
                "DishCrossContaminationByBrazil",
                "DishRecipeContainsPistachio",
                "DishCrossContaminationByPistachio",
                "DishRecipeContainsMacadamia",
                "DishCrossContaminationByMacadamia",
                "DishRecipeContainsCeleryOrProducts",
                "DishCrossContaminationByCeleryOrProducts",
                "DishRecipeContainsMustardOrProducts",
                "DishCrossContaminationByMustardOrPr",
                "DishRecipeContainsSesameOrProducts",
                "DishCrossContaminationBySesameOrProducts",
                "DishRecipeContainsSulphites",
                "DishCrossContaminationBySulphites",
                "DishRecipeContainsSulphitesAbove10ppm",
                "DishCrossContaminationBySulphitesAbove10",
                "DishRecipeContainsLupinOrProducts",
                "DishCrossContaminationByLupin",
                "DishRecipeContainsMolluscsOrProducts",
                "DishCrossContaminationByMolluscsOrPr"
            ];
        } else if (ItemRef.getTarget().getObjectType().getID() == "DishRecipe") {
            var allergen = [
                "DishRecipeContainsWheat",
                "DishCrossContaminationByWheat",
                "DishRecipeContainsRye",
                "DishCrossContaminationByRyePPP",
                "DishRecipeContainsBarley",
                "DishCrossContaminationByBarley",
                "DishRecipeContainsOats",
                "DishCrossContaminationByContainsOats",
                "DishRecipeContainsCrustaceansOrProducts",
                "DishCrossContaminationByCrustaceansOrPr",
                "DishRecipeContainsEggOrProducts",
                "DishCrossContaminationByEggOrProducts",
                "DishRecipeContainsFishOrProducts",
                "DishCrossContaminationByFishOrProducts",
                "DishRecipeContainsPeanutOrProducts",
                "DishCrossContaminationByPeanutOrProducts",
                "DishRecipeContainsSoyaOrProducts",
                "DishCrossContaminationBySoyaOrProducts",
                "DishRecipeContainsMilkOrProducts",
                "DishCrossContaminationByMilkOrProducts",
                "DishRecipeContainsAlmond",
                "DishCrossContaminationByAlmond",
                "DishRecipeContainsHazelnut",
                "DishCrossContaminationByHazelnut",
                "DishRecipeContainsWalnut",
                "DishCrossContaminationByWalnut",
                "DishRecipeContainsCashew",
                "DishCrossContaminationByCashew",
                "DishRecipeContainsPecan",
                "DishCrossContaminationByPecan",
                "DishRecipeContainsBrazil",
                "DishCrossContaminationByBrazil",
                "DishRecipeContainsPistachio",
                "DishCrossContaminationByPistachio",
                "DishRecipeContainsMacadamia",
                "DishCrossContaminationByMacadamia",
                "DishRecipeContainsCeleryOrProducts",
                "DishCrossContaminationByCeleryOrProducts",
                "DishRecipeContainsMustardOrProducts",
                "DishCrossContaminationByMustardOrPr",
                "DishRecipeContainsSesameOrProducts",
                "DishCrossContaminationBySesameOrProducts",
                "DishRecipeContainsSulphites",
                "DishCrossContaminationBySulphites",
                "DishRecipeContainsSulphitesAbove10ppm",
                "DishCrossContaminationBySulphitesAbove10",
                "DishRecipeContainsLupinOrProducts",
                "DishCrossContaminationByLupin",
                "DishRecipeContainsMolluscsOrProducts",
                "DishCrossContaminationByMolluscsOrPr"
            ];
            Item = ItemRef;
        } else {
            ////logger.info("Something went wrong while passing the Function with argument");
        }
    } else if (ObjectType == "GuestChoiceObj" || ObjectType == "GCSubRecipe") {
        var allergen = [
            "GuestChoiceContainsWheat",
            "GCCrossContaminationByWheat",
            "GuestChoiceContainsRye",
            "GCCrossContaminationByRyePPP",
            "GuestChoiceContainsBarley",
            "GCCrossContaminationByBarley",
            "GuestChoiceContainsOats",
            "GCCrossContaminationByContainsOats",
            "GuestChoiceContainsCrustaceansOrProducts",
            "GCCrossContaminationByCrustaceansOrPr",
            "GuestChoiceContainsEggOrProducts",
            "GCCrossContaminationByEggOrProducts",
            "GuestChoiceContainsFishOrProducts",
            "GCCrossContaminationByFishOrProducts",
            "GuestChoiceContainsPeanutOrProducts",
            "GCCrossContaminationByPeanutOrProducts",
            "GuestChoiceContainsSoyaOrProducts",
            "GCCrossContaminationBySoyaOrProducts",
            "GuestChoiceContainsMilkOrProducts",
            "GCCrossContaminationByMilkOrProducts",
            "GuestChoiceContainsAlmond",
            "GCCrossContaminationByAlmond",
            "GuestChoiceContainsHazelnut",
            "GCCrossContaminationByHazelnut",
            "GuestChoiceContainsWalnut",
            "GCCrossContaminationByWalnut",
            "GuestChoiceContainsCashew",
            "GCCrossContaminationByCashew",
            "GuestChoiceContainsPecan",
            "GCCrossContaminationByPecan",
            "GuestChoiceContainsBrazil",
            "GCCrossContaminationByBrazil",
            "GuestChoiceContainsPistachio",
            "GCCrossContaminationByPistachio",
            "GuestChoiceContainsMacadamia",
            "GCCrossContaminationByMacadamia",
            "GuestChoiceContainsCeleryOrProducts",
            "GCCrossContaminationByCeleryOrProducts",
            "GuestChoiceContainsMustardOrProducts",
            "GCCrossContaminationByMustardOrProducts",
            "GuestChoiceContainsSesameOrProducts",
            "GCCrossContaminationBySesameOrProducts",
            "GuestChoiceContainsSulphitesAbove10ppm",
            "GCCrossContaminationBySulphitesAbove10",
            "GuestChoiceContainsSulphites",
            "GCCrossContaminationBySulphites",
            "GuestChoiceContainsLupinOrProducts",
            "GCCrossContaminationByLupin",
            "GuestChoiceContainsMolluscsOrProducts",
            "GCCrossContaminationByMolluscsOrPr"

        ];
    } else if (ObjectType == "UpgradeObj") {
        var allergen = [
            "UpgradeContainsWheat",
            "UCrossContaminationByWheat",
            "UpgradeContainsRye",
            "UCrossContaminationByRyePPP",
            "UpgradeContainsBarley",
            "UCrossContaminationByBarley",
            "UpgradeContainsOats",
            "UCrossContaminationByContainsOats",
            "UpgradeContainsCrustaceansOrProducts",
            "UCrossContaminationByCrustaceansOrPr",
            "UpgradeContainsEggOrProducts",
            "UCrossContaminationByEggOrProducts",
            "UpgradeContainsFishOrProducts",
            "UCrossContaminationByFishOrProducts",
            "UpgradeContainsPeanutOrProducts",
            "UCrossContaminationByPeanutOrProducts",
            "UpgradeContainsSoyaOrProducts",
            "UCrossContaminationBySoyaOrProducts",
            "UpgradeContainsMilkOrProducts",
            "UCrossContaminationByMilkOrProducts",
            "UpgradeContainsAlmond",
            "UCrossContaminationByAlmond",
            "UpgradeContainsHazelnut",
            "UCrossContaminationByHazelnut",
            "UpgradeContainsWalnut",
            "UCrossContaminationByWalnut",
            "UpgradeContainsCashew",
            "UCrossContaminationByCashew",
            "UpgradeContainsPecan",
            "UCrossContaminationByPecan",
            "UpgradeContainsBrazil",
            "UCrossContaminationByBrazil",
            "UpgradeContainsPistachio",
            "UCrossContaminationByPistachio",
            "UpgradeContainsMacadamia",
            "UCrossContaminationByMacadamia",
            "UpgradeContainsCeleryOrProducts",
            "UCrossContaminationByCeleryOrProducts",
            "UpgradeContainsMustardOrProducts",
            "UCrossContaminationByMustardOrProducts",
            "UpgradeContainsSesameOrProducts",
            "UCrossContaminationBySesameOrProducts",
            "UpgradeContainsSulphitesAbove10",
            "UCrossContaminationBySulphitesAbove10",
            "UpgradeContainsSulphites",
            "UCrossContaminationBySulphites",
            "UpgradeContainsLupinOrProducts",
            "UCrossContaminationByLupin",
            "UpgradeContainsMolluscsOrProducts",
            "UCrossContaminationByMolluscsOrPr"

        ];
    } else if (ObjectType == "Ingredient") {
        var allergen = [
            "IngredientContainsWheat",
            "INGCrossContaminationByWheat",
            "IngredientContainsRye",
            "INGCrossContaminationByRyePPP",
            "IngredientContainsBarley",
            "INGCrossContaminationByBarley",
            "IngredientContainsOats",
            "INGCrossContaminationByContainsOats",
            "IngredientContainsCrustaceansOrProducts",
            "INGCrossContaminationByCrustaceansOrPr",
            "IngredientContainsEggOrProducts",
            "INGCrossContaminationByEggOrProducts",
            "IngredientContainsFishOrProducts?",
            "INGCrossContaminationByFishOrProducts",
            "IngredientContainsPeanutOrProducts",
            "INGCrossContaminationByPeanutOrProducts",
            "IngredientContainsSoyaOrProducts",
            "INGCrossContaminationBySoyaOrProducts",
            "IngredientContainsMilkOrProducts",
            "INGCrossContaminationByMilkOrProducts",
            "IngredientContainsAlmond",
            "INGCrossContaminationByAlmond",
            "IngredientContainsHazelnut",
            "INGCrossContaminationByHazelnut",
            "IngredientContainsWalnut",
            "INGCrossContaminationByWalnut",
            "IngredientContainsCashew",
            "INGCrossContaminationByCashew",
            "IngredientContainsPecan",
            "INGCrossContaminationByPecan",
            "IngredientContainsBrazil",
            "INGCrossContaminationByBrazil",
            "IngredientContainsPistachio",
            "INGCrossContaminationByPistachio",
            "IngredientContainsMacadamia",
            "INGCrossContaminationByMacadamia",
            "IngredientContainsCeleryOrProducts",
            "INGCrossContaminationByCeleryOrProducts",
            "IngredientContainsMustardOrProducts",
            "INGCrossContaminationByMustardOrProducts",
            "IngredientContainsSesameOrProducts",
            "INGCrossContaminationBySesameOrProducts",
            "IngredientContainsSulphitesAbove10ppm",
            "INGCrossContaminationBySulphitesAbove10",
            "IngredientContainsSulphites",
            "INGCrossContaminationBySulphites",
            "IngredientContainsLupinOrProducts",
            "INGCrossContaminationByLupin",
            "IngredientContainsMolluscsOrProducts",
            "INGCrossContaminationByMolluscsOrPr"

        ];
        Item = ItemRef;
    }
    var allergenVal = '';
    var allergenHtml = '';
    for (var i = 0; i < allergen.length; i++) {
        if (i == 0 || i == 1) {
            allergenVal = Item.getValue(allergen[i]).getSimpleValue();
        } else {
            if (i == 50) {
                allergenVal = Item.getValue(allergen[i]).getSimpleValue();
            } else {
                allergenVal = Item.getValue(allergen[i]).getSimpleValue();
            }
        }
        allergenHtml = allergenHtml + '<td style="border: 1px solid black;padding: 1px;text-align: center;">' + allergenVal + '</td>';
    }
    return (allergenHtml);
}