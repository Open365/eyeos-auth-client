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

define ([], function () {
	'use strict';

	return {
		storage: 'LocalStorage',
		authServiceUrl: window.document.location.protocol + '//' + window.document.domain + '/login/v1/methods/',
		renewDefaultCardTimeout: 2*60*60, //2 hours in secs
		temporaryExpireCardTime: 1*60 //1min in seconds
	};

});
