var newprod = createDups(node);
createRefsandCopyAttributes(node,newprod);
var Ingarray = [];
var IngRefs = node.getReferencedBy().iterator();

while(IngRefs.hasNext())
{
    var currIngRef = IngRefs.next();
   // //logger.info(currIngRef);
    if(currIngRef.getReferenceTypeString() == "IngredientToProduct")
    {
        
        //Ingarray.push(currIngRef.getSource());
		var Ing = currIngRef.getSource();
		var newOBj = createDups(Ing);
        createRefsandCopyAttributes(Ing,newOBj,newprod);
		//var currParent = node.getParent();
        
    }
}

function createDups(currObj)
{
	var currParent = currObj.getParent();
		var currName = currObj.getName();
			var newName = "Copy- " + currName;

	newName = newName.length > 32 ? newName.substr(0,32) : newName;
	//logger.info("newName"+newName);
	newName=newName.trim();
	var ObjectType = currObj.getObjectType().getID();
	try{
		var newObj = currParent.createProduct(null, ObjectType);
		newObj.setName(newName);
		newObj.getValue("DuplicateObjectFlag").setSimpleValue("Yes");
	}
	catch(error)
	{
		logger.info("error :"+error);
	}
    return newObj;
	//createRefsandCopyAttributes(currObj,newObj);

}
function createRefsandCopyAttributes(currObj,newObj,newprod)
{
	var refLinks = currObj.getReferences().asList().iterator();
	
	logger.info(refLinks);
	while(refLinks.hasNext()){

		var currRef = refLinks.next();
		var refName = currRef.getReferenceTypeString();
		logger.info(refName);
		var refType = currRef.getReferenceType();
		////logger.info("refName: " +refName);
		if(refName == "ProductToMailType"||refName == "MenuItem"||refName == "SubRecipeToMenu"||refName == "DishRecipeMenuItemToSubMenu"){			
			//logger.info("		ref skipped");			
		}else{
			
				//if(refName == "
				var ObjectTypp = currRef.getTarget().getObjectType().getID();
			//	logger.info("hh "+currObj + " : "+ObjectTypp);
				if(ObjectTypp == "Product")
				{
					logger.info("adnnd");
					var newTarget = newprod;
				}
				else
				{
					
					var newTarget = currRef.getTarget();
					logger.info(newTarget);
					//logger.info("new obj "+newTarget);
				}
					try{
						//logger.info(" newRef dfd ");
						//newObj.deleteReference(currRef);
						//currRef.delete();
						var newRef = newObj.createReference(newTarget, refName);
					//	currRef.delete();
						//logger.info(" newRef dfd "+newTarget);
					}
					catch(error)
					{
						logger.info("error :"+error);
					}
			var refMetaAttributes = refType.getValidDescriptionAttributes();

			if(refMetaAttributes.size() == 0){						
			}else{
				for(var myMetaAtt in Iterator(refMetaAttributes)){
					
					var myMetaAttID = myMetaAtt.getID();
					
					var myMetaAttVal = currRef.getValue(myMetaAttID).getSimpleValue();					
					
					if(currRef.getValue(myMetaAttID).isDerived() == true){
					}else{						
						////logger.info(myMetaAttID+" = "+myMetaAttVal);
						//logger.info(" myMetaAttID : "+newRef);
						newRef.getValue(myMetaAttID).setSimpleValue(myMetaAttVal);
					}						
				}

			}
		}
	}
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
		

	
}
