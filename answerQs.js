var fs = require('fs'),
	_ = require('lodash'),
	bt = require('./birdTools.js'),
	parseData = require('./parseData.js'),
	sys = require("sys"),
	stdin = process.openStdin();	

var data = parseData.processText();
var jsonData = parseData.toJSON(data);
jsonData = _.takeRight(jsonData, jsonData.length-1);

var problemSet1 = function(){
	//First 20 Questions
	//question 1
	// How many total observations?
	console.log("\nSample Questions");
	console.log("\nQuestion 1: How many total observations are there in this dataset?");
	console.log(jsonData.length);

	//qeustion 2
	// What are the three most common birds?
	console.log("\nQuestion 2: What were the three most common birds found?")
	var birds = bt.getMostCommon(bt.selectAttr('common_name'), 3, jsonData);
	console.log(birds[0][0] + ": " + birds[0][1] + ", " + birds[1][0] + ": " + birds[1][1] + ", " + birds[2][0] + ": " + birds[2][1]);

	//question 3
	// What state had the most observations?
	console.log("\nQuestion 3: What state had the most observations of birds?")
	console.log(bt.getMostCommon(bt.selectAttr('state'), 1, jsonData))
	console.log("\n\n")

	//Question 4
	// What is the most number of count made by a person in a single observation?
	console.log("\nQuestion 4:")
	console.log(bt.getMax(bt.selectNum('observation_count'), jsonData));

	//Question 5
	//How many unique taxonomy ids?
	console.log("\nQuestion 5:")
	console.log(bt.countUnique(bt.selectAttr('taxonomic_order'), jsonData));

	//Question 6
	//What is the longest common name?
	console.log("\nQuestion 6:")
	var comLen = function(elem) { return elem.common_name.length;}
	console.log(bt.getMax(comLen, jsonData));

	//Question 7
	//Who observed the most birds? List their first and last name.
	console.log("\nQuestion 7:");
	console.log(bt.getMostCommon(bt.selectAttr('full_name'), Infinity, jsonData));

	//Question 8
	//How many kinds of hybrid species are there?
	console.log("\nQuestion 8:");
	console.log(bt.countUnique(bt.selectAttr('hybrid'), jsonData));

	//Question 9
	//What time of year has the most observations?
	console.log("\nQuestion 9:");
	var getMonth = function(elem) {return elem.observation_date.split('-')[1]; }
	console.log(bt.getMostCommon(getMonth, Infinity, jsonData))

	//Question 10
	//Which bird was observed in the most number of states/countries?
	console.log("\nQuestion 10:");
	console.log(bt.mostInLocation(jsonData));

	//Question 11
	//What is the average duration of an observation?


	//Question 12
	//How many bird species have American in their common name?
	console.log("\nQuestion 12:")
	var findAmerican = function(elem) {
		if(elem.common_name.indexOf("American") > -1){
			return "Contains American";
		}
		else{
			return "Does Not Contain";
		}
	}
	console.log(bt.getPercent(findAmerican, false, jsonData));

	//Question 13
	//What percentage of time do the observers identify a bird’s sex?
	console.log("\nQuestion 13:")
	var hasSex = function(elem){
		if(elem.common_name.indexOf("Male") > -1 || elem.common_name.indexOf("Female") > -1){
			return "Has Sex";
		}
		else{
			return "Does not have sex";
		}
	}
	console.log(bt.getPercent(hasSex, true, jsonData));

	//Question 14
	//How many different countries?
	console.log("\nQuestion 14:");
	console.log(bt.countUnique(bt.selectAttr('country'), jsonData));

	//Question 15
	//Which country has the most number of observers?
	console.log("\nQuestion 15:");
	console.log(bt.getMostCommon(bt.selectAttr('country'),Infinity, jsonData));

	//Question 16
	//Which column has the most number of missing data?
	console.log("\nQuestion 16:");
	console.log(bt.greatestMissing(1, jsonData));


	//Question 17
	//Which locality type is the most frequent?
	console.log("\nQuestion 17:");
	console.log(bt.getMostCommon(bt.selectAttr('locality_type'),Infinity, jsonData));

	//Question 18
	//What is the longest trip comment?
	console.log("\nQuestion 18:");
	var commentLength = function(elem) {return elem.trip_comments.length;}
	console.log(bt.getMax(commentLength, jsonData));

	//Question 19
	//What is the highest latitude an observation was taken?
	console.log("\nQuestion 19:");
	console.log(bt.getMax(bt.selectNum('latitude'), jsonData));

	//Question 20
	//When was the earliest date and the most recent date?
	console.log("\nQuestion 20:");
	var selectDate = function(key){
		return function(elem){return new Date(elem[key]);};
	}
	console.log("Earliest Date:", bt.getMax(selectDate('observation_date'), jsonData));
	console.log("Oldest Date:", bt.getMin(selectDate('observation_date'), jsonData));
}

