//Client Subscription
LinkDetails = new Mongo.Collection("linkDetails");
LinkTagTaste = new Mongo.Collection("linkTagTaste");
LinkComments = new Mongo.Collection("linkComments");

Meteor.subscribe("linkDetails");
Meteor.subscribe("linkTagTaste");
Meteor.subscribe("linkComments");

// IRON Router

Router.configure({
    layoutTemplate : 'ApplicationLayout'
});

Router.route('/',function(){
	this.render('navbar',{
		to:'navbar'
	});
	this.render('webContents',{
		to:'main'
	});
});


Router.route('/link/:_id',function(){
	this.render('navbar',{
		to:'navbar'
	});

	this.render('descriptionTemplate',{
		to:'main',
		data:function(){
			var linkInfo = LinkDetails.findOne({_id:this.params._id});
			return linkInfo;
		}
	});
});

Template.navbar.events({
	'click .js-display-modal': function(event){
		$("#websiteAddForm").modal("show");
	}
});

Template.websiteAddForm.events({
	'click .js-websiteAddForm-save': function(event){
		var webUrl = $("#websiteAddFormWeburl").val();
		Meteor.call("createLink",webUrl);
		$("#websiteAddForm").modal("hide");
	}
});

Template.webContents.helpers({
	linkDetails : function(){
		var details = LinkDetails.find({},{sort : {likeCount:-1} });
		return details;
	}
});

Template.webContents.events({
	'click .js-upVote': function(){
		console.log("upvote invoked");
		Meteor.call("incrementLikeCount",this._id)
	},

	'click .js-downVote':function(){
		console.log("down vote invoked");
		Meteor.call("incrementDislikeCount",this._id);
	}
});

Template.descriptionTemplate.events({});

 Template.descriptionTemplate.helpers({
	comments : function(){
		console.log("comments invoked :: "+this._id);
		var comments = LinkComments.find({linkId:this._id});
		if(comments){
			return comments;	
		}else{
			return {text:''};
		}
		
	}
});
