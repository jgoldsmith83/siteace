Websites = new Mongo.Collection("websites");


//Security on Websites collection
Websites.allow({
	insert: function(userId, doc) {
		if(Meteor.user()) {
			if(userId == Meteor.user()._id) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	remove: function(userId, doc) {
		if(Meteor.user().username == "DotSlashAttack") {
			return true;
		} else {
			return false;
		}
	},
	update: function(userId, doc) {
		if(Meteor.user()) {
			return true;
		} else {
			return false;
			alert("Login to vote.");
		}
	}
});
