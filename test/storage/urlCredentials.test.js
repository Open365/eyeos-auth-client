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

define(['src/storage/urlCredentials'], function (UrlCredentials) {
    suite('UrlCredentials suite', function () {
        var sut;
        setup(function () {

        });

        /**
         * set & get
         */
        var testValuesForGetMethod = [
            { key: "key1", value: "test", expected: "test" },
            { key: "key2", value: "i'm a string", expected: "i'm a string" },
        ];

        testValuesForGetMethod.forEach(function (item) {
            test("get returns the value associated with the key when they are first in the hash", function () {
                sut = new UrlCredentials('#'+item.key+'='+item.value);
                assert.deepEqual(sut.get(item.key), item.expected);
            });
        });

        test("get returns the value associated with the key when they are second in the hash", function () {
            sut = new UrlCredentials('#a=b&str=test');
            assert.deepEqual(sut.get('str'), 'test');
        });

        test("get returns the value associated with the key when they are in the middle of the hash", function () {
            sut = new UrlCredentials('#a=b&str=test&x=y');
            assert.deepEqual(sut.get('str'), 'test');
        });

        test("hasCredentials returns true false if there is not card or signature in the hash", function () {
            sut = new UrlCredentials('#a=b&str=test&x=y');
            assert.equal(sut.hasCredentials(), false);
        });

        test("hasCredentials returns true only if there is card and signature in the hash", function () {
            sut = new UrlCredentials('#card=test&signature=test2');
            assert.equal(sut.hasCredentials(), true);
        });
    });

});
