var IngtoMenuRef = step.getReferenceTypeHome().getReferenceTypeByID("IngredientToMenu");
var DRtoIng = step.getReferenceTypeHome().getReferenceTypeByID("RecipeToIngredient");
var DRArray = [];
var IngArr = [];
var UPArray = [];
var GCArray = [];
var SRArray = [];
var recSRRefType = step.getReferenceTypeHome().getReferenceTypeByID("RecipeToSubRecipe");
//var IngtoMenu = step.getReferenceTypeHome().getReferenceTypeByID("SubRecipeToMenu");
var UPtoSRRef = step.getReferenceTypeHome().getReferenceTypeByID("UpgradetoSubRecipe");
var GCtoSRRef = step.getReferenceTypeHome().getReferenceTypeByID("GuestChoicetoSubRecipe");
var DishtoUPRef = step.getReferenceTypeHome().getReferenceTypeByID("Upgrade");
var DishtoGCRef = step.getReferenceTypeHome().getReferenceTypeByID("GuestChoice");


//collectReferences(node, newDR, DishtoGCRef);
//collectReferences(node, newDR, recSRRefType);
//collectSubRecipes(currDish);


//starting from Ingredients:

var IngRefsBy = node.getReferencedBy().iterator();
while (IngRefsBy.hasNext()) {
    var RefBys = IngRefsBy.next();
    var RefLink = RefBys.getReferenceTypeString();
    logger.info(RefLink);
    if (RefLink == "RecipeToIngredient") {
        var DishRecipe = RefBys.getSource();
        DRArray.push(DishRecipe.getID());
        var newDR = createDups(DishRecipe);
        logger.info(newDR);
        collectReferences(DishRecipe, newDR, DishtoUPRef);
    }

}



function getIngDetails(dish) {
    var IngsRefs = dish.getReferences(DRtoIng).iterator();
    while (IngsRefs.hasNext()) {
        var currIngRef = IngsRefs.next();
        var currIng = currIngRef.getTarget();
        IngArr.push(currIng);
        //linkIngwithcurrMenuandDeleteOthers(currIng);

    }
}

function collectReferences(olddish, newDish, refType) {
    //getIngDetails(dish);
    if (refType == "Upgrade") {
        var refs = olddish.getReferences(refType).iterator();
        while (refs.hasNext()) {
            var ref = refs.next();
            var UP = ref.getTarget();
            var newUP = createDups(UP);

            var newDRUPRef = createRefsandCopyAttributes(olddish, newDish, UP, newUP, "Upgrade", ref);


            //var newDRUPRef = dish.createReference(newUP ,"Upgrade");
            var UPtoSR = UP.getReferences(UPtoSRRef).iterator();
            while (UPtoSR.hasNext()) {
                var UPSRRef = UPtoSR.next();
                var CurrSR = UPSRRef.getTarget();

                // getIngDetails(CurrSR);
                var newSR = createDups(CurrSR);

                var newUPSRRef = createRefsandCopyAttributes(UP, newUP, CurrSR, newSR, "UpgradetoSubRecipe", UPSRRef);

                collectSubRecipes(UP, newUP, CurrSR, newSR);


            }
        }
    }
    if (refType == "GuestChoice") {
        var refs = dish.getReferences(refType).iterator();
        while (refs.hasNext()) {
            var ref = refs.next();
            var GC = ref.getTarget();
            var GCtoSR = GC.getReferences(GCtoSRRef).iterator();
            while (GCtoSR.hasNext()) {
                var GCSRRef = GCtoSR.next();
                var CurrSR = GCSRRef.getTarget();
                // IngArr.push(CurrSR);
                getIngDetails(CurrSR);
                collectSubRecipes(CurrSR);
            }
        }
    }
    if (refType == "RecipeToSubRecipe") {
        var refs = dish.getReferences(refType).iterator();
        while (refs.hasNext()) {
            var ref = refs.next();
            // IngArr.push(ref.getTarget());
            getIngDetails(ref.getTarget());
            collectSubRecipes(ref.getTarget());
        }
    }

}

function collectSubRecipes(UP, newUP, dish, newDish) {
    var depth = 0;

    function recurse(currentDish, currentDepth) {
        if (currentDepth >= 5) return; // Limit recursion to 5 levels

        var refs = currentDish.getReferences(recSRRefType).iterator();
        while (refs.hasNext()) {
            var ref = refs.next();
            var subDish = ref.getTarget();
            // IngArr.push(subDish);
            //getIngDetails(subDish);
            var newSR = createDups(subDish);
            var newSRtoSRRef = createRefsandCopyAttributes(dish, newDish, subDish, newSR, "RecipeToSubRecipe", ref);

            //collectReferences(node, DishtoUPRef);
            //collectReferences(node, DishtoGCRef);
            recurse(subDish, currentDepth + 1);
        }
    }

    recurse(dish, depth);
}

