var mongoose = require('mongoose');
mongoose.connect('mongodb://kunalkalra97:node123@ds139735.mlab.com:39735/vit_node');


var user = mongoose.Schema({

	"email":String,
	"password":String
});

var userTable = mongoose.model('networks',user,'networks');

module.exports.userTable = userTable;









