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
		'src/credentials/renewCardAsyncHandler',
		'src/credentials/credentialsManager'
	],
	function (RenewCardAsyncHandler, CredentialsManager) {
		suite('RenewCardAsyncHandler suite', function () {
			var sut, fakeCredentials, card, signature,
				credentialsManagerMock, credentialsManager,
				cardRenewerFake, cardRenewerMock;

			setup(function () {
				window.postal = {
					publish:function(){}
				};
				card = 'test card';
				signature = 'test signature';
				fakeCredentials = {
					card: card,
					signature: signature
				};
				credentialsManager = new CredentialsManager();
				cardRenewerFake = {
					scheduleRenew: function (){}
				};

				credentialsManagerMock = sinon.mock(credentialsManager);
				cardRenewerMock = sinon.mock(cardRenewerFake);

				sut = new RenewCardAsyncHandler(cardRenewerFake, credentialsManager);
			});

			teardown(function () {
			});

			/**
			 * success
			 */
			suite('success', function () {

				function exercise () {
					sut.success(JSON.stringify(fakeCredentials));
				}

				test('success should call to CredentialsManager.setCredentials with correct args', sinon.test(function () {
					var callGet = credentialsManagerMock.expects('setCredentials').once().withArgs(fakeCredentials);
					exercise();
					callGet.verify();
				}));

				test('success should call to cardRenewer.scheduleRenew', function () {
					var callSchedule = cardRenewerMock.expects('scheduleRenew').once();
					exercise();
					callSchedule.verify();
				});

				test("success should trigger cardRenewed event", sinon.test(function() {
					this.mock(postal).expects("publish").once().withExactArgs({"topic":"cardRenewed", "data":fakeCredentials});
					exercise();
				}));

			});

		});

	});
