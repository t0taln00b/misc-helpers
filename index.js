'use strict';

(function(){

	//require('date-format-lite');    // date-format-lite adds format(mask, [zone]) method to native Date.prototype. > https://www.npmjs.com/package/date-format-lite
	//Date.masks.default = '<YYYY-MM-DD @ hh:mm:ss>';

	const STR_LEN          = 65,
	      SHOW_DATE        = false,
	      DUPLICATE_ERRORS = false, // Print error messages in both error and out logs
	      helpers          = {

		      isObject: param=>Object.prototype.toString.call(param) === "[object Object]",
		      isArray: param=>Object.prototype.toString.call(param) === "[object Array]",

		      restartServer: restartServer,
		      requiredProcessEnv: requiredProcessEnv,

		      log: logInfo,
		      warn: logWarn,
		      error: logError,

		      cleanUpString: cleanUpString,
		      replaceInStringBetween: replaceInStringBetween,

		      breakBitwise: breakBitwise,
		      buildBitwise: buildBitwise,

		      fromHex: fromHex,
		      toHex: toHex,

		      padString: padString
		      //trimStringsInObject: searchAndTrimLongStrings

	      };


	module.exports =
		Object.assign(
			helpers
		);

	// Logging

	function logInfo(){
		// Prints in log
		var args = Array.prototype.splice.call(arguments, 0);
		searchAndTrimLongStrings(args);
		if( SHOW_DATE ) args.unshift(getCurrentDate());
		console.log.apply(console, args);
	}

	function logWarn(){
		// Prints in both error and log
		var args = Array.prototype.splice.call(arguments, 0);
		searchAndTrimLongStrings(args);
		if( SHOW_DATE ) args.unshift(getCurrentDate());
		args.unshift('[WARN]');
		console.warn.apply(console, args);
		if( DUPLICATE_ERRORS ) console.log.apply(console, args);
	}

	function logError(){
		// Prints in error
		var args = Array.prototype.splice.call(arguments, 0);
		searchAndTrimLongStrings(args);
		if( SHOW_DATE ) args.unshift(getCurrentDate());
		args.unshift('[ERROR]');
		console.error.apply(console, args);
		if( DUPLICATE_ERRORS ) console.log.apply(console, args);
	}


	// Process

	function restartServer(err){
		if( err ){ logError(err); }
		logError('Restarting server (process.exit)');
		process.exit(1);
	}

	function requiredProcessEnv(name, alternativeValue){
		if( !process.env[name] ){
			if( !alternativeValue ){
				return restartServer('You must set the ' + name + ' environment variable');
			}
			logInfo('[i] You should set the ' + name + ' environment variable, using default:', alternativeValue);
			return alternativeValue;
		}

		logInfo('[i]', name, '=', process.env[name]);
		return process.env[name];
	}


	// Bitwise

	function breakBitwise(number, size){
		var params = [],
		    size   = size || 2;

		for(var i = 0; i < size; i++){
			params.push(+number & Math.pow(2, i) ? true : false);
		}

		return params;
	}

	function buildBitwise(params){
		var number = 0;
		if( !params ){ params = []; }

		for(var i = 0; i < params.length; i++){
			if( +params[i] ){
				number |= Math.pow(2, i);
			}
		}
		return number;
	}


	// Misc

	function fromHex(hex){
		return parseInt(hex, 16)
	}

	function toHex(int){
		return parseInt(int).toString(16).toUpperCase();
	}

	function cleanUpString(str){
		if( !str || typeof str.split !== 'function' ) return str;
		return str.split(/\r\n|\r|\n/g)[0];     // strips new line character 0a at the end of string
	}

	function searchAndTrimLongStrings(args){
		for(var i = 0; i < args.length; i++){
			if( typeof args[i] === 'object' ){
				let str = JSON.stringify(args[i]);
				if( str.length > STR_LEN ){
					str = str.slice(0, STR_LEN) + '...';
				}
				args[i] = str;
			}
		}
	}

	function replaceInStringBetween(str, start, end, what){
		return str.substring(0, start) + what + str.substring(end);
	}

	function getCurrentDate(){
		return new Date();//.format();
	}

	function padString(str, paddingValue){
		return String(paddingValue + str).slice(-paddingValue.length);
	}

})();