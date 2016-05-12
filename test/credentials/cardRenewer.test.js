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
		'src/credentials/cardRenewer',
		'src/settings',
		'src/credentials/credentialsManager',
		'src/credentials/renewCardAsyncHandler'
	],
	function (CardRenewer, settings, credentialsManager, RenewCardAsyncHandler) {
		suite('CardRenewer suite', function () {
			var sut, fakeCredentials, card,
				credentialsManagerMock, credentialsManagerFake,
				credentialsManagerGetTimeStub, credentialsManagerSetTimeStub,  credentialsManagerGetCredStub,
				authServiceFake, authServiceMock,
				renewCardAsyncHandlerFake;

			setup(function () {
				card = {
					username: 'aUsrname',
					expiration: sinon.match.number
				};
				signature = 'test signature';
				fakeCredentials = {
					card: card,
					signature: signature
				};

				authServiceFake = {
					renewCard: function(){}
				};

				credentialsManagerFake = {
					getCredentials: function(){},
					getRenewCardTime: function(){}
				};

				authServiceMock = sinon.mock(authServiceFake);
				renewCardAsyncHandlerFake = {};

				sut = new CardRenewer(authServiceFake, credentialsManagerFake, renewCardAsyncHandlerFake);
			});

			teardown(function () {
			});

			function mockCredentialsManager() {
				credentialsManagerMock = sinon.mock(credentialsManagerFake);
			}

			function stubCredentialsManagerGetCred(retVal) {
				credentialsManagerGetCredStub = sinon.stub(credentialsManagerFake, 'getCredentials').returns(retVal);
			}

			function stubAuthServiceRenewCard () {
				sinon.stub(authServiceFake, 'renewCard');
			}

			/**
			 * scheduleRenew
			 */
			suite('scheduleRenew', function () {
				var clock, now;
				setup(function () {
					now = 1407857289085;
					clock = sinon.useFakeTimers(now);
				});

				teardown(function () {
					clock.restore();
				});

				function exercise () {
					sut.scheduleRenew();
				}

				test('scheduleRenew should call to CredentialsManager.getRenewCardTime', function () {
					mockCredentialsManager();
					var callGet = credentialsManagerMock.expects('getRenewCardTime').once();
					exercise();
					callGet.verify();
				});

			});

			suite('doRenew', function(){

				function exercise () {
					sut.doRenew();
				}

				test('should call to CredentialsManager.getCredentials', function () {
					stubAuthServiceRenewCard();
					mockCredentialsManager();
					var callGet = credentialsManagerMock.expects('getCredentials').once();
					exercise();
					callGet.verify();
				});

				test('should call to authService.renewCard with correct args', sinon.test(function(){
					this.mock(authServiceFake)
						.expects('renewCard')
						.once()
						.withExactArgs(fakeCredentials, renewCardAsyncHandlerFake);
					stubCredentialsManagerGetCred(fakeCredentials);
					exercise();
				}));

			});

		});

	});
