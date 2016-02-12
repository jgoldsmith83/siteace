	
	//routing directives
	Router.configure({
		layoutTemplate: 'homeLayout'
	});

	Router.route("/", function() {
		this.render("navbar", {
			to:"navbar"
		});

		this.render("website_list", {
				to:"main"
		});

		this.render("website_form", {
			to:"sidebar"
		});

		this.render("top_sites", {
			to:"topsiteslist"
		})
	});

	Router.route("/:_id", function() {
		this.render("navbar", {
			to:"navbar"
		});

		this.render("site_details", {
			to:"main",
			data: function() {
				return Websites.findOne({_id:this.params._id});
			}
		});

	});

	$('.search-box').keydown(function() {

	});


	// Packaged template configs
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});

	
	Comments.ui.config({
		template: "bootstrap"
	});


	//Template helper functions - return data based on context
	Template.website_list.helpers({
		websites:function(){
				if(Session.get('searchTerm')) {
					let searchText = Session.get('searchTerm');
					return Websites.find({$or: [{title: new RegExp(searchText,'gi')}, {description: new RegExp(searchText, 'gi')}]}, {sort: {rating: -1}});
				} else {
					return Websites.find({}, {sort: {rating: -1}});
				}
		}
	});

	Template.top_sites.helpers({
		topsites:function() {
			return Websites.find({}, {sort: {createdOn: -1}, limit: 5});
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

	//template events
	Template.navbar.events({
		"keyup .search-box":function(event) {
			let searchText = $('.search-box').val();
			
			Session.set('searchTerm', searchText);
			$('.form-control-feedback').removeClass('glyphicon-search');
			$('.form-control-feedback').addClass('glyphicon-remove');
			$('.glyphicon-remove').click(function() {
				$('.search-box').val('');
			});

			if(searchText < 1) {
				Session.set('searchTerm', null);

				$('.form-control-feedback').removeClass('glyphicon-remove');
				$('.form-control-feedback').addClass('glyphicon-search');
			}

			return false; //stop the form from reloading the page
		}
	});

	Template.website_item.events({
		"click .js-upvote":function(event){
			// access the id for the website in the database
			var website_id = this._id;
			// increment rating field to add a vote to a website
			if(Meteor.user()) {
				Websites.update({_id:website_id}, 
												{$inc: {rating: 1}});

				return false; //prevent the button from reloading the page
			} else {
				Bert.alert("Only registered users can vote.", "danger", "growl-top-left");
			}
		}, 
		"click .js-downvote":function(event){

			// access the id for the website in the database
			var website_id = this._id;

			// decrement rating field to remove a vote from a website!
			if(Meteor.user()) {
				Websites.update({_id:website_id}, 
												{$inc: {rating: -1}});

				return false; //prevent the button from reloading the page
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
		"blur #url":function(event) {
			let url = event.target.value;
			let urlData = Meteor.call('getSiteData', 'GET', url, {}, function() {
				console.log(urlData);
			})
			console.log(urlData);
		},
		"submit .js-save-website-form":function(event){
			
			//grab form field values
			let url = event.target.url.value;
			let title = event.target.title.value;
			let description = event.target.description.value;
			let image = event.target.image.value;

			//conditionally insert website entries
			//Bert.alert() notifies user of failed entry if url or title are empty
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

			return false; // stop the form submit from reloading the page

		},
		'click .js-close-form':function(event) {

			$("#website_form").toggle('slow', function() {
					$(".js-toggle-website-form").show(500);
			});

			return false;

		}
	});