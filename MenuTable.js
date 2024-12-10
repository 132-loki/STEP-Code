var brand = node.getValue("MENBrand").getSimpleValue();
var menuName = node.getValue("MenuName").getSimpleValue();
var subMenuName = "";
var flag_Upgrade ="No";
var dishGCSRUnique=[];
var dishGCSRUniqueArray=[];
	
	var recIngRefType = step.getReferenceTypeHome().getReferenceTypeByID("RecipeToIngredient");
	var recSRRefType = step.getReferenceTypeHome().getReferenceTypeByID("RecipeToSubRecipe");
	var recGCSRRefType = step.getReferenceTypeHome().getReferenceTypeByID("RecipetoGCSubRecipe");
	

var result = getMenuNutritionContent(node);

createMenuNutritionAsset(result);

function getMenuNutritionContent(node)
{
	var htmlContent = '';
	
	var table_style ='table, th, td {border:1px solid black; border-collapse: collapse;}';
	var menu_style1 ='.MenuDetails1{background-color:#4472C4;text-align: center;color:white}';
	var menu_style2 ='.MenuDetails2{background-color:#9BC2E6;text-align: center;}';
	var item_style1 ='.ItemDetails1{  background-color:#ED7D31;text-align: center;color:white}';
	var item_style2 ='.ItemDetails2{  background-color:#F8CBAD;text-align: center;}';
	var nutrition_style1 ='.NutritionDetails1{  background-color:#70AD47;text-align: center;color:white}';
	var nutrition_style2 ='.NutritionDetails2{  background-color:#A9D08E;text-align: center;}';
	
	var reportStyle = '<style>' + table_style + menu_style1+menu_style2 + item_style1+item_style2 + nutrition_style1+nutrition_style2 + '</style>';
	
	var ColHeader1='';	
	ColHeader1=ColHeader1+'<td class="MenuDetails1" colspan="3">MENU Details</td>';
	ColHeader1=ColHeader1+'<td class="ItemDetails1" colspan="12">ITEM Details</td>';
	ColHeader1=ColHeader1+'<td class="NutritionDetails1" colspan="8">NUTRITION (Per Portion)</td>';
	ColHeader1='<tr>'+ColHeader1+'</tr>';
	
	var ColHeader2='';
	ColHeader2=ColHeader2+'<td class="MenuDetails2"><b>'+"Brand"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="MenuDetails2"><b>'+"MENU Name"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="MenuDetails2"><b>'+"Course"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Object Type"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Core RECIPE"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Item ID"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Item Name"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Portion Serving"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Total Weight / Base Unit Used"+'</b></td>';
	    ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Weight Per Portion"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Usage Unit"+'</b></td>';
    ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Base Unit"+'</b></td>';
    ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"NSF Yield"+'</b></td>';
    ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Cooked Weight"+'</b></td>';
    
	ColHeader2=ColHeader2+'<td class="ItemDetails2"><b>'+"Volume Of An Each"+'</b></td>';

	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Energy (KJ)"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Energy (Kcal)"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Fat (g)"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Saturates (g)"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Carbohydrate (g)"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Sugars (g)"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Protein (g)"+'</b></td>';
	ColHeader2=ColHeader2+'<td class="NutritionDetails2"><b>'+"Salt (g)"+'</b></td>';
	ColHeader2='<tr>'+ColHeader2+'</tr>';
	

	var dishArr = [];
	var subMenuArr = [];
	for (var i = 0; i < 2; i++)
	{
		subMenuArr[i] = [];
	}
	
	var menuSubMenus = node.getChildren();
	if (menuSubMenus.size() <= 0 || menuSubMenus.size() == null)
	{
	    allHTMLContent = 'This Menu "' + node.getName() + '" does not have any Sub-Menu included';
	    return allHTMLContent;
	}
	else
	{
	    for (var a = 0; a < menuSubMenus.size(); a++)
	    {
	        var currSM = menuSubMenus.get(a);
			if (currSM.getObjectType().getID() == "SubMenu")
	        {
	            if (currSM.getValue("ShowonDigitalMenu").getSimpleValue() == "Yes")
	            {
	                    subMenuArr[0].push(menuSubMenus.get(a));
			            subMenuArr[1].push(currSM.getValue("subMenuSortOrder").getSimpleValue());
			    }
			}
			else if (currSM.getObjectType().getID() == "SubMenuASGCUPSR")
			{
				if (currSM.getName() == "Upgrade")
			    {
			        SubMenuASGCUPSR_UP = currSM;
			        flag_Upgrade = "Yes";
			    }
			}
		}
		subMenuArr = sortingSM(subMenuArr, subMenuArr[0].length);

		// push UPGRADE SUbMENU Type into subMenuArr here at the end of the subMenuArr
		// 
		if (flag_Upgrade == "Yes")
		{
		    subMenuArr[0].push(SubMenuASGCUPSR_UP);
		    subMenuArr[1].push(0);
		}
		
		for (var a = 0; a < subMenuArr[0].length; a++)
		{
			dishArr = [];
			dishGCSRUnique=[];
			dishGCSRUniqueArray=[];
		    var currSM = subMenuArr[0][a];
		    var pLinks = currSM.getClassificationProductLinks().iterator();
		    while (pLinks.hasNext())
		    {
		        var currPLink = pLinks.next();
		        var currDish = currPLink.getProduct();
				if (currDish.getObjectType().getID() == "DishRecipe")
		        {
		            dishArr.push(currDish);
		        }
		        else if (currDish.getObjectType().getID() == "UpgradeObj")
		        {
		            dishArr.push(currDish);
		        }
		    }		
		    if (dishArr.length > 0)
		    {
		        dishArr = sortingRec(dishArr, dishArr.length);
		        
			    for (var i = 0; i < dishArr.length; i++)
				{
				    if (dishArr[i].getObjectType().getID() == "DishRecipe")
				    {
						if(currSM.getValue("ShowGCWithRecipe").getSimpleValue()=="No")
						{
							// ING and SR check
							var showDishANData = dishArr[i].getValue("ShowAN_From_DishRecipe").getSimpleValue();
							//if (showDishANData == "Yes") 
						//	{
								//Print Dish Recipes
								htmlContent=htmlContent+getCoreDishContent(currSM,dishArr[i],"");
                                htmlContent=htmlContent+getIngSRContent(currSM,dishArr[i]);
							//}
						//	else
						//	{
							//	htmlContent=htmlContent+getIngSRContent(currSM,dishArr[i]);
							//}
						}
						else
						{
							var showDishANData = dishArr[i].getValue("ShowAN_From_DishRecipe").getSimpleValue();
						//	if (showDishANData == "Yes") 
						//	{
								//Print Dish Recipes
								htmlContent=htmlContent+getCoreDishContent(currSM,dishArr[i],"");
                                htmlContent=htmlContent+getIngSRContent(currSM,dishArr[i]);
							//}
						//	else
						//	{
								//Call Function to Print from ING and SR
								//htmlContent=htmlContent+getIngSRContent(currSM,dishArr[i]);
							//}
							//Print GCSR
							var currDishGCSRRefs = dishArr[i].getReferences(recGCSRRefType).iterator();
							while (currDishGCSRRefs.hasNext()) 
							{
							    var currDishGCSRRef = currDishGCSRRefs.next();
							    var currDishGCSR = currDishGCSRRef.getTarget();
								var currDishGCSRID=currDishGCSR.getID();
								if(currDishGCSRRef.getValue("IncludeGCSRinDigMenu").getSimpleValue()!="No")
								{
									if(!dishGCSRUnique.includes(currDishGCSRID))
									{
										dishGCSRUnique.push(currDishGCSRID);
										dishGCSRUniqueArray.push(currDishGCSR);
										htmlContent=htmlContent+getCoreDishContent(currSM,currDishGCSR,dishArr[i]);
									}
								}
							}
						}
					}
					
					//else // Upgrade
					//{
						//Print Upgrade
						//htmlContent=htmlContent+getCoreDishContent(currSM,dishArr[i],"");
					//}
				}
				
				if(currSM.getValue("ShowGCWithRecipe").getSimpleValue()=="No")
				{
					var dishGCSRUnique=[];
					for (var i = 0; i < dishArr.length; i++)
					{
						if (dishArr[i].getObjectType().getID() == "DishRecipe")
						{
							var currDishGCSRRefs = dishArr[i].getReferences(recGCSRRefType).iterator();
							while (currDishGCSRRefs.hasNext()) 
							{
							    var currDishGCSRRef = currDishGCSRRefs.next();
							    var currDishGCSR = currDishGCSRRef.getTarget();
								var currDishGCSRID=currDishGCSR.getID();
							    
								if(currDishGCSRRef.getValue("IncludeGCSRinDigMenu").getSimpleValue()!="No")
								{
									
									if(!dishGCSRUnique.includes(currDishGCSRID))
									{
										dishGCSRUnique.push(currDishGCSRID);
										htmlContent=htmlContent+getCoreDishContent(currSM,currDishGCSR,currSM.getValue("SMGCName").getSimpleValue());
									}
								}
							}
						}
					}
				}
			}
        }

		htmlContent=ColHeader1+ColHeader2+htmlContent;
		
		var result = '<html>' + reportStyle + '<body><table style="width:100%">' + htmlContent + '</table></body></html>';
		return result;
	}
}

