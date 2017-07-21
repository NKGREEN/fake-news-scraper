//var orm = require()

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BreitbartSchema = new Schema({

	url: {
		type: String,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true,
		unique: true
	},
	imgUrl: {
		type: String,
		required: true,
		unique: true
	},
	excerpt: {
		type: String,
		required: true,
		unique: true
	},
	comment: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	},
	saved: {
		type: Boolean,
		default: false
	}
});

var Breitbart = mongoose.model("Breitbart", BreitbartSchema);

module.exports = Breitbart;