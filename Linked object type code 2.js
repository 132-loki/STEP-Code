node.getValue("DuplicateObjectFlag").setSimpleValue("Yes");
var currParent = node.getParent();
    var currName = node.getName();
        //var newName = "Copy- " + currName;
logger.info(String(currName).length);
        currName = String(currName).length > 32 ? String(currName).substr(0,32) : currName;
//logger.info("newName"+newName);
currName=currName.trim();
//var ObjectType = currObj.getObjectType().getID();
try{
    var Ing = currParent.createProduct(null, "Ingredient");
    Ing.setName(currName);
    Ing.getValue("DuplicateObjectFlag").setSimpleValue("Yes");
    Ing.createReference(node,"IngredientToProduct")
}
catch(error)
{
    logger.info("error :"+error);
}