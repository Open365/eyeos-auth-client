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
		'src/settings',
		'src/storage/storageFactory',
		'src/storage/urlCredentials'
	],
	function (CredentialsManager, settings, StorageFactory, UrlCredentials) {
		suite('CredentialsManager suite', function () {
			var sut, storageProviderMock, storageProviderFake, card;
			var fakeCredentials;
			var signature;
			var minicard;
			var minisignature;
			var urlCredentials, urlCredentialsStub;
			setup(function () {
				card = 'test card';
				signature = 'test signature';
				minicard = 'test minicard';
				minisignature = 'test minisignature';
				fakeCredentials = {
					card: card,
					signature: signature
				};
				storageProviderFake = {
					get: function () {
					},
					set: function () {
					},
					removeItem: function () {
					}
				};
				storageProviderMock = sinon.mock(storageProviderFake);
				urlCredentials = new UrlCredentials();
				sut = new CredentialsManager(storageProviderFake, urlCredentials);
			});

			teardown(function () {
			});


			/**
			 * getCredentials
			 */
			suite('GetCredentials', function () {
				var expStorageGetCard, expStorageGetSign;

				function setGetCredentialsExpectations() {
					expStorageGetCard = storageProviderMock.expects('get')
						.once().withExactArgs('card').returns(card);
					expStorageGetSign = storageProviderMock.expects('get')
						.once().withExactArgs('signature').returns(signature);
				}

				function stubGetCredentials(cardVal, signVal) {
					var stubGetCred = sinon.stub(storageProviderFake, 'get');
					stubGetCred.onCall(0).returns(cardVal);
					stubGetCred.onCall(1).returns(signVal);
				}

				test('getCredentials should call set to storageProvider if there are credentials in the url', function() {
					var expSetCard = storageProviderMock.expects('set').once().withExactArgs('card', 'card');
					var expSetSignature = storageProviderMock.expects('set').once().withExactArgs('signature', 'signature');
					urlCredentials = new UrlCredentials('#card=card&signature=signature');
					sut = new CredentialsManager(storageProviderFake, urlCredentials);
					sut.getCredentials();
					expSetCard.verify();
					expSetSignature.verify();
				});

				test('getCredentials should call to storageProvider get with card', function () {
					setGetCredentialsExpectations();
					sut.getCredentials();
					expStorageGetCard.verify();
				});

				test('getCredentials should call to storageProvider get with signature', function () {
					setGetCredentialsExpectations();
					sut.getCredentials();
					expStorageGetSign.verify();
				});

				test('getCredentials when storage service returns credentials should return valid credentials', function () {
					stubGetCredentials(card, signature);
					var ret = sut.getCredentials();
					assert.deepEqual(ret, fakeCredentials);
				});

				test('getCredentials when storage service returns undefined card should return undefined', function () {
					stubGetCredentials(undefined, signature);
					var ret = sut.getCredentials();
					assert.isUndefined(ret);
				});

				test('getCredentials when storage service returns undefined signature should return undefined', function () {
					stubGetCredentials(card);
					var ret = sut.getCredentials();
					assert.isUndefined(ret);
				});
			});

			suite('getUsername', function () {
				function exercise () {
					return sut.getUsername();
				}

				function stubStorageProvider_getCard (sinon, returnValue) {
					sinon.stub(storageProviderFake, 'get')
						.returns(returnValue);
				}

				test('calls storageProvider.get(card)', sinon.test(function () {
					this.mock(storageProviderFake)
						.expects('get')
						.once()
						.withExactArgs('card');
					exercise();
				}));

				test('when there is no card returns false', sinon.test(function () {
					stubStorageProvider_getCard(this, null);

					var actual = exercise();
					assert.strictEqual(actual, false);
				}));

				test('when card does not contain username returns false', sinon.test(function () {
					stubStorageProvider_getCard(this, 'asd');
					var actual = exercise();
					assert.strictEqual(actual, false);
				}));

				test('when there is a card it returs the inner username', sinon.test(function () {
					var username = 'a.fake.username';
					var fakeCard = {
						username: username,
						expiration: 12345
					};
					stubStorageProvider_getCard(this, fakeCard);

					var actual = exercise();
					assert.strictEqual(actual, username);
				}));
			});


			/**
			 * setCredentials
			 */

			suite('SetCredentials', function () {
				var spyStorageProviderSet;

				function setSetCredentialsExpectations() {
					spyStorageProviderSet = sinon.spy(storageProviderFake, 'set');
				}

				test('setCredentials when called without credentials should throw an exception', function () {
					assert.throw(function () {
						sut.setCredentials();
					}, TypeError, "Undefined credentials");
				});

				test('setCredentials when called with invalid credentials should throw an exception', function () {
					var invalidCred = {
						signature: signature
					};
					assert.throw(function () {
						sut.setCredentials(invalidCred);
					}, TypeError, "Can't set invalid Credentials");
				});

				test('setCredentials when called with valid credentials should call storageProvider.set the correct amount of times', function () {
					setSetCredentialsExpectations();
					sut.setCredentials(fakeCredentials);
					assert(spyStorageProviderSet.callCount === 4, true);
				});

				test('setCredentials when called with valid credentials should call storageProvider.set with the correct args', function () {
					setSetCredentialsExpectations();
					sut.setCredentials(fakeCredentials);
					assert(spyStorageProviderSet.withArgs('card', 'test card').calledOnce, true);
					assert(spyStorageProviderSet.withArgs('signature', 'test signature').calledOnce, true);
				});

			});


			/**
			 * getRenewCardTime
			 */

			suite('getRenewCardTime', sinon.test(function(){
				function exercise () {
					return sut.getRenewCardTime();
				}

				test('when called should return it from the card', sinon.test(function(){
					var aCard = {renewCardAt:123123123};
					var stub = this.stub(storageProviderFake, 'get').returns(aCard);
					exercise();
					assert.equal(stub.withArgs('card').calledOnce, true);
				}));

			}));

			suite('removeRenewCardTime', function(){
			    test('should call to storageProvider.removeItem', sinon.test(function(){
			        this.mock(storageProviderFake)
				        .expects('removeItem')
				        .once();
				    sut.removeRenewCardTime();
			    }));
			});

			suite('removeCredentials', function () {
				var spyStorageProviderRemoveItem;

				function setSetCredentialsExpectations () {
					spyStorageProviderRemoveItem = sinon.spy(storageProviderFake, 'removeItem');
				}

				function exercise() {
					sut.removeCredentials();
				}

				test('removeCredentials when called should call storageProvider.removeItem 3 times', function () {
					setSetCredentialsExpectations();
					exercise();
					assert(spyStorageProviderRemoveItem.callCount, 3);
				});

				test('removeCredentials when called with valid credentials should call storageProvider.removeItem with the correct args each time', function () {
					setSetCredentialsExpectations();
					exercise();
					assert(spyStorageProviderRemoveItem.withArgs('card').calledOnce, true);
					assert(spyStorageProviderRemoveItem.withArgs('signature').calledOnce, true);
					assert(spyStorageProviderRemoveItem.withArgs('renewCardTime').calledOnce, true);
				});
			});
		});

	});
