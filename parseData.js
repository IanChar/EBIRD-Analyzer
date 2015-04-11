var fs = require('fs'),
	_ = require('lodash');
	//MongoClient = require('mongodb').MongoClient;
	

var loaded_categories = false;

var processText = function(){
	var text = fs.readFileSync(process.argv[2], 'utf-8');
	lines = text.split('\n');
	var processed = [];
	lines.forEach(function(element){
		processed.push(element.split('\t'));
	})
	return processed;
}

var toJSON = function(l){
	returnJSON = []
	l.forEach(function(data){

		toAdd = {
			global_unique_identifier : data[0],
			taxonomic_order : data[1],
			category : data[2],
			common_name : data[3],
			scientific_name : data[4],
			subspecies_common : data[5],
			subspecies_scientific : data[6],
			observation_count : data[7],
			breeding_bird_atlas_code : data[8],
			age_sex : data[9],
			country : data[10],
			country_code : data[11],
			state : data[12],
			state_code : data[13],
			county : data[14],
			county_code : data[15],
			iba_code : data[16],
			bcr_code : data[17],
			locality : data[18],
			locality_id : data[19],
			locality_type : data[20],
			latitude : data[21],
			longitude : data[22],
			observation_date : data[23],
			time_observations_started : data[24],
			trip_comments : data[25],
			species_comment : data[26],
			observer_id : data[27],
			first_name : data[28],
			last_nmae : data[29],
			sampling_event_identifier : data[30],
			protocol_type : data[31],
			project_code : data[32],
			duration_minutes : data[33],
			effort_distance_km : data[34],
			effor_area_ha : data[35],
			number_observers : data[36],
			all_species_reported : data[37],
			group_identifier : data[38],
			approved : data[39],
			reviewed : data[40],
			reviewed : data[41],
			full_name : data[28] + " " + data[29]
		};
		if(toAdd.global_unique_identifier !== '' && toAdd.global_unique_identifier !== "TAXONOMIC ORDER"){
			returnJSON.push(toAdd);
		}
	});
	return returnJSON;
}

var data = processText();
var jsonData = toJSON(data);
jsonData = _.takeRight(jsonData, jsonData.length-1);

// Selects an attribute from the data
// Params:
//	-key: String of attribute desired
// Return:
//	-Returns function that can be used to select key
var selectAttr = function(key){
	return function(elem){return elem[key];};
}

// Selects an attribute from the data in number form
// Params:
//	-key: String of attribute desired
// Return:
//	-Returns function that can be used to select key
var selectNum = function(key){
	return function(elem){
		var ret = parseInt(elem[key]);
		// if(isNaN(ret)){
		// 	ret = 0;
		// }
		return ret;
	};
}

//Gets num most common attribute selected by key_func
// Params: 
//	-key_func: function that selects specific attribute
//	-num: Amount of maximums to get
// Returns a sorted nested array where each inner array 
// is a key-value pair
var getMostCommon = function(key_func, num){
	names = _.countBy(jsonData, key_func);
	var ocurrences = [];
	for(var key in names){
		if(names.hasOwnProperty(key)){
			ocurrences.push([key, names[key]]);
		}
	}
	ocurrences = _.sortBy(ocurrences, function(elem){
		return -1 * elem[1];
	});
	return ocurrences.slice(0,num);
}

//Gets max of all data
// Params:
//	-key_func: function that selects specific number
// Returns: JSON for specific data sought after
var getMax = function(key_func){
	var max_index = 0;
	var max_value = 0;
	var ocurrences = _.map(jsonData, key_func);
	for(var i = 0; i < ocurrences.length; i++){
		if(max_value < ocurrences[i]){
			max_value = ocurrences[i];
			max_index = i;
		}
	}
	return jsonData[max_index];
}

var getMin = function(key_func){
	var min_index = 0;
	var min_value = Infinity;
	var ocurrences = _.map(jsonData, key_func);
	for(var i = 0; i < ocurrences.length; i++){
		if(min_value > ocurrences[i]){
			min_value = ocurrences[i];
			min_index = i;
		}
	}
	return jsonData[min_index];
}

