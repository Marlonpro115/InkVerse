const mysql = require('mysql2');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'db_library',
});

connection.connect(function (error) {
	if (!!error) {
		console.log(error);
	} else {
		console.log('Conectado..!');
	}
});

module.exports = connection;
/*
const mysql = require('mysql2');
const connection = mysql.createConnection({
	host: 'hopper.proxy.rlwy.net',
	user: 'root',
	password: 'SfFiBLbMiKIITeGWZqNviBxmZEywgCyJ',
	database: 'railway',
	port: 45433,
	multipleStatements: true, 
});

connection.connect(function (error) {
	if (!!error) {
		console.log(error);
	} else {
		console.log('Conectado..!');
	}
});

module.exports = connection;*/