/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

define([
		'src/credentials/credentialsManager',
		'src/authService'
	],
	function (CredentialsManager, AuthService) {
		'use strict';

		var EyeosAuthClient = function (credentialsManager, authService) {
			this.credentialsManager = credentialsManager || new CredentialsManager();
			this.authService = authService || new AuthService();
		};

		EyeosAuthClient.prototype.getHeaders = function () {
			return this.credentialsManager.getCredentials();
		};

		EyeosAuthClient.prototype.getRawCredentials = function () {
			return this.credentialsManager.getRawCredentials();
		};

		EyeosAuthClient.prototype.getUsername = function () {
			return this.credentialsManager.getUsername();
		};

		EyeosAuthClient.prototype.checkCard = function (callback, errCallback) {
			var cred = this.credentialsManager.getCredentials();
			if(cred) {
				this.authService.checkCard(cred, callback, errCallback);
			} else {
				errCallback();
			}
		};

		EyeosAuthClient.prototype.removeCard = function () {
			this.credentialsManager.removeCredentials();
		};

		EyeosAuthClient.prototype.setToken = function (credentials) {
			this.credentialsManager.removeRenewCardTime();
			this.credentialsManager.setCredentials(credentials);
		};

		EyeosAuthClient.prototype.doRenew = function(){
			this.authService.doRenew();
		};

		return EyeosAuthClient;

	});
