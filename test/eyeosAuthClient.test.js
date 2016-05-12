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
		'src/eyeosAuthClient',
		'src/credentials/credentialsManager',
		'src/authService'
	],
	function (EyeosAuthClient, CredentialsManager, AuthService) {
		suite('EyeosAuthClient suite', function () {
			var sut, fakeData,
				credentialsManager,
				credentialsManagerMock,
				authService, authServiceMock;

			setup(function () {
				credentialsManager = {
					removeRenewCardTime: function () {},
					setCredentials: function () {},
					getCredentials: function () {},
					removeCredentials: function () {},
					getUsername: function () {}
				};
				credentialsManagerMock = sinon.mock(credentialsManager);
				authService = {
					checkCard: function () {
					},
					removeCard: function () {
					},
					doRenew: function () {
					}
				};
				authServiceMock = sinon.mock(authService);
				fakeData = {
					"card": 'myCard',
					"signature": 'mySignature'
				};
				sut = new EyeosAuthClient(credentialsManager, authService);
			});

			teardown(function () {
				credentialsManagerMock.restore();
				authServiceMock.restore();
			});


			/**
			 * getHeaders
			 */

			test('getHeaders should call to credentialsManager getCredentials', function () {
				var expectation = credentialsManagerMock.expects('getCredentials').once().returns('something');
				sut.getHeaders();
				expectation.verify();
			});

			test('getHeaders should return a correct object', function () {
				credentialsManagerMock.expects('getCredentials').returns(fakeData);
				var res = sut.getHeaders();
				assert.deepEqual(res, fakeData);
			});


			suite('getUsername', function () {
				function exercise () {
					return sut.getUsername();
				}

				test('getUsername calls credentialsManager.getUsername', sinon.test(function () {
					this.mock(credentialsManager)
						.expects('getUsername')
						.once()
						.withExactArgs();
					exercise();
				}));

				test('getUsername returns the return value of credentialsManager.getUsername', sinon.test(function () {
					var expectedUsername = 'fake user';
					this.stub(credentialsManager, 'getUsername')
						.returns(expectedUsername);
					var actual = exercise();
					assert.equal(actual, expectedUsername);
				}));
			});


			/**
			 * checkCard
			 */
			suite('checkCard', function(){
				var fakeCallback, fakeErrCallback;

				setup(function () {
					fakeCallback = sinon.spy();
					fakeErrCallback = sinon.spy();
				});

				function exercise () {
					sut.checkCard(fakeCallback, fakeErrCallback);
				}
				test('checkCard should call to credentialsManager', function () {
					var expectation = credentialsManagerMock.expects('getCredentials').once().returns('something');
					exercise();
					expectation.verify();
				});

				test('checkCard when there are credentials stored should call to authService.checkCard with correct args', function () {
					credentialsManagerMock.expects('getCredentials').returns(fakeData);
					var expectCheckCall = authServiceMock.expects('checkCard').once().withExactArgs(fakeData, fakeCallback, fakeErrCallback);
					exercise();
					expectCheckCall.verify();
				});

				test('checkCard when there are not stored credentials should NOT call to authService.checkCard', function () {
					credentialsManagerMock.expects('getCredentials').returns(null);
					var expectCheckCall = authServiceMock.expects('checkCard').never();
					exercise();
					expectCheckCall.verify();
				});

				test('checkCard when there are not stored credentials should execute the errorCallback', function () {
					credentialsManagerMock.expects('getCredentials').returns(null);
					exercise();
					assert.isTrue(fakeErrCallback.calledOnce);
				});
			});



			/**
			 * setToken
			 */

			suite('setToken', function(){
				setup(function () {

				});

				function exercise() {
					sut.setToken(fakeData);
				}

				test('when called with data should call to credentialsManager.setCredentials', function () {
					var expectation = credentialsManagerMock.expects('setCredentials').once().withExactArgs(fakeData);
					exercise();
					expectation.verify();
				});

				test('when called should call to credentialsManager.removeRenewCardTime', sinon.test(function(){
					this.stub(credentialsManager, 'setCredentials');
					this.mock(credentialsManager)
						.expects('removeRenewCardTime')
						.once();
					exercise();
				}));
			});

			suite('removeCard', function () {
				setup(function () {
				});

				function exercise() {
					sut.removeCard();
				}

				test('when called should call to credentialsManager.removeCredentials', sinon.test(function () {
					this.stub(credentialsManager, 'getCredentials')
						.returns('fake creds');
					this.mock(credentialsManager)
						.expects('removeCredentials')
						.once()
						.withExactArgs();

					exercise();
				}));
			});

			suite('doRenew', function(){
				test('should be delegated to authService.doRenew', function(){
					var expectAuthServiceDoRenew = authServiceMock.expects('doRenew').once().withExactArgs();

					sut.doRenew();

					expectAuthServiceDoRenew.verify();

				});
			});
		});

	});
