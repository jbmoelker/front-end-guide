/**
 * initial component
 */
(function(window, document) {
	'use strict';

	var isCapableBrowser = 'querySelector' in document,
		ua = window.navigator.userAgent,
		fiveYears = 5 * 365;

	/*! loadCSS: load a CSS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. Licensed MIT */
	function loadCSS(href, before, media) {
		// Arguments explained:
		// `href` is the URL for your CSS file.
		// `before` optionally defines the element we'll use as a reference for injecting our <link>
		// By default, `before` uses the first <script> element in the page.
		// However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
		// If so, pass a different reference element to the `before` argument and it'll insert before that instead
		// note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
		var ss = window.document.createElement('link');
		var ref = before || window.document.getElementsByTagName('script')[0];
		var sheets = window.document.styleSheets;
		var rootpath = href.split(filePaths.rootpath.path)[1];
		ss.rel = 'stylesheet';
		ss.href = href;
		// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
		ss.media = 'only x';
		// inject link
		ref.parentNode.insertBefore(ss, ref);
		// This function sets the link's media back to `all` so that the stylesheet applies once it loads
		// It is designed to poll until document.styleSheets includes the new sheet.
		function toggleMedia() {
			var defined;
			for (var i = 0; i < sheets.length; i++) {

				if (sheets[i].href && sheets[i].href.indexOf(rootpath) > -1) {
					defined = true;
				}
			}
			if (defined) {
				ss.media = media || 'all';
			}
			else {
				setTimeout(toggleMedia);
			}
		}
		toggleMedia();
		return ss;
	}

	/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
	function loadJS( src, cb ){
		var ref = window.document.getElementsByTagName( "script" )[ 0 ];
		var script = window.document.createElement( "script" );
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore( script, ref );
		if (cb && typeof(cb) === "function") {
			script.onload = cb;
		}
		return script;
	}

	function getCookie(name) {
		// if value is undefined, get the cookie value
		var cookiestring = "; " + window.document.cookie;
		var cookies = cookiestring.split("; " + name + "=");
		if (cookies.length === 2) {
			return cookies.pop().split(";").shift();
		}
		return null;
	}

	function setCookie(name, value, days) {
		if (typeof useCookie === 'undefined') {
			// if value is a false boolean, we'll treat that as a delete
			if (value === false) {
				days = -1;
			}
			var expires;
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toGMTString();
			}
			else {
				expires = "";
			}
			window.document.cookie = name + "=" + value + expires + "; path=/";
		}
	}

	// load font (woff)
	var fontFile = filePaths.fonts.woff;
	if (ua.indexOf("Android") > -1 && ua.indexOf("like Gecko") > -1 && ua.indexOf("Chrome") == -1) {
		fontFile = filePaths.fonts.ttf;
	}

	if (fontFile && !getCookie(filePaths.fonts.name)) {
		loadCSS(fontFile);
		// set cookie to mark this file fetched
		setCookie(filePaths.fonts.name, fontFile, fiveYears);
	}

	// load js async and toggle no-js class
	if (isCapableBrowser) {
		loadJS(filePaths.js.path, function () {
			// Enable styling differentiation between browsers who passed our isCapableBrowser test
			document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
		});
	}

}(window, document));