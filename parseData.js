var Transform = require('stream').Transform,
	csv = require('csv-streamify'),
	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:8000/naturenet');
var db = mongoose.connection;

var birdReportSchema = mongoose.Schema({
	common_name : String,
	scientific_name : String,
	observation_count : String,
	first_name : String,
	last_name : String,
	city : String,
	state : String,
	date : String
});
var Report = mongoose.model('Report', birdReportSchema);

var interpreter = new Transform({objectMode: true});
var to_csv = csv({delimiter:'\t', objectMode:true});

var loaded_categories = false;
var categories = [];
var bird_types = [];
var observation_counts = [];
var observer_names = [];
var cities = [];
var states = [];
var dates = [];


interpreter._transform = function(data, encoding, done){
	if(loaded_categories){
		var new_item = new Report({
			common_name : data[3],
			scientific_name : data[4],
			observation_count : data[7],
			first_name : data[28],
			last_name : data[29],
			city : data[14],
			state : data[12],
			date : data[23]
		});
		new_item.save(function (err, new_item) {
		  if (err) return console.error(err);
		  console.log(new_item.common_name);
		});
		// bird_types.push(data[3] + " AKA " + data[4]);
		// observation_counts.push(data[7]);
		// observer_names.push(data[29] + ", " + data[28]);
		// cities.push(data[14]);
		// states.push(data[12]);
		// dates.push(data[23]);
	}
	else{
		categories = data;
		loaded_categories = true;
	}
	// console.log(categories);
	// console.log(bird_types)
	// console.log(observation_counts)
	// console.log(observer_names)
	// console.log(cities)
	// console.log(states)
	// console.log(dates)
	// console.log('\n')
	done();
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
	process.stdin
		.pipe(to_csv)
		.pipe(interpreter)

});

process.stdout.on('error', process.exit);