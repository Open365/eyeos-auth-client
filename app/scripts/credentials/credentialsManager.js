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
		'src/storage/storageFactory',
		'src/storage/urlCredentials'
	],
	function (settings, StorageFactory, UrlCredentials) {
		'use strict';

		var CredentialsManager= function(storageProvider, urlCredentials) {
			this.storageProvider = storageProvider || StorageFactory.getInstance(settings.storage);
			this.urlCredentials = urlCredentials || new UrlCredentials();
		};

		CredentialsManager.prototype.getCredentials = function () {

			if(this.urlCredentials.hasCredentials()) {
				this.storageProvider.set('card', this.urlCredentials.get('card'));
				this.storageProvider.set('signature', this.urlCredentials.get('signature'));
				this.urlCredentials.clear();
			}
			var card = this.storageProvider.get('card');
			var signature = this.storageProvider.get('signature');

			if(card && signature) {
				return {
					card: card,
					signature: signature
				};
			}
		};

		CredentialsManager.prototype.getRawCredentials = function() {
			var card = this.storageProvider.getRaw('card');
			var minicard = this.storageProvider.getRaw('minicard');
			var signature = this.storageProvider.getRaw('signature');
			var minisignature = this.storageProvider.getRaw('minisignature');

			if(card && signature) {
				return {
					card: card,
					signature: signature,
					minicard: minicard,
					minisignature: minisignature
				};
			}
		};

		CredentialsManager.prototype.getUsername = function () {
			var card = this.storageProvider.get('card');
			if (!card || !card.username) {
				return false;
			}

			return card.username;
		};

		CredentialsManager.prototype.setCredentials = function (credentials) {
			if(!credentials){
				throw new TypeError('Undefined credentials');
			}
			if(!credentials.card || !credentials.signature) {
				throw new TypeError("Can't set invalid Credentials");
			}

			this.storageProvider.set('card', credentials.card);
			this.storageProvider.set('signature', credentials.signature);
			this.storageProvider.set('minicard', credentials.minicard);
			this.storageProvider.set('minisignature', credentials.minisignature);
		};


		CredentialsManager.prototype.getRenewCardTime = function () {
			return this.storageProvider.get('card').renewCardAt * 1000;
		};

		CredentialsManager.prototype.removeRenewCardTime = function () {
			this.storageProvider.removeItem('renewCardTime');
		};

		CredentialsManager.prototype.removeCredentials = function () {
			this.storageProvider.removeItem('card');
			this.storageProvider.removeItem('minicard');
			this.storageProvider.removeItem('signature');
			this.storageProvider.removeItem('minisignature');
			this.storageProvider.removeItem('renewCardTime');
		};

		return CredentialsManager;

	});