function createMenuNutritionAsset(result)
{
	var input = cleanString(result);
	var intStream = stringToBytes(String(input)); 
	var inputStream = new java.io.ByteArrayInputStream(intStream);
	var menuNutritionID=node.getID()+"_MenuNutrition_Report";
	var menuNutritionName=node.getName()+" - Menu Nutrition Report";
	var menuNutrition=step.getAssetHome().getAssetByID(menuNutritionID);
	
	if(menuNutrition==null)
	{
		menuNutrition = MenuNutritionFolder.createAsset(menuNutritionID,"Asset user-type root");
		menuNutrition.setName(menuNutritionName);
	}
	menuNutrition.upload(inputStream , menuNutritionName+".html");

	var refs = step.getReferenceTypeHome().getReferenceTypeByID("MenuNutritionReportRef");
	var clsRef = node.getReferences(refs).toArray();
	if(clsRef.length==0)
	{
		node.createReference(step.getAssetHome().getAssetByID(menuNutritionID), "MenuNutritionReportRef");
	}
}

function stringToBytes(val) 
{ 
    const result = []; 
    for (var i = 0; i < val.length; i++) { 
        result.push(val.charCodeAt(i)); 
    } 
    return result; 
}

function cleanString(input) 
{
    input=String(input);	
    var output = "";
    for (var i=0; i < input.length; i++) {
       if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;    
}

function sortingSM(arr, length) 
{
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

function sortingRec(arr, length)
{
    if (length > 1)
    {
        for (var i = 0; i < length - 1; i++)
        {
            for (var j = i + 1; j < length; j++)
            {
				//changed - diital nsf attribute is used
               // if (arr[i].getName() > arr[j].getName() || (arr[i].getName() === arr[j].getName() && i > j))
                if (arr[i].getValue("DigitalMenuName_NSF").getSimpleValue() > arr[j].getValue("DigitalMenuName_NSF").getSimpleValue() || (arr[i].getValue("DigitalMenuName_NSF").getSimpleValue() === arr[j].getValue("DigitalMenuName_NSF").getSimpleValue() && i > j))
                {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }
    else
    {
        return arr;
    }
}

function sortingGCSR(arr, length)
{
    if (length > 1)
    {
        for (var i = 0; i < length - 1; i++)
        {
            for (var j = i + 1; j < length; j++)
            {
                var compTo=step.getProductHome().getProductByID(arr[i]);
				var compwith=step.getProductHome().getProductByID(arr[j]);
				//changed - digital nsf attribute is used instead of name
				//if (compTo.getName() > compwith.getName() || (compTo.getName() === compwith.getName() && i > j))
                if (compTo.getValue("DigitalMenuName_NSF").getSimpleValue() > compwith.getValue("DigitalMenuName_NSF").getSimpleValue() || (compTo.getValue("DigitalMenuName_NSF").getSimpleValue() === compwith.getValue("DigitalMenuName_NSF").getSimpleValue() && i > j))
                
				{
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }
    else
    {
        return arr;
    }
}

function getCoreDishContent(currSM,item,itemDish)
{
	var keyItemDetails='';
	
	var subMenuName = currSM.getName();
	var ObjectType=item.getObjectType().getID();
	var CoreDishID="";
	var ItemID="";
	if(ObjectType=="GCSubRecipe")
	{
		ObjectType="Guest Choice";
		if(itemDish==currSM.getValue("SMGCName").getSimpleValue())
		{
			CoreDishID=currSM.getValue("SMGCName").getSimpleValue();
		}
		else
		{
			CoreDishID=itemDish.getID();
		}
		ItemID= item.getValue("SourceGCSRID").getSimpleValue();
	}
	else if(ObjectType=="UpgradeObj")
	{
		ObjectType="Upgrade";
		CoreDishID=item.getID();
		ItemID=item.getID();
	}
	else
	{
		CoreDishID=item.getID();
		ItemID=item.getID();
	}
	var ItemName=item.getValue("DigitalMenuName_NSF").getSimpleValue();
	
	keyItemDetails=keyItemDetails+'<td>'+brand+'</td>';
	keyItemDetails=keyItemDetails+'<td>'+node.getName()+'</td>';
	keyItemDetails=keyItemDetails+'<td>'+subMenuName+'</td>';
  //  if(ObjectType == "DishRecipe")
	//keyItemDetails=keyItemDetails+'<td>'+ObjectType+'</td>';

  if (ObjectType == "DishRecipe") {
    keyItemDetails = keyItemDetails + '<td style="background-color: green;">' + ObjectType + '</td>';
} else if (ObjectType == "Ingredient") {
    keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
} else if (ObjectType == "Guest Choice") {
    keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
} else {
    
    keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
}

	keyItemDetails=keyItemDetails+'<td>'+CoreDishID+'</td>';
	keyItemDetails=keyItemDetails+'<td>'+ItemID+'</td>';
		
	keyItemDetails=keyItemDetails+'<td>'+ItemName+'</td>';
	
	var dishPortion=item.getValue("DishPortionServing").getSimpleValue();
	if(dishPortion==0 || dishPortion==null)
	{
		dishPortion=1;
	}
	var totalWeight=item.getValue("TotalWeight").getSimpleValue();
    var UsageUnit=item.getValue("UsageUnit").getSimpleValue();
    var BaseUnit=item.getValue("BaseUnit").getSimpleValue();
    var VolumeofAnEach=item.getValue("VolumeOfAnEach").getSimpleValue();
    
	var portionWeight=totalWeight/dishPortion;
	keyItemDetails=keyItemDetails+'<td>'+dishPortion+'</td>';
	keyItemDetails=keyItemDetails+'<td>'+totalWeight+'</td>';
    	keyItemDetails=keyItemDetails+'<td>'+portionWeight+'</td>';
	keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
    keyItemDetails=keyItemDetails+'<td>'+'g'+'</td>';
    	keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
		keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
	keyItemDetails=keyItemDetails+'<td>'+""+'</td>';

	
	var contentItemDIVDishNutrition = ItemNutrition(item,"Core");
	
	contentItemDIVDishNutrition='<tr>'+keyItemDetails+contentItemDIVDishNutrition+'</tr>';
	return (contentItemDIVDishNutrition);
}

function getIngSRContent(currSM,item)
{
	var keyItemDetails='';
	var subMenuName = currSM.getName();
	var CoreDishID=item.getID();
	var contentItemDIVDishNutrition='';
	
	var currDishIngRefs = item.getReferences(recIngRefType).iterator();
	while (currDishIngRefs.hasNext()) 
	{
	    var currIngRef = currDishIngRefs.next();
		//var showDishRefANData = currIngRef.getValue("IncludeIngSRIn_DigitalMenu").getSimpleValue();

        var UsageUnit=currIngRef.getTarget().getValue("UsageUnit").getSimpleValue();
        var BaseUnit=currIngRef.getValue("IngredientBaseUnit").getSimpleValue();
		var BaseUnitUsed=currIngRef.getValue("IngredientBaseUnitsUsed").getSimpleValue();
		var NSFYield = currIngRef.getValue("NSFYield_RecipeToIng").getSimpleValue();
		var CookedWeightOfRecipe= currIngRef.getValue("WeightOfAnEach_NSF").getSimpleValue();
        var VolumeofAnEach=currIngRef.getValue("VolumeOfAnEach").getSimpleValue();
		
		
			var ObjectType=currIngRef.getTarget().getObjectType().getID();
			var ItemID=currIngRef.getTarget().getID();
			var ItemName=currIngRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();
			keyItemDetails='';
			keyItemDetails=keyItemDetails+'<td>'+brand+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+node.getName()+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+subMenuName+'</td>';
            if (ObjectType == "DishRecipe") {
                keyItemDetails = keyItemDetails + '<td style="background-color: green;">' + ObjectType + '</td>';
            } else if (ObjectType == "Ingredient") {
                keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
            }  else if (ObjectType == "Guest Choice"){
                keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
            } else {
                
                keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
            }
		//	keyItemDetails=keyItemDetails+'<td>'+ObjectType+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+CoreDishID+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+ItemID+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+ItemName+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
			 keyItemDetails=keyItemDetails+'<td>'+BaseUnitUsed+'</td>';
		  
             keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
		  keyItemDetails=keyItemDetails+'<td>'+UsageUnit+'</td>';
            keyItemDetails=keyItemDetails+'<td>'+BaseUnit+'</td>';
            keyItemDetails=keyItemDetails+'<td>'+NSFYield+'</td>';
            keyItemDetails=keyItemDetails+'<td>'+CookedWeightOfRecipe+'</td>';
           
		   keyItemDetails=keyItemDetails+'<td>'+VolumeofAnEach+'</td>';
			

			contentItemDIVDishNutrition=contentItemDIVDishNutrition+'<tr>'+keyItemDetails+ItemNutrition(currIngRef.getTarget(),currIngRef)+'</tr>';
		
	}
	
	var currDishSRRefs = item.getReferences(recSRRefType).iterator();
	while (currDishSRRefs.hasNext()) 
	{   	
		var currSRRef = currDishSRRefs.next();

        var UsageUnit=currSRRef.getValue("UsageUnit").getSimpleValue();
        var BaseUnit=currSRRef.getValue("IngredientBaseUnit").getSimpleValue();
         var BaseUnitUsed=currSRRef.getValue("IngredientBaseUnitsUsed").getSimpleValue();
		var NSFYield = currSRRef.getValue("NSFYield_RecipeToSR").getSimpleValue();
		var CookedWeightOfRecipe= currSRRef.getValue("WeightOfAnEach_NSF").getSimpleValue();
		var VolumeofAnEach=currSRRef.getValue("VolumeOfAnEach").getSimpleValue();

		
			var ObjectType=currSRRef.getTarget().getObjectType().getID();
			var ItemID=currSRRef.getTarget().getID();
			var ItemName=currSRRef.getTarget().getValue("DigitalMenuName_NSF").getSimpleValue();
			keyItemDetails='';
			keyItemDetails=keyItemDetails+'<td>'+brand+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+node.getName()+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+subMenuName+'</td>';
            if (ObjectType == "DishRecipe") {
                keyItemDetails = keyItemDetails + '<td style="background-color: blue;">' + ObjectType + '</td>';
            } else if (ObjectType == "Ingredient") {
                keyItemDetails = keyItemDetails + '<td style="background-color: yellow;">' + ObjectType + '</td>';
            }  else if (ObjectType == "Guest Choice") {
                keyItemDetails = keyItemDetails + '<td style="background-color: #FFBF00;">' + ObjectType + '</td>';
            } else {
                
                keyItemDetails = keyItemDetails + '<td>' + ObjectType + '</td>';
            }

			//keyItemDetails=keyItemDetails+'<td>'+ObjectType+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+CoreDishID+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+ItemID+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+ItemName+'</td>';
           	keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
		   keyItemDetails=keyItemDetails+'<td>'+BaseUnitUsed+'</td>';
				keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
			keyItemDetails=keyItemDetails+'<td>'+UsageUnit+'</td>';
            keyItemDetails=keyItemDetails+'<td>'+BaseUnit+'</td>';
            keyItemDetails=keyItemDetails+'<td>'+NSFYield+'</td>';
            keyItemDetails=keyItemDetails+'<td>'+CookedWeightOfRecipe+'</td>';
           
			keyItemDetails=keyItemDetails+'<td>'+""+'</td>';
				
			
			contentItemDIVDishNutrition=contentItemDIVDishNutrition+'<tr>'+keyItemDetails+ItemNutrition(currSRRef.getTarget(),currSRRef)+'</tr>';	
		
	}
	return (contentItemDIVDishNutrition);
}

function ItemNutrition(Item, ItemRef)
{
    var ObjectType=Item.getObjectType().getID();
	
    if(ObjectType=="DishRecipe")
	{
		if(ItemRef=="Core" || ItemRef=="" || ItemRef==null)
		{
			if(Item.getValue("DishPortionServing").getSimpleValue()=="" || Item.getValue("DishPortionServing").getSimpleValue()==null)
			{
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
			}
			else
			{
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
		}
		else if (ItemRef.getTarget().getObjectType().getID()=="DishRecipe")
		{
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
			Item=ItemRef;
		}
		else
		{
			//logger.info("Something went wrong while passing the Function with argument");
		}
	}
	else if(ObjectType=="GuestChoiceObj" || ObjectType=="GCSubRecipe")
	{
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
	}
	else if(ObjectType=="UpgradeObj")
	{
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
	}
	else if(ObjectType=="Ingredient")
	{
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
		Item=ItemRef;
	}

    var nutritionVal = '';
    var nutritionHtml = '';
    for (var i = 0; i < nutrition.length; i++)
    {
        if (i == 0 || i == 1)
		{
            nutritionVal = Number(Item.getValue(nutrition[i]).getSimpleValue()).toFixed(0);
        }
		else
        {
            if (i == 7)
            {
                nutritionVal = Number(Item.getValue(nutrition[i]).getSimpleValue()).toFixed(2);
            }
            else
            {
                nutritionVal = Number(Item.getValue(nutrition[i]).getSimpleValue()).toFixed(1);
            }
        }
		nutritionHtml = nutritionHtml + '<td style="border: 1px solid black;padding: 1px;text-align: center;">' + nutritionVal + '</td>';
    }
    return (nutritionHtml);
}
