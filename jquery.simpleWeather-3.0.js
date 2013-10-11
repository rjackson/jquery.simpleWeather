/*
 * simpleWeather.js
 * http://simpleweatherjs.com
 *
 * A simple jQuery plugin to display the current weather
 * information for any location using OpenWeatherMap.
 *
 * Developed by James Fleeting <@twofivethreetwo> <http://iwasasuperhero.com>
 * Another project from monkeeCreate <http://monkeecreate.com>
 *
 * Version 3.0.0 - Last updated: October 11 2013
 */
(function($) {
	"use strict";
	$.extend({
		simpleWeather: function(options){
			options = $.extend({
				city: '', // Austin,TX
				cityid: '', // 2172797
				geocoords: '', // 35,139 (lat/lon)
				units: 'imperial', // metric or imperial
				weatherType: 'current', // current or forecast
				lang: 'en', // en
				success: function(weather){},
				error: function(message){}
			}, options);

			var now = new Date();

			var apiURL = 'http://api.openweathermap.org/data/2.5/';
			if(options.weatherType == 'forecast') {
				apiURL += 'forecast/daily?';
			} else if(options.weatherType == 'current') {
				apiURL += 'weather?';
			}
			if(options.city !== '') {
				apiURL += 'q='+options.city;
			} else if(options.cityid !== '') {
				apiURL += 'id='+options.cityid;
			} else if(options.geocoords !== '') {
				var geoCoords = options.geocoords.split(',');
				apiURL += 'lat='+geoCoords[1]+'&lon='+geoCoords[2];
			} else {
				options.error("A valid location is required.");
				return false;
			}
			apiURL += '&units='+options.units+'&lang='+options.lang+'&callback=?';

			$.getJSON(
				apiURL,
				function(data) {
					var compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];

					if(data !== null) {
						if(options.weatherType == 'forecast') {
							var weather = {
								city: data.city.name,
								cityID: data.city.id
							};

							$.each(data.list, function(i, result) {
								if(result.temp.max < 80 && result.humidity < 40) {
									var heatIndex = -42.379+2.04901523*result.temp.max+10.14333127*result.humidity-0.22475541*result.temp.max*result.humidity-6.83783*(Math.pow(10, -3))*(Math.pow(result.temp.max, 2))-5.481717*(Math.pow(10, -2))*(Math.pow(result.humidity, 2))+1.22874*(Math.pow(10, -3))*(Math.pow(result.temp.max, 2))*result.humidity+8.5282*(Math.pow(10, -4))*result.temp.max*(Math.pow(result.humidity, 2))-1.99*(Math.pow(10, -6))*(Math.pow(result.temp.max, 2))*(Math.pow(result.humidity,2));
								} else {
									var heatIndex = result.temp.max;
								}

								if(options.units === "imperial") {
									var unit = "f";
									var unitAlt = "c";
									var dayAlt = Math.round((5.0/9.0)*(result.temp.day-32.0));
									var eveAlt = Math.round((5.0/9.0)*(result.temp.eve-32.0));
									var highAlt = Math.round((5.0/9.0)*(result.temp.max-32.0));
									var lowAlt = Math.round((5.0/9.0)*(result.temp.min-32.0));
									var morningAlt = Math.round((5.0/9.0)*(result.temp.morn-32.0));
									var nightAlt = Math.round((5.0/9.0)*(result.temp.night-32.0));
								} else {
									var unit = "c";
									var unitAlt = "f";
									var dayAlt = Math.round((9.0/5.0)*result.temp.day+32.0);
									var eveAlt = Math.round((9.0/5.0)*result.temp.eve+32.0);
									var highAlt = Math.round((9.0/5.0)*result.temp.max+32.0);
									var lowAlt = Math.round((9.0/5.0)*result.temp.min+32.0);
									var morningAlt = Math.round((9.0/5.0)*result.temp.morn+32.0);
									var nightAlt = Math.round((9.0/5.0)*result.temp.night+32.0);
								}

								weather['day'+i] = {
									timestamp: result.dt,
									temp: {
										unit: unit,
										day: Math.round(result.temp.day),
										eve: Math.round(result.temp.eve),
										high: Math.round(result.temp.max),
										low: Math.round(result.temp.min),
										morning: Math.round(result.temp.morn),
										night: Math.round(result.temp.night)
									},
									tempAlt: {
										unit: unitAlt,
										day: dayAlt,
										eve: eveAlt,
										high: highAlt,
										low: lowAlt,
										morning: morningAlt,
										night: nightAlt
									},
									condition: result.weather[0].main,
									conditionCode: result.weather[0].id,
									pressure: result.pressure,
									humidity: result.humidity,
									heatindex: Math.round(heatIndex),
									cloudCoverage: result.clouds,
									wind: result.speed
								};
							});
						} else if(options.weatherType == 'current') {
							if(data.main.temp < 80 && data.main.humidity < 40) {
								var heatIndex = -42.379+2.04901523*data.main.temp+10.14333127*result.humidity-0.22475541*data.main.temp*result.humidity-6.83783*(Math.pow(10, -3))*(Math.pow(data.main.temp, 2))-5.481717*(Math.pow(10, -2))*(Math.pow(result.humidity, 2))+1.22874*(Math.pow(10, -3))*(Math.pow(data.main.temp, 2))*result.humidity+8.5282*(Math.pow(10, -4))*data.main.temp*(Math.pow(result.humidity, 2))-1.99*(Math.pow(10, -6))*(Math.pow(data.main.temp, 2))*(Math.pow(data.main.humidity,2));
							} else {
								var heatIndex = data.main.temp;
							}

							if(options.units === "imperial") {
								var unit = "f";
								var unitAlt = "c";
								var currentAlt = Math.round((5.0/9.0)*(data.main.temp-32.0));
								var lowAlt = Math.round((5.0/9.0)*(data.main.temp_min-32.0));
								var highAlt = Math.round((5.0/9.0)*(data.main.temp_max-32.0));
							} else {
								var unit = "c";
								var unitAlt = "f";
								var currentAlt = Math.round((9.0/5.0)*data.main.temp+32.0);
								var lowAlt = Math.round((9.0/5.0)*data.main.temp_min+32.0);
								var highAlt = Math.round((9.0/5.0)*data.main.temp_max+32.0);
							}

							var weather = {
								city: data.name,
								cityID: data.id,
								timestamp: data.dt,
								temp: {
									unit: unit,
									current: Math.round(data.main.temp),
									low: Math.round(data.main.temp_min),
									high: Math.round(data.main.temp_max)
								},
								tempAlt: {
										unit: unitAlt,
										current: currentAlt,
										low: lowAlt,
										high: highAlt,
									},
								condition: data.weather[0].main,
								conditionCode: data.weather[0].id,
								sunrise: data.sys.sunrise,
								sunset: data.sys.sunset,
								humidity: data.main.humidity,
								heatindex: Math.round(heatIndex),
								pressure: data.main.pressure,
								wind: {
									speed: data.wind.speed,
									gust: data.wind.gust,
									deg: data.wind.deg
								},
								cloudCoverage: data.clouds.all
							};
						}

						options.success(weather);
					} else {
						options.error("There was an error retrieving the latest weather information. Please try again.");
					}
				}
			);
			return this;
		}
	});
})(jQuery);