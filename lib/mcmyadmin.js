'use strict';

const request = require('request');

class McMyAdmin {

	constructor(settings) {
		this.settings = settings;
		this.baseUrl = `${settings.host}:${settings.port}`;
		this.loggedIn = false;
		this.sessionId = null;
	}

	/*
	*  # Public Methods
	*/
	status(callback) {
		this._requestWithOperation('GetStatus', callback, '[McMyAdmin API] - Not able to get server status');
	}

	startServer(callback) {
		this._requestWithOperation('StartServer', callback, '[McMyAdmin API] - Not able to start server');
	}

	stopServer(callback) {
		this._requestWithOperation('StopServer', callback, '[McMyAdmin API] - Not able to stop server');
	}

	/*
	*  # Private Methods
	*/
	_requestWithOperation(req, callback, logMsg) {
		this._request({qs: {req}}, function statusCallback(err, response, body) {
			if (err || body.status !== 200) {
				console.log(logMsg, err, body);
				err.response = response;
				callback(err, null);
			} else {
				callback(null, body);
			}
		});
	}

	/*
	*  Login to McMyAdmin to get a session token (MCMASESSIONID)
	*/
	_login(callback) {
		let reqObj = {
			qs: {
				req: 'login',
				username: this.settings.username,
				password: this.settings.password,
				token: ''
			}
		};

		this._makeRequest(reqObj, (err, response, body) => {
			if (err || (!body.success && body.status !== 200)) {
				console.log('[McMyAdmin API] - Error trying to login. ', err);
				callback(false);
			} else {
				this.loggedIn = true;
				this.sessionId = body.MCMASESSIONID;
				callback(true);
			}
		});
	}

	/*
	*  Wrapper method which takes care of obtaining a session id
	*/
	_request(req, callback) {
		if (this.loggedIn) {
			req.qs.MCMASESSIONID = this.sessionId;
			this._makeRequest(req, callback);
		} else {
			this._login(loggedIn => {
				if (loggedIn) {
					req.qs.MCMASESSIONID = this.sessionId;
					this._makeRequest(req, callback);
				} else {
					console.log('[McMyAdmin API] - Can\'t login.');
					// Need to stop trying to login
				}
			});
		}
	}

	/*
	*  Request wrapper method to call the McMyAdmin API
	*/
	_makeRequest(req, callback) {
		let reqObj = {
			baseUrl: this.baseUrl,
			uri: 'data.json',
			method: req.method || 'GET',
			json: req.json || true
		};

		reqObj.headers = {
			Accept: 'application/json'
		};

		if (req.qs) {
			reqObj.qs = req.qs;
		}

		request(reqObj, (err, response, responseBody) => {
			if (response.statusCode === 401) {
				this.loggedIn = false;
				this.sessionId = null;
				this._request(req, callback);
			} else {
				callback(err, response, responseBody);
			}
		});
	}

}

module.exports = McMyAdmin;
