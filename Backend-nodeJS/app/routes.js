var User = require('./models/user');

function getUsers(res) {
	User.find(function (err, users) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
			res.send(err);
		}
		res.json(users); // return all todos in JSON format
	});
};

module.exports = function (app) {

	// register users
	app.post('/user/register', function (req, res) {
		User.findOne({ 
			email : req.body.email 
		}, function(err,result) { 
			if(!result){
				var newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
				});
				User.createUser(newUser, function (err, user) {
					if (err){
						res.send(err);
					}
					else{
						res.send({'state': 1 });
					}
				});
			}
			else{
				res.send({'state': 0 });
			}    
		});
	});

	//check user in login
	app.post('/user/login', function (req, res) {
		User.findOne({ 
			email : req.body.email,
		}, function(err,result) { 
			if(!result){
				res.send ({'state': 0 });
			}
			else{
				var userpassword = result.password;
				var password =  req.body.password;
					User.comparePassword(password, userpassword, function (err, isMatch) {
					if (err) throw err;
					if (isMatch) {
						res.send ({'state': 1 });
					} else {
						res.send ({'state': 0 });
					}
				});
			}
		});
	});

	// delete a todo
	// app.delete('/api/users/:user_id', function (req, res) {
	//     Todo.remove({
	//         _id: req.params.user_id
	//     }, function (err, user) {
	//         if (err)
	//             res.send(err);

	//         getTodos(res);
	//     });
	// });

	// application -------------------------------------------------------------
	app.get('*', function (req, res) {
		res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
