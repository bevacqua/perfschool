(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*! fontfaceonload - v0.1.6 - 2015-03-13
 * https://github.com/zachleat/fontfaceonload
 * Copyright (c) 2015 Zach Leatherman (@zachleat)
 * MIT License */

;(function( win, doc ) {
	"use strict";

	var TEST_STRING = 'AxmTYklsjo190QW',
		SANS_SERIF_FONTS = 'sans-serif',
		SERIF_FONTS = 'serif',

		// lighter and bolder not supported
		weightLookup = {
			normal: '400',
			bold: '700'
		},

		defaultOptions = {
			tolerance: 2, // px
			delay: 100,
			glyphs: '',
			success: function() {},
			error: function() {},
			timeout: 5000,
			weight: '400', // normal
			style: 'normal'
		},

		// See https://github.com/typekit/webfontloader/blob/master/src/core/fontruler.js#L41
		style = [
			'display:block',
			'position:absolute',
			'top:-999px',
			'left:-999px',
			'font-size:48px',
			'width:auto',
			'height:auto',
			'line-height:normal',
			'margin:0',
			'padding:0',
			'font-variant:normal',
			'white-space:nowrap'
		],
		html = '<div style="%s">' + TEST_STRING + '</div>';

	var FontFaceOnloadInstance = function() {
		this.fontFamily = '';
		this.appended = false;
		this.serif = undefined;
		this.sansSerif = undefined;
		this.parent = undefined;
		this.options = {};
	};

	FontFaceOnloadInstance.prototype.getMeasurements = function () {
		return {
			sansSerif: {
				width: this.sansSerif.offsetWidth,
				height: this.sansSerif.offsetHeight
			},
			serif: {
				width: this.serif.offsetWidth,
				height: this.serif.offsetHeight
			}
		};
	};

	FontFaceOnloadInstance.prototype.load = function () {
		var startTime = new Date(),
			that = this,
			serif = that.serif,
			sansSerif = that.sansSerif,
			parent = that.parent,
			appended = that.appended,
			dimensions,
			options = this.options,
			ref = options.reference;

		function getStyle( family ) {
			return style
				.concat( [ 'font-weight:' + options.weight, 'font-style:' + options.style ] )
				.concat( "font-family:" + family )
				.join( ";" );
		}

		var sansSerifHtml = html.replace( /\%s/, getStyle( SANS_SERIF_FONTS ) ),
			serifHtml = html.replace( /\%s/, getStyle(  SERIF_FONTS ) );

		if( !parent ) {
			parent = that.parent = doc.createElement( "div" );
		}

		parent.innerHTML = sansSerifHtml + serifHtml;
		sansSerif = that.sansSerif = parent.firstChild;
		serif = that.serif = sansSerif.nextSibling;

		if( options.glyphs ) {
			sansSerif.innerHTML += options.glyphs;
			serif.innerHTML += options.glyphs;
		}

		function hasNewDimensions( dims, el, tolerance ) {
			return Math.abs( dims.width - el.offsetWidth ) > tolerance ||
					Math.abs( dims.height - el.offsetHeight ) > tolerance;
		}

		function isTimeout() {
			return ( new Date() ).getTime() - startTime.getTime() > options.timeout;
		}

		(function checkDimensions() {
			if( !ref ) {
				ref = doc.body;
			}
			if( !appended && ref ) {
				ref.appendChild( parent );
				appended = that.appended = true;

				dimensions = that.getMeasurements();

				// Make sure we set the new font-family after we take our initial dimensions:
				// handles the case where FontFaceOnload is called after the font has already
				// loaded.
				sansSerif.style.fontFamily = that.fontFamily + ', ' + SANS_SERIF_FONTS;
				serif.style.fontFamily = that.fontFamily + ', ' + SERIF_FONTS;
			}

			if( appended && dimensions &&
				( hasNewDimensions( dimensions.sansSerif, sansSerif, options.tolerance ) ||
					hasNewDimensions( dimensions.serif, serif, options.tolerance ) ) ) {

				options.success();
			} else if( isTimeout() ) {
				options.error();
			} else {
				if( !appended && "requestAnimationFrame" in window ) {
					win.requestAnimationFrame( checkDimensions );
				} else {
					win.setTimeout( checkDimensions, options.delay );
				}
			}
		})();
	}; // end load()

	FontFaceOnloadInstance.prototype.checkFontFaces = function( timeout ) {
		var _t = this;
		doc.fonts.forEach(function( font ) {
			if( font.family.toLowerCase() === _t.fontFamily.toLowerCase() &&
				( weightLookup[ font.weight ] || font.weight ) === ''+_t.options.weight &&
				font.style === _t.options.style ) {
				font.load().then(function() {
					_t.options.success();
					win.clearTimeout( timeout );
				});
			}
		});
	};

	FontFaceOnloadInstance.prototype.init = function( fontFamily, options ) {
		var timeout;

		for( var j in defaultOptions ) {
			if( !options.hasOwnProperty( j ) ) {
				options[ j ] = defaultOptions[ j ];
			}
		}

		this.options = options;
		this.fontFamily = fontFamily;

		// For some reason this was failing on afontgarde + icon fonts.
		if( !options.glyphs && "fonts" in doc ) {
			if( options.timeout ) {
				timeout = win.setTimeout(function() {
					options.error();
				}, options.timeout );
			}

			this.checkFontFaces( timeout );
		} else {
			this.load();
		}
	};

	var FontFaceOnload = function( fontFamily, options ) {
		var instance = new FontFaceOnloadInstance();
		instance.init(fontFamily, options);

		return instance;
	};

	// intentional global
	win.FontFaceOnload = FontFaceOnload;
})( this, this.document );

; browserify_shim__define__module__export__(typeof FontFaceOnload != "undefined" ? FontFaceOnload : window.FontFaceOnload);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict';

var ffol = require('fontfaceonload');
var html = document.documentElement;

watch('Lato');
watch('Cardo');
watch('Roboto');
watch('Merriweather');

function watch (family) {
  ffol(family, { success: loaded });

  function loaded () {
    html.className += ' ok-' + family
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/--/g, '-')
      .replace(/^-|-$/g, '');
  }
}

},{"fontfaceonload":1}]},{},[2]);
