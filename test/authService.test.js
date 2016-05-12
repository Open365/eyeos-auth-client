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
		'src/authService',
		'src/settings',
		'src/credentials/cardRenewer',
		'src/headersManager'
	],
	function (AuthService, settings, CardRenewer, HeadersManager) {
		suite('AuthService suite', function () {
			var sut,
				cardRenewer, cardRenewerMock,
				headersManager,
				fakeCredentials, preparedHeaders, $;

			setup(function () {
				cardRenewer = {
					scheduleRenew: function (){},
					doRenew: function (){}
				};
				cardRenewerMock = sinon.mock(cardRenewer);
				headersManager = new HeadersManager();

				fakeCredentials = {
					card: 'aCard',
					signature: 'aSignature'
				};
				preparedHeaders = {
					card: 'stringified',
					signature: 'aSignature'
				};
				$ = {ajax: function () {}};
				sut = new AuthService(cardRenewer, headersManager, $);
			});

			teardown(function () {
				cardRenewerMock.restore();
			});

			function stubHeadersManagerPrepareForAjax() {
				return sinon.stub(sut.headersManager, 'prepareForAjax').returns(preparedHeaders);
			}

			function expectHeadersManagerPrepareForAjax() {
				return sinon.mock(headersManager)
					.expects('prepareForAjax')
					.once()
					.withArgs(fakeCredentials);
			}

			/**
			 * checkCard
			 */
			suite('checkCard', function () {
				var fakeSuccessCb, fakeErrCb;

				setup(function () {
					fakeSuccessCb = function(){};
					fakeErrCb = function(){};
				});

				function exercise (){
					sut.checkCard(fakeCredentials, fakeSuccessCb, fakeErrCb);
				}
				
				test('should call to headersManager.prepareForAjax with the credentials', function(){
					expectHeadersManagerPrepareForAjax();
					exercise();
				});

				test('should call to $.ajax with correct args', sinon.test(function () {
					var testArgs = {
						type: "POST",
						url: settings.authServiceUrl + 'checkCard/',
						headers: fakeCredentials,
						contentType: "application/json",
						success: sinon.match.func,
						error: sinon.match.func
					};
					this.mock($)
						.expects('ajax')
						.once()
						.withArgs(testArgs);

					exercise();
				}));


				test('should call to $.ajax with prepared headers', sinon.test(function(){
					stubHeadersManagerPrepareForAjax();
					var testArgs = {
						type: "POST",
						url: settings.authServiceUrl + 'checkCard/',
						headers: preparedHeaders,
						contentType: "application/json",
						success: sinon.match.func,
						error: sinon.match.func
					};
					this.mock($)
						.expects('ajax')
						.once()
						.withArgs(testArgs);

					exercise();
				}));
			});


			/**
			 * renewCard
			 */
			suite('renewCard', function () {
				var fakeSuccessCb, fakeErrCb,
					renewCardAsyncHandler, renewCardAsyncHandlerMock;

				setup(function () {
					fakeSuccessCb = function(){};
					fakeErrCb = function(){};
					renewCardAsyncHandler = {
						success: function (){},
						error: function (){}
					};
					renewCardAsyncHandlerMock = sinon.mock(renewCardAsyncHandler);
				});

				teardown(function () {
					renewCardAsyncHandlerMock.restore();
				});

				function exercise() {
					sut.renewCard(fakeCredentials, renewCardAsyncHandler);
				}

				test('should call to headersManager.prepareForAjax with the credentials', function(){
					var calledPrepare = expectHeadersManagerPrepareForAjax();
					exercise();
					calledPrepare.verify();
				});

				test('should call to $.ajax with correct args', sinon.test(function () {
					var testArgs = {
						type: "POST",
						url: settings.authServiceUrl + 'renewCard/',
						headers: fakeCredentials,
						contentType: "application/json",
						success: sinon.match.func,
						error: sinon.match.func
					};
					this.mock($)
						.expects('ajax')
						.once()
						.withArgs(testArgs);

					exercise();
				}));

				test('should call to $.ajax with prepared headers', sinon.test(function(){
					stubHeadersManagerPrepareForAjax();
					var testArgs = {
						type: "POST",
						url: settings.authServiceUrl + 'renewCard/',
						headers: preparedHeaders,
						contentType: "application/json",
						success: sinon.match.func,
						error: sinon.match.func
					};
					this.mock($)
						.expects('ajax')
						.once()
						.withArgs(testArgs);

					exercise();
				}));


			});

			suite('_scheduleRenewGenerator', function(){
				var callbackContainer, callbackContainerMock;
				setup(function () {
					callbackContainer = {
						cb : function () {}
					};
					callbackContainerMock = sinon.mock(callbackContainer);
				});

				function execute () {
					return sut._scheduleRenewGenerator(callbackContainer.cb);
				}

				test('should return  a function', sinon.test(function(){
					var ret = execute();
					assert.isFunction(ret);
				}));

				test('the returned function should call cardRenewer.scheduleRenew', sinon.test(function(){
				    this.mock(cardRenewer)
					    .expects('scheduleRenew')
					    .once();
					var ret = execute();
					ret('someData');
				}));

				test('the returned function should call the callback passed with the data passed', function(){
				    var expect = callbackContainerMock
					    .expects('cb')
					    .once()
					    .withExactArgs('someData');
					sinon.stub(cardRenewer, 'scheduleRenew');
					var ret = execute();
					ret('someData');
					expect.verify();
				});

			});
			
		});

	});
