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
		'src/settings',
		'src/credentials/credentialsManager',
		'src/credentials/renewCardAsyncHandler'
	],
	function (settings, CredentialsManager, RenewCardAsyncHandler) {
		'use strict';

		var CardRenewer = function (authService, credentialsManager, renewCardAsyncHandler) {
			this.authService = authService;
			this.credentialsManager = credentialsManager || new CredentialsManager();
			this.renewCardAsyncHandler = renewCardAsyncHandler || new RenewCardAsyncHandler(this, this.credentialsManager);
			this.timeout = null;
		};

		CardRenewer.prototype.scheduleRenew = function () {
			var self = this;

			var renewTime = this.credentialsManager.getRenewCardTime();
			var renewDelay = renewTime - Date.now();

			clearTimeout(this.timeout);
			this.timeout = setTimeout(function () {
				self.doRenew()
			}, renewDelay);
		};

		CardRenewer.prototype.doRenew = function () {
			var credentials = this.credentialsManager.getCredentials();
			this.authService.renewCard(credentials, this.renewCardAsyncHandler);
		};

		return CardRenewer;

	});
