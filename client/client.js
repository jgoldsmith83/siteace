$(".js-btn-remove").hide();

	Router.configure({
		layoutTemplate: 'homeLayout'
	});

	Router.route("/", function() {
		this.render("navbar", {
			to: "navbar"
		});

		this.render("website_list", {
				to: "main"
		});

		this.render("website_form", {
			to: "sidebar"
		});
	});

	Router.route("/:_id", function() {
		this.render("navbar", {
			to: "navbar"
		});

		this.render("site_details", {
			to: "main",
			data: function() {
				return Websites.findOne({_id:this.params._id});
			}
		});

	});


	/////
	// Packaged template configs 
	/////

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	})

	
	Comments.ui.config({
		template: "bootstrap"
	})


	Session.set('searchTerm', null)

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			if(Session.get('searchTerm')){
				return Websites.find({title:Session.get('searchTerm')}, {sort: {rating: -1}})
			} else {
				return Websites.find({}, {sort: {rating: -1}});
			}
		}
	});

	Template.website_item.helpers({
		admin: function() {
			if(Meteor.user()) {
				if(Meteor.user().username === "DotSlashAttack") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	});

	Template.navbar.helpers({
		websites:function(){
			return Websites.find({});
		}
	});


	/////
	// template events 
	/////

	Template.navbar.events({
		"click .js-btn-search":function(event) {
			var searchText = $('.form-control').val();
			
			if(! searchText == null) {
				Session.set('searchTerm', searchText)
			}
		}
	});

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			// put the code in here to add a vote to a website!
			if(Meteor.user()) {
				Websites.update({_id:website_id}, 
												{$inc: {rating: 1}});

				return false;// prevent the button from reloading the page
			} else {
				Bert.alert("Only registered users can vote.", "danger", "growl-top-left");
			}
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;

			// put the code in here to remove a vote from a website!
			if(Meteor.user()) {
				Websites.update({_id:website_id}, 
												{$inc: {rating: -1}});

				return false;// prevent the button from reloading the page
			} else {
				Bert.alert("Only registered users can vote!", "danger", "growl-top-left");
			}
		},
		"click .js-btn-remove":function(event){
			var entry_id = this._id;

			$("#"+entry_id).hide("slow", function() {
				Websites.remove({_id:entry_id});
			});
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){

			$(".js-toggle-website-form").hide(500, function() {
				$("#website_form").toggle('slow');
			});
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			
			//  put your website saving code in here!
			var url = event.target.url.value;
			var title = event.target.title.value;
			var description = event.target.description.value;
			var image = event.target.image.value;

			if (url.length < 1) {
				Bert.alert("You need to include a URL", "danger", "growl-top-right");
				console.log(description)
			} else if (title.length < 1) {
				Bert.alert("C'mon, add a title...", "warning", "growl-top-right");
			} else if(description.length < 1) {

				Bert.alert("You didn't add a description", "warning", "growl-top-right");
				if(image.length < 1) {
					Bert.alert("You didn't add a screenshot", "warning", "growl-top-right");
					Websites.insert({
						title:title,
						url:url,
						user:Meteor.user().username,
						description:"A site added by " + Meteor.user().username,
						image:"no-image.jpg",
						createdOn:new Date(),
						rating:0
					});

				$("#website_form").toggle('slow', function() {
					$(".js-toggle-website-form").show(500);
				});

				} else {
					Bert.alert("Your site has been added!", "success", "growl-top-right");
					Websites.insert({
						title:title,
						url:url,
						user:Meteor.user().username,
						description:description,
						image:image,
						createdOn:new Date(),
						rating:0
					});

					$("#website_form").toggle('slow', function() {
						$(".js-toggle-website-form").show(500);
					});
				}
				
			} else if (image.length < 1) {
				Bert.alert("You didn't add a screenshot", "warning", "growl-top-right");
				Websites.insert({
					title:title,
					url:url,
					user:Meteor.user().username,
					description:description,
					image:"no-image.jpg",
					createdOn:new Date(),
					rating:0
				})

				$("#website_form").toggle('slow', function() {
					$(".js-toggle-website-form").show(500);
				});

			} else {
				Bert.alert("Your site has been added!", "success", "growl-top-right");
				Websites.insert({
					title:title,
					url:url,
					user:Meteor.user().username,
					description:description,
					image:image,
					createdOn:new Date(),
					rating:0
				})

				$("#website_form").toggle('slow', function() {
					$(".js-toggle-website-form").show(500);
				});

			}

			return false;// stop the form submit from reloading the page

		},
		'click .js-close-form':function(event) {

			$("#website_form").toggle('slow', function() {
					$(".js-toggle-website-form").show(500);
			});

			return false;

		}
	});