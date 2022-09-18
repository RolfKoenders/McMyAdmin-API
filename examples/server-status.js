'use strict';

const McMyAdmin = require('../lib/mcmyadmin');

const mcAdmin = new McMyAdmin({
	host: 'http://xxx.xxx.x.xx',
	port: 8080,
	username: 'admin',
	password: 'password'
});

mcAdmin.status((err, info) => {
	if (err) {
		console.log('Error while getting the server info');
	} else {
		console.log('We got the server status!: ', info);
	}
});
