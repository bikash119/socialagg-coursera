// EditableText.registerCallbacks({
//   addTimestampToDoc : function(doc) {
// 	var extraFields = {timestamp: Date.now()};
// 	if (Meteor.user()) {
// 	  extraFields.user = Meteor.user().emails[0].address;
// 	}
// 	return _.extend(doc, extraFields);
//   }
// });