//Counts how much of the data has unique attribute
// Params:
//	-key_func: function that selects specific attribute
// Returns: number of unique attributes
var countUnique = function(key_func){
	var elems = _.map(jsonData, key_func);
	var seen = {};
	var count = 0;
	for(var i = 0; i < elems.length; i++){
		if(!seen.hasOwnProperty(elems[i])){
			count++;
			seen[elems[i]] = true;
		}
	}
	return count;
}

//Gives the average of a particular number
// Params:
//	-key_func: function that selects specific number
// Returns: average of that number
var getAvg = function(key_func){
	var elems = _.map(jsonData, key_func);
	var sum = 0;
	for(var i = 0; i < elems.length; i++){
		sum += elems[i];
	}
	return sum/elems.length;
}

var getPercent = function(key_func, as_percent){
	var stats = _.countBy(jsonData, key_func);
	var data = [];
	for(var key in stats){
		if(stats.hasOwnProperty(key)){
			data.push([key, stats[key]]);
		}
	}
	if(as_percent){
		var total = jsonData.length;
		for(var i = 0; i < data.length; i++){
			data[i][1] = data[i][1]/total;
		}
		return data;
	}	
	return data;
}

var mostInLocation = function(){
	var groupings = _.groupBy(jsonData, function(elem){
		return elem.common_name;
	});
	for(var key in groupings){
		var seen  = {};
		count = 0;
		var curr_arr = groupings[key];
		for(var i = 0; i < curr_arr.length; i++){
			if(!seen.hasOwnProperty(curr_arr[i])){
				count++;
				seen[curr_arr[i]] = true;
			}
		}
		groupings[key] = count;
	}
	var maxKey = 0;
	var maxValue = 0;
	for(var key in groupings){
		if(groupings[key] > maxValue){
			maxValue = groupings[key];
			maxKey = key;
		}
	}
	return maxKey;
}


var greatestMissing = function(num){
	var countMissing = function(data_entry){
		var count =  _.countBy(data_entry, function(elem){
			if(elem === '' || elem === 'x')
				return "Blank"
			else
				return "Filled"
		});
		return [data_entry, count['Blank']];
	}
	results = _.map(jsonData, countMissing);
	results = _.sortBy(results, function(elem){
		return elem[1];
	});
	return results.slice(0,num); 
}

