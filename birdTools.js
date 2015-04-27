var fs = require('fs'),
	_ = require('lodash');

var birdTools = exports = module.exports = {};

// Selects an attribute from the data
// Params:
//	-key: String of attribute desired
// Return:
//	-Returns function that can be used to select key
birdTools.selectAttr = function(key){
	return function(elem){return elem[key];};
}

// Selects an attribute from the data in number form
// Params:
//	-key: String of attribute desired
// Return:
//	-Returns function that can be used to select key
birdTools.selectNum = function(key){
	return function(elem){
		var ret = parseInt(elem[key]);
		// if(isNaN(ret)){
		// 	ret = 0;
		// }
		return ret;
	};
}

birdTools.selectPhrase = function(phrase){
	return function(elem) {
		if(elem.common_name.indexOf(phrase) > -1){
			return "Contains " + phrase;
		}
		else{
			return "Does Not Contain";
		}
	}
}

//Gets num most common attribute selected by key_func
// Params: 
//	-key_func: function that selects specific attribute
//	-num: Amount of maximums to get
// Returns a sorted nested array where each inner array 
// is a key-value pair
birdTools.getMostCommon = function(key_func, num, jsonData){
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
birdTools.getMax = function(key_func, jsonData){
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

birdTools.getMin = function(key_func, jsonData){
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
birdTools.countUnique = function(key_func, jsonData){
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
birdTools.getAvg = function(key_func, jsonData){
	var elems = _.map(jsonData, key_func);
	var sum = 0;
	var counter = 0;
	for(var i = 0; i < elems.length; i++){
		if(!isNaN(elems[i])){
			sum += elems[i];
			counter++;
		}
	}
	return sum/counter;
}

birdTools.getPercent = function(key_func, as_percent, jsonData){
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

birdTools.mostInLocation = function(jsonData){
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


birdTools.greatestMissing = function(num, jsonData){
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