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
		'src/headersManager'
	],
	function (HeadersManager) {
		suite('HeadersManager suite', function () {
			var sut;
			setup(function () {
				sut = new HeadersManager();
			});

			/**
			 * prepareForAjax
			 */
			suite('prepareForAjax', function () {
				var fakeCredentials;

				setup(function () {
					fakeCredentials = {
						card: 'aCard',
						signature: 'aSignature'
					};
				});

				function exercise (){
					return sut.prepareForAjax(fakeCredentials);
				}

				test('when called with headers that contains an object should call to JSON.stringify', sinon.test(function(){
				    fakeCredentials.card = {
					    'something': 'asd',
					    'anotherField': 'qwe'
				    };
					var preparedHeaders = exercise();
					assert.isString(preparedHeaders.card);

				}));

				test('when called with headers that contain strings should not do anything', sinon.test(function(){
					var preparedHeaders = exercise();
					assert.isString(preparedHeaders.card);
				}));

			});

		});

	});