var problemSet2 = function(){
	//Next Set of Questions

	//What is the difference in count between the most and least common birds?
	console.log("\nQuestion 21");
	var common_birds = bt.getMostCommon(bt.selectAttr('common_name'), Infinity, jsonData);
	console.log(common_birds[0]);
	console.log(common_birds[common_birds.length - 1]);
	console.log(common_birds[0][1] - common_birds[common_birds.length-1][1]);

	//What is the difference between the US state with the most and least observations?
	console.log("\nQuestion 22");
	var states = bt.getMostCommon(bt.selectAttr('state'), Infinity, jsonData);
	console.log(states[0]);
	console.log(states[states.length - 1])
	console.log(states[0][1] - states[states.length-1][1]);

	//What is the difference between the most and least number of count made by a person in a single observation?
	console.log("\nQuestion 22");
	console.log(bt.getMax(bt.selectNum('observation_count'), jsonData)['observation_count']
	 - bt.getMin(bt.selectNum('observation_count'), jsonData)['observation_count']);

	//What is the difference in character length between the shortest and longest names?
	console.log("\nQuestion 23");
	var commonLength = function(elem){return elem.common_name.length};
	console.log(bt.getMax(commonLength, jsonData)['common_name'].length
	 - bt.getMin(commonLength, jsonData)['common_name'].length);

	//How many months between the time of year has the most observations and that with the least?
	console.log("\nQuestion 24");
	console.log("Most Observations in month:", bt.getMax(bt.selectNum('observation_count'), jsonData)['observation_date'].substring(5,7));
	console.log("LeastObservations in month:", bt.getMin(bt.selectNum('observation_count'), jsonData)['observation_date'].substring(5,7));

	//What is the difference in observation count for the bird in the most number of states/countries and that in the least?
	//?

	//What is the difference between the longest and shortest duration of an observation?
	//?

	//How many bird species have American in their common name as opposed to those with European in their name?
	console.log("\nQuestion 27");
	var findAmerican = function(elem) {
		if(elem.common_name.indexOf("American") > -1){
			return "Contains American";
		}
		else{
			return "Does Not Contain";
		}
	}
	console.log("American birds:", bt.getPercent(findAmerican, false, jsonData)[1][1]);
	var findEuropean = function(elem) {
		if(elem.common_name.indexOf("European") > -1){
			return "Contains European";
		}
		else{
			return "Does Not Contain";
		}
	}
	console.log("European birds:", bt.getPercent(findEuropean, false, jsonData)[1][1]);
	
	//Whats the difference between in number of observers for country with the most as opposed to that with the least?
	console.log("\nQuestion 28");
	var common_countries = bt.getMostCommon(bt.selectAttr('country'), Infinity, jsonData);
	console.log(common_countries[0]);
	console.log(common_countries[common_countries.length - 1]);
	console.log(common_countries[0][1] - common_countries[common_countries.length-1][1]);	

	//How close is the difference between the 5 columns missing the most data as opposed to the 5 missing the least?

	//What is the range of observations between the most frequent and least frequent locality types?
	console.log("\nQuestion 30");
	var loctypes = bt.getMostCommon(bt.selectAttr('locality_type'), Infinity, jsonData);
	console.log(loctypes[0]);
	console.log(loctypes[loctypes.length - 1]);
	console.log(loctypes[0][1] - loctypes[loctypes.length-1][1]);

	//What is the difference between the longest and shortest trip comment?
	console.log("\nQuestion 31");
	var commentLength = function(elem) {return elem.trip_comments.length;}
	var comMax = bt.getMax(commentLength, jsonData);
	var comMin = bt.getMin(commentLength, jsonData);
	console.log(comMax);
	console.log(comMin);
	console.log(commentLength(comMax) - commentLength(comMin));

	//What is difference between the highest and lowest latitude?
	console.log("\nQuestion 32")
	console.log(bt.getMax(bt.selectNum('latitude'), jsonData));
	//How long was there between the first and last observation?
}

