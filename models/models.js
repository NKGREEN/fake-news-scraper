//var orm = require()

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BreitbartSchema = new Schema({

	url: {
		type: String
	},
	title: {
		type: String
	},
	imgUrl: {
		type: String
	},
	excerpt: {
		type: String
	}
});

var Breitbart = mongoose.model("Breitbart", BreitbartSchema);

module.exports = Breitbart;