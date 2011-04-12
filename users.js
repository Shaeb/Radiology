var users = {};

exports.login = function(req, res) {
	res.db.client.connect();
	res.db.client.query('select username, password from users where username = ? and password = ?', 
	[req.body.user.username, req.body.user.password],
	function(error, results, fields){
			console.log('error: ' + error);
		if (error || results.length == 0) {
			res.db.client.end();
			req.flash('error', 'Unable to login');
			var flash = req.flash();
			res.render('./index', {title: 'Error on login', error: true, flash: flash.error});
		} else {
			res.db.client.end();
			console.log('redirecting');
			res.redirect('/ct/view/schedule');
		}
	});	
};