var main = function(){
	var displayOptions = function(){
		console.log("Select a question type:");
		console.log("[1]\t Quit");
		console.log("[2]\t Attribute Options");
		console.log("[3]\t Question Set 1");
		console.log("[4]\t Question Set 2");
		console.log("[5]\t What is the most common...?");
		console.log("[6]\t What is the maximum (number)...?");
		console.log("[7]\t How many unique...?");
		console.log("[8]\t What's the average of...?");
		console.log("[9]\t What's the minimum (number)...?");
		console.log("[10]\t How many have <phrase> in...?");
		console.log("[11]\t How many have <greater/less> than...?");
		console.log("---------------------------------------------");
	}
	displayOptions();
	prevSelect = 0;
	stdin.addListener("data", function(d) {
	    d = d.toString();
	    d = d.substring(0, d.length - 1);
	    if(prevSelect === 10){
	    	d = d.split(" ");
	    	var attr = d[0];
	    	var phrase = d[1];
			console.log(bt.getPercent(bt.selectPhrase(phrase), false, jsonData));
			prevSelect = 0;
			console.log("");
			displayOptions();
	    }
    	else if(prevSelect === 9){
	    	console.log("\nWhat is the minimum " + d + "?");
	    	var ans = bt.getMin(bt.selectNum(d), jsonData);
	    	if(ans.length === 0){
	    		console.log("Could not find attribute");
	    	}
	    	else{
	    		console.log(ans);
	    	}
	    	prevSelect = 0;
	    	console.log("");
	    	displayOptions();
	    }
    	else if(prevSelect === 8){
	    	console.log("\nWhat's the average of " + d + "?");
	    	var ans = bt.getAvg(bt.selectNum(d), jsonData);
    		console.log(ans);
	    	prevSelect = 0;
	    	console.log("");
	    	displayOptions();
	    }
    	else if(prevSelect === 7){
	    	console.log("\nHow many unique " + d + "s are there?");
	    	var ans = bt.countUnique(bt.selectAttr(d), jsonData);
	    	if(ans.length === 0){
	    		console.log("Could not find attribute");
	    	}
	    	else{
	    		console.log(ans);
	    	}
	    	prevSelect = 0;
	    	console.log("");
	    	displayOptions();
	    }
    	else if(prevSelect === 6){
	    	console.log("\nWhat is the maximum " + d + "?");
	    	var ans = bt.getMax(bt.selectNum(d), jsonData);
	    	if(ans.length === 0){
	    		console.log("Could not find attribute");
	    	}
	    	else{
	    		console.log(ans);
	    	}
	    	prevSelect = 0;
	    	console.log("");
	    	displayOptions();
	    }
	    else if(prevSelect === 5){
	    	d = d.split(" ");
	    	attr = d[0];
	    	num = parseFloat(d[1]);
	    	console.log("\nWhat are the " + num + " most common " + attr + "?");
	    	var ans = bt.getMostCommon(bt.selectAttr(attr), num, jsonData);
	    	if(ans.length === 0){
	    		console.log("Could not find attribute");
	    	}
	    	else{
	    		console.log(ans);
	    	}
	    	prevSelect = 0;
	    	console.log("");
	    	displayOptions();
	    }
	    else{
	    	d = parseFloat(d);
    	    if (d === 11){
    	    	console.log("Not yet implemented");	
    	    }
    	    else if (d === 10){
    	    	console.log("Select attribute and phrase (<attr> <phrase>)");	
    	    	prevSelect = 10;
    	    }	
    	    else if (d === 9){
    	    	prevSelect = 9;
    	    	console.log("\nSelect an attribute (must be a number)");	
    	    }
    	    else if (d === 8){
				console.log("\nSelect an attribute (must be a number)");
				prevSelect = 8;
    	    }
    	    else if(d === 7){
    	    	prevSelect = 7;
    	    	console.log("\nSelect an attribute");
    	    }
    	    else if(d === 6){
    	    	prevSelect = 6;
    	    	console.log("\nSelect an attribute (must be a number)");
    	    }
    	    else if(d === 5){
    	    	prevSelect = 5;
    	    	console.log("\nSelect an attribute and amount (<attribute> <amount>)");
    	    }
    	    else if(d === 4){
    	    	problemSet2();
    	    	console.log(" ")
    		    displayOptions();
    	    }
    	    else if(d === 3){
    	    	problemSet1();
    	    	console.log(" ")
    		    displayOptions();
    	    }
    	    else if(d === 2){
    	    	console.log(" ")
    	    	console.log("global_unique_identifier");
				console.log("taxonomic_order");				
				console.log("category");				
				console.log("common_name");				
				console.log("scientific_name");				
				console.log("subspecies_common");				
				console.log("subspecies_scientific");				
				console.log("observation_count");				
				console.log("breeding_bird_atlas_code");				
				console.log("age_sex");				
				console.log("country");
				console.log("country_code");
				console.log("state");
				console.log("state_code");
				console.log("county");
				console.log("county_code");
				console.log("iba_code");
				console.log("bcr_code");
				console.log("locality");
				console.log("locality_id");
				console.log("locality_type");
				console.log("latitude");
				console.log("longitude");
				console.log("observation_date");
				console.log("time_observations_started");
				console.log("trip_comments");
				console.log("species_comment");
				console.log("observer_id");
				console.log("first_name");
				console.log("last_nmae");
				console.log("sampling_event_identifier");
				console.log("protocol_type");
				console.log("project_code");
				console.log("duration_minutes");
				console.log("effort_distance_km");
				console.log("effor_area_ha");
				console.log("number_observers");
				console.log("all_species_reported");
				console.log("group_identifier");
				console.log("approved");
				console.log("reviewed");
				console.log("reviewed");
				console.log("full_name\n");
				displayOptions();
    	    }
    	    else if(d === 1){
    	    	process.exit(0);
    	    }
    	    else{
    	    	console.log("Invalid input");
    	    }
	    }
  	});
}

main();
process.stdout.on('error', process.exit);