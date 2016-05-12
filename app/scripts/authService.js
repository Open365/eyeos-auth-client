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

define ([
	'src/settings',
	'src/credentials/cardRenewer',
	'src/headersManager'
], function (settings, CardRenewer, HeadersManager) {
	'use strict';

	var AuthService= function(cardRenewer, headersManager, jquery) {
		this.cardRenewer = cardRenewer || new CardRenewer(this);
		this.headersManager = headersManager || new HeadersManager();
		this.$ = jquery || $;
	};

	AuthService.prototype.checkCard = function (cred, callback, errCallback) {
		cred = this.headersManager.prepareForAjax(cred);

		this.$.ajax({
			type: "POST",
			url: settings.authServiceUrl + 'checkCard/',
			headers: cred,
			contentType: "application/json",
			success: this._scheduleRenewGenerator(callback),
			error: errCallback
		});
	};

	AuthService.prototype.renewCard = function (cred, renewCardAsyncHandler) {
		cred = this.headersManager.prepareForAjax(cred);

		this.$.ajax({
			type: "POST",
			url: settings.authServiceUrl + 'renewCard/',
			headers: cred,
			contentType: "application/json",
			success: renewCardAsyncHandler.success.bind(renewCardAsyncHandler),
			error: renewCardAsyncHandler.error
		});
	};

	AuthService.prototype.doRenew = function(){
		this.cardRenewer.doRenew();
	};

	AuthService.prototype._scheduleRenewGenerator = function (callback) {
		var self = this;
		return function (data) {
			self.cardRenewer.scheduleRenew();
			callback(data);
		}
	};

	return AuthService;

});