var main = function(){
	//First 20 Questions
	// //question 1
	// How many total observations?
	console.log("\nSample Questions");
	console.log("\nQuestion 1: How many total observations are there in this dataset?");
	console.log(jsonData.length);

	//qeustion 2
	// What are the three most common birds?
	console.log("\nQuestion 2: What were the three most common birds found?")
	var birds = getMostCommon(selectAttr('common_name'), 3);
	console.log(birds[0][0] + ": " + birds[0][1] + ", " + birds[1][0] + ": " + birds[1][1] + ", " + birds[2][0] + ": " + birds[2][1]);

	//question 3
	// What state had the most observations?
	console.log("\nQuestion 3: What state had the most observations of birds?")
	console.log(getMostCommon(selectAttr('state'), 1))
	console.log("\n\n")

	// //Question 4
	// // What is the most number of count made by a person in a single observation?
	// console.log("\nQuestion 4:")
	// console.log(getMax(selectNum('observation_count')));

	// //Question 5
	// //How many unique taxonomy ids?
	// console.log("\nQuestion 5:")
	// console.log(countUnique(selectAttr('taxonomic_order')));

	// //Question 6
	// //What is the longest common name?
	// console.log("\nQuestion 6:")
	// var comLen = function(elem) { return elem.common_name.length;}
	// console.log(getMax(comLen));

	// //Question 7
	// //Who observed the most birds? List their first and last name.
	// console.log("\nQuestion 7:");
	// console.log(getMostCommon(selectAttr('full_name')));

	// //Question 8
	// //How many kinds of hybrid species are there?
	// console.log("\nQuestion 8:");
	// console.log(countUnique(selectAttr('hybrid')));

	// //Question 9
	// //What time of year has the most observations?
	// console.log("\nQuestion 9:");
	// var getMonth = function(elem) {return elem.observation_date.split('-')[1]; }
	// console.log(getMostCommon(getMonth))

	// //Question 10
	// //Which bird was observed in the most number of states/countries?
	// console.log("\nQuestion 10:");
	// console.log(mostInLocation());

	// //Question 11
	// //What is the average duration of an observation?


	// //Question 12
	// //How many bird species have American in their common name?
	// console.log("\nQuestion 12:")
	// var findAmerican = function(elem) {
	// 	if(elem.common_name.indexOf("American") > -1){
	// 		return "Contains American";
	// 	}
	// 	else{
	// 		return "Does Not Contain";
	// 	}
	// }
	// console.log(getPercent(findAmerican, false));

	// //Question 13
	// //What percentage of time do the observers identify a bird’s sex?
	// console.log("\nQuestion 13:")
	// var hasSex = function(elem){
	// 	if(elem.common_name.indexOf("Male") > -1 || elem.common_name.indexOf("Female") > -1){
	// 		return "Has Sex";
	// 	}
	// 	else{
	// 		return "Does not have sex";
	// 	}
	// }
	// console.log(getPercent(hasSex, true));

	// //Question 14
	// //How many different countries?
	// console.log("\nQuestion 14:");
	// console.log(countUnique(selectAttr('country')));

	// //Question 15
	// //Which country has the most number of observers?
	// console.log("\nQuestion 15:");
	// console.log(getMostCommon(selectAttr('country')));

	// //Question 16
	// //Which column has the most number of missing data?
	// console.log("\nQuestion 16:");
	// console.log(greatestMissing(1));


	// //Question 17
	// //Which locality type is the most frequent?
	// console.log("\nQuestion 17:");
	// console.log(getMostCommon(selectAttr('locality_type')));

	// //Question 18
	// //What is the longest trip comment?
	// console.log("\nQuestion 18:");
	// var commentLength = function(elem) {return elem.trip_comments.length;}
	// console.log(getMax(commentLength));

	// //Question 19
	// //What is the highest latitude an observation was taken?
	// console.log("\nQuestion 19:");
	// console.log(getMax(selectNum('latitude')));

	// //Question 20
	// //When was the earliest date and the most recent date?
	// console.log("\nQuestion 20:");
	// var selectDate = function(key){
	// 	return function(elem){return new Date(elem[key]);};
	// }
	// console.log("Earliest Date:", getMax(selectDate('observation_date')));
	// console.log("Oldest Date:", getMin(selectDate('observation_date')));

	//Next Set of Questions

	// //What is the difference in count between the most and least common birds?
	// console.log("\nQuestion 21");
	// var common_birds = getMostCommon(selectAttr('common_name'));
	// console.log(common_birds[0][1] - common_birds[common_birds.length-1][1]);
	// //What is the difference between the US state with the most and least observations?
	// console.log("\nQuestion 22");
	// var states = getMostCommon(selectAttr('state'));
	// console.log(states[0][1] - states[states.length-1][1]);
	// //What is the difference between the most and least number of count made by a person in a single observation?
	// console.log("\nQuestion 22");
	// console.log(getMax(selectNum('observation_count'))['observation_count']
	//  - getMin(selectNum('observation_count'))['observation_count']);
	// //What is the difference in character length between the shortest and longest names?
	// console.log("\nQuestion 23");
	// var commonLength = function(elem){return elem.common_name.length};
	// console.log(getMax(commonLength)['common_name'].length
	//  - getMin(commonLength)['common_name'].length);
	// //How msany months between the time of year has the most observations and that with the least?

	//What is the difference in observation count for the bird in the most number of states/countries and that in the least?
	//What is the difference between the longest and shortest duration of an observation?
	//How many bird species have American in their common name as opposed to those with European in their name?
	//Whats the difference between in number of observers for country with the most as opposed to that with the least?
	//How close is the difference between the 5 columns missing the most data as opposed to the 5 missing the least?
	//What is the range of observations between the most frequent and least frequent locality types?
	//What is the difference between the longest and shortest trip comment?
	//What is difference between the highest and lowest latitude?
	//How long was there between the first and last observation?
}

main();
process.stdout.on('error', process.exit);

