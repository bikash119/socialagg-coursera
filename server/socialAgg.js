// Mongo Collections
LinkDetails = new Mongo.Collection("linkDetails");
LinkTagTaste = new Mongo.Collection("linkTagTaste");
LinkComments = new Mongo.Collection("linkComments");

// Startup Script
Meteor.startup(function () {
});


Meteor.publish("linkDetails",function(){
	return LinkDetails.find();
});

Meteor.publish("linkTagTaste",function(){
	return LinkTagTaste.find();
});

Meteor.methods({
	createLink: function(webUrl){
		console.log("meta fetch called for url "+webUrl);
		var embedlyResponse = "http://api.embed.ly/1/extract?key=dff4a581ab2449199c67b2e3894fa94e&url="+webUrl+"&format=json";
		//console.log("Response"+embedlyResponse);
		var response = Meteor.http.call("GET",embedlyResponse);
		var linkDetails = parseResponse(response);
		LinkDetails.insert(linkDetails);
		console.log(linkDetails);
	},

	incrementLikeCount: function(linkId){
		var upVotedLink = LinkDetails.findOne({_id:linkId});
		var likeCount = 0;
		
		if(upVotedLink){
			console.log(linkId + " : " +upVotedLink.likeCount);
			if(upVotedLink.likeCount){
				likeCount = upVotedLink.likeCount+1
			}else{
				likeCount = 1;
			}
			LinkDetails.update({_id:linkId},{$set: {likeCount:likeCount}})
		}
	},

	incrementDislikeCount: function(linkId){
		var downVotedLink = LinkDetails.findOne({_id:linkId});
		var disLikeCount = 0;
		
		if(downVotedLink){
			console.log(linkId + " : " +downVotedLink.disLikeCount);
			if(downVotedLink.disLikeCount){
				disLikeCount = upVotedLink.disLikeCount+1
			}else{
				disLikeCount = 1;
			}
			LinkDetails.update({_id:linkId},{$set: {disLikeCount:disLikeCount}})
		}
	}

});

function parseResponse(embedlyResponse){
	var data = embedlyResponse.data;
	var providerUrl = data.provider_url;
	var faviconUrl = data.favicon_url;
	var description = data.description;
	var title = data.title;
	var index = 0;
	var images = data.images.map(function(elem){ 
		var active="";
		console.log("index :: "+index);
		if(index == 0){
			active = "active";
		}
		var image = {"url": elem.url,"active":active,"index":index}
		index++;
		return image;
	});
	var tags = data.keywords.map(function(elem){ return {"tag": elem.name};});
	var linkDetails = {
		url: embedlyResponse.data.provider_url,
		faviconUrl: embedlyResponse.data.favicon_url,
		description: embedlyResponse.data.description,
		title: embedlyResponse.data.title,
		images: images,
		keywords: tags,
		createdBy:Meteor.userId()
	};


	return linkDetails;

}

function prepareImage(image){
	console.log(image.url);
}