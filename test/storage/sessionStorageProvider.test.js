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

define(['src/storage/sessionStorageProvider'], function (SessionStorageProvider) {
	suite('SessionStorageProvider suite', function () {
		var sut;
		setup(function () {
			sut = new SessionStorageProvider();
		});

		teardown(function () {
			sessionStorage.clear();
		});

		/**
		 * set & get
		 */
		var testValuesForGetMethod = [
			{ key: "a fake key 1", value: "i'm a string", expected: "i'm a string" },
			{ key: "a fake key 2", value: 123456, expected: 123456 },
			{ key: "a fake key 3", value: {a: "test", fake: "object"}, expected: { a: "test", fake: "object"} },
			{ key: "a fake key 4", value: true, expected: true }
		];

		testValuesForGetMethod.forEach(function (item) {
			test("get returns the value associated with the key", function () {
				sut.set(item.key, item.value);
				assert.deepEqual(sut.get(item.key), item.expected);
			});
		});
	});

});
