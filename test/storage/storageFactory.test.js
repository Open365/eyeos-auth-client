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

define(['src/storage/storageFactory',
		'src/storage/localStorageProvider',
		'src/storage/sessionStorageProvider'
	],
	function (storageFactory, LocalStorageProvider, SessionStorageProvider) {
		suite('StorageFactory suite', function () {


			setup(function () {

			});

			teardown(function () {
			});


			/**
			 * getInstance
			 */

			test("getInstance when called with 'LocalStorage' should return an instance of LocalStorageProvider ", function () {
				var lsResult = storageFactory.getInstance('LocalStorage');
				assert(lsResult instanceof LocalStorageProvider, true);
			});

			test("getInstance when called with 'SessionStorage' should return an instance of SessionStorageProvider ", function () {
				var lsResult = storageFactory.getInstance('SessionStorage');
				assert(lsResult instanceof SessionStorageProvider, true);
			});


			test("getInstance when called without a valid provider should throw an exception", function (){
				assert.throw(function() {
					storageFactory.getInstance('candemore');
				}, Error, "Unknown storage provider: candemore");
			});


		});

	});