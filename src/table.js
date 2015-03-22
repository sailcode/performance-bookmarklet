/*
Logic for Request analysis table
*/


onIFrameLoaded(function(){
	var requestsOnly = allResourcesCalc.filter(function(currR) {
		return currR.name.indexOf("http") === 0 && !currR.name.match(/js.map$/);
	});

	window.requestsOnly = requestsOnly;

	var output = requestsOnly.reduce(function(collectObj, currR){
		var fileTypeData = collectObj[currR.fileType],
			initiatorTypeData;

		if(!fileTypeData){
			fileTypeData = collectObj[currR.fileType] = {
				"fileType" : currR.fileType,
				"count" : 0,
				"initiatorType" : {},
				"requestsToHost" : 0,
				"requestsToExternal" : 0
			};
		}

		initiatorTypeData = fileTypeData.initiatorType[currR.initiatorType];
		if(!initiatorTypeData){
			initiatorTypeData = fileTypeData.initiatorType[currR.initiatorType] = {
				"initiatorType" : currR.initiatorType,
				"count" : 0,
				"requestsToHost" : 0,
				"requestsToExternal" : 0
			}
		}

		fileTypeData.count++;
		initiatorTypeData.count++;

		if(currR.isRequestToHost){
			fileTypeData.requestsToHost++;
			initiatorTypeData.requestsToHost++;
		}else{
			fileTypeData.requestsToExternal++;
			initiatorTypeData.requestsToExternal++;
		}

		return collectObj;
	}, {});

	var sectionHolder = newTag("div", {
		class : "table-seciton-holder"
	});
	sectionHolder.appendChild(newTag("h1", {text : "Request Types & Initiators"}));

	
	sectionHolder.appendChild(tableFactory("filetypes-and-intiators-table", function(theadTr){
			[
				"FileType",
				"Count",
				"Count Internal",
				"count external",
				"Initiator Type",
				"Count by Initiator Type",
				"Initiator Type Internal",
				"Initiator Type external"
			].forEach(function(x){
				theadTr.appendChild(newTag("th", {
					text : x
				}));
			});
			return theadTr;

		}, function(tbody){
			Object.keys(output).forEach(function(key, i){
				var fileTypeData = output[key],
					initiatorTypeKeys = Object.keys(fileTypeData.initiatorType),
					firstinitiatorTypeKey = fileTypeData.initiatorType[initiatorTypeKeys[0]],
					rowspan = initiatorTypeKeys.length;

				var tr = newTag("tr", {
					class : "file-type-row " + (fileTypeData.fileType||"other") + "-light"
				});

				[
					fileTypeData.fileType,
					fileTypeData.count,
					fileTypeData.requestsToHost,
					fileTypeData.requestsToExternal,
					firstinitiatorTypeKey.initiatorType,
					firstinitiatorTypeKey.count,
					firstinitiatorTypeKey.requestsToHost,
					firstinitiatorTypeKey.requestsToExternal,

				].forEach(function(val, i){
					var settings = {
						text : val
					};
					if(i < 4 && initiatorTypeKeys.length > 1){
						settings.rowSpan = rowspan;
					}else if(i >= 4){
						settings.class = (initiatorTypeKeys[0]||"other") + "-light";

					}
					tr.appendChild(newTag("td", settings));
				});

				tbody.appendChild(tr);

				initiatorTypeKeys.slice(1).forEach(function(initiatorTypeKey){
					var initiatorTypeData = fileTypeData.initiatorType[initiatorTypeKey];
					var tr2 = newTag("tr", {
						class : "initiator-type-more " + (initiatorTypeKey||"other") + "-light"
					});
					tr2.appendChild(newTag("td", {
						text : initiatorTypeKey
					}));
					tr2.appendChild(newTag("td", {
						text : initiatorTypeData.count
					}));
					tr2.appendChild(newTag("td", {
						text : initiatorTypeData.requestsToHost
					}));  
					tr2.appendChild(newTag("td", {
						text : initiatorTypeData.requestsToExternal
					}));  

					tbody.appendChild(tr2)
				});
			});

			return tbody;
	}));

	outputContent.appendChild(sectionHolder);

});
