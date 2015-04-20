var fs = require('fs'),
	_ = require('lodash')
	bt = require('./birdTools.js')
	parseData = require('./parseData.js')	

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
	console.log(common_birds[0][1] - common_birds[common_birds.length-1][1]);

	//What is the difference between the US state with the most and least observations?
	console.log("\nQuestion 22");
	var states = bt.getMostCommon(bt.selectAttr('state'), Infinity, jsonData);
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

	//How close is the difference between the 5 columns missing the most data as opposed to the 5 missing the least?
	//What is the range of observations between the most frequent and least frequent locality types?
	//What is the difference between the longest and shortest trip comment?
	//What is difference between the highest and lowest latitude?
	//How long was there between the first and last observation?
}

var main = function(){
	problemSet1();
}

main();
process.stdout.on('error', process.exit);