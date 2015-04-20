var fs = require('fs'),
	_ = require('lodash');
	//MongoClient = require('mongodb').MongoClient;
	

var loaded_categories = false;
var parseData = exports = module.exports = {};

parseData.processText = function(){
	var text = fs.readFileSync(process.argv[2], 'utf-8');
	lines = text.split('\n');
	var processed = [];
	lines.forEach(function(element){
		processed.push(element.split('\t'));
	})
	return processed;
}

parseData.toJSON = function(l){
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