function removedups(arr) {
    var uniqueArray = [];
    for (var i = 0; i < arr.length; i++) {
        if (uniqueArray.indexOf(arr[i]) == -1) {
            uniqueArray.push(arr[i]);
        }
    }
    return uniqueArray.join("<br>");
}



function createDups(currObj) {
    var currParent = currObj.getParent();
    var currName = currObj.getName();
    var newName = "Copy- " + currName;
    newName = newName.trim();
    var ObjectType = currObj.getObjectType().getID();
    try {
        var newObj = currParent.createProduct(null, ObjectType);
        newObj.setName(newName);
        logger.info(" sending :" + currObj.getID() + " : " + newObj.getID());
        copyAttValues(currObj, newObj);
        newObj.getValue("DuplicateObjectFlag").setSimpleValue("Yes");
    } catch (error) {
        logger.info("error :" + error);
    }
    return newObj;
}

function createRefsandCopyAttributes(oldObj, newObj1, oldObj2, newObj2, reftype, oldref) {
    var newRef = newObj1.createReference(newObj2, reftype);

    if (oldObj.getObjectType().getID() == "DishRecipe" && newObj1.getObjectType().getID() == "DishRecipe") {
        logger.info("1");
        try {
            var newRef1 = newObj1.createReference(oldObj, "NewDishtoOldDish");
        } catch (error) {
            logger.info("already refernced");
        }
    } else if (oldObj.getObjectType().getID() == "UpgradeObj" && newObj1.getObjectType().getID() == "UpgradeObj") {
        try {
            var newRef2 = newObj1.createReference(oldObj, "NewUptoOldUP");
        } catch (error) {
            logger.info("already refernced");
        }
    }

    // Check the types of oldObj2 and newObj2, and create references accordingly
    if (oldObj2.getObjectType().getID() == "DishRecipe" && newObj2.getObjectType().getID() == "DishRecipe") {
        try {
            var newRef3 = newObj2.createReference(oldObj2, "NewDishtoOldDish");
        } catch (error) {
            logger.info("already refernced");
        }
        logger.info("3");
    } else if (oldObj2.getObjectType().getID() == "UpgradeObj" && newObj2.getObjectType().getID() == "UpgradeObj") {
        try {
            var newRef4 = newObj2.createReference(oldObj2, "NewUptoOldUP");
        } catch (error) {
            logger.info("already refernced");
        }
        logger.info("4");
    }



    //var oldtoNew1 = newObj1.createReference(oldObj, reftype);
    //var oldtoNew2 = newObj2.createReference(oldObj2, reftype);
    //logger.info("Old Ref :"+oldref);
    var refMetaAttributes = oldref.getReferenceType().getValidDescriptionAttributes();

    if (refMetaAttributes.size() == 0) {} else {
        for (var myMetaAtt in Iterator(refMetaAttributes)) {

            var myMetaAttID = myMetaAtt.getID();

            var myMetaAttVal = oldref.getValue(myMetaAttID).getSimpleValue();

            if (oldref.getValue(myMetaAttID).isDerived() == true) {} else {
                ////logger.info(myMetaAttID+" = "+myMetaAttVal);
                //logger.info(" myMetaAttID : "+newRef);
                try {
                    newRef.getValue(myMetaAttID).setSimpleValue(myMetaAttVal);
                } catch (error) {
                    logger.info(" error :" + error);
                }
            }
        }

    }

    //}

    /*
		var prodLinks = currObj.getClassificationProductLinks().asList().iterator();
//	
	while(prodLinks.hasNext())
	{
		var currLink = prodLinks.next();
		var newTarget = currLink.getClassification();
	//	logger.info(" jkasak "+currLink.getLinkType());
			//var LinkName = currLink.getLinkType();
		logger.info(" newTarget "+newTarget);
		var LinkType = currLink.getLinkType();
		var newLink = newObj.createClassificationProductLink(newTarget, LinkType);
		//logger.info("sjkka"+newLink);
	}
		*/
    return newRef;

}
// copy attribute values
function copyAttValues(currObj, newObj) {
    var myDRVals = currObj.getValues();
    //logger.info("myDRVals : "+myDRVals);
    //logger.info("myDRVals.size():	" + myDRVals.size());
    for (var myDRVal in Iterator(myDRVals)) {

        var currDRAttID = myDRVal.getAttribute().getID();
        var currDRVal = myDRVal.getSimpleValue();
        //logger.info(" currDRAttID :"+currDRAttID+" currObj : "+currObj);
        if (currObj.getValue(currDRAttID).isDerived() == true) {
            //logger.info("Attr skipped- "+currDRAttID);
            //check if a calced att first - don't copy
        } else {
            //  newObj.getValue(currDRAttID).setSimpleValue(currDRVal);
            // logger.info(currDRAttID + " = " + currDRVal);
            //end if
        }
        //end for
    }
    //initiate new dish into the WF
    //newObj.startWorkflowByID("DishtoMenuWorkflow", "Started from Business Action CopyDishandInitiateinDishToMenuWF_WebUI");
    //logger.info(newObj.getID()+"  initiated into WF");

}