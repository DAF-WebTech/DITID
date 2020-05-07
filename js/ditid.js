// helper function for Strings, just like node.js's util.format
// the documentation for this is at https://nodejs.org/api/util.html#util_util_format_format_args
// except we use String.format, not util.format
// lets us do things like this: 
// String.format("I, %s, am a %s!", "Spot", "dog");
if (!String.format) {
	String.format = function (f) {

        var i = 1;
        var args = arguments;
        var len = args.length;
        var formatRegExp = /%[sdj%]/g;
        var str = String(f).replace(formatRegExp, function(x) {
            if (x === '%%') return '%';
            if (i >= len) return x;
                switch (x) {
                    case '%s': return String(args[i++]);
                    case '%d': return Number(args[i++]);
                    case '%j':
                        try {
                            return JSON.stringify(args[i++]);
                        } catch (_) {
                            return '[Circular]';
                        }
                    default:
                        return x;
                }
    	});
    	
    	for (var x = args[i]; i < len; x = args[++i]) {
            if (x === null || !(typeof x === 'object' && x !== null)) {
                str += ' ' + x;
            } else {
                str += ' ' + inspect(x);
            }
        }
        
        return str;
    }
}

if (!String.prototype.stripHTML) {
    String.prototype.stripHTML = function() {
        var div = document.createElement("div");
		div.innerHTML = this.valueOf();
		// add a space after each element in case we got adjacent elements, we don't want the text to run into each other
		div.querySelectorAll("*").forEach(function (e) {
			e.textContent += " ";
		});
		var ret = div.textContent;
		ret = ret.replace(/\s{2}/g, " ");
		return ret;
    }    
}

// pass in an argument {length: 72, char: "…"} (these are the default values)
// either or both values are optional (the above are the default values)
// e.g. "mystring".truncate()
// e.g. "mystring".truncate({length: 64})
// e.g. "mystring".truncate({char: "!"})
// e.g. "mystring".truncate({length: 64, char: "!"})
if (!String.prototype.truncate) {
    String.prototype.truncate = function(opts) {
        if (typeof opts == "undefined") {
            opts = {};
        }
        opts.length = (typeof opts.length == 'undefined' ? 72 : Number(opts.length));
        opts.char = (typeof opts.char == 'undefined' ? "…" : opts.char);

		var retVal = this.valueOf();
		if (retVal.length > opts.length) { 
			retVal = retVal.substr(0, retVal.lastIndexOf(" ", opts.length)); // truncate to last space char
			retVal = retVal.replace(/[\s\.\?\!\:,;]*$/g, ""); // remove trailing punctuation .?!:,; and whitespace \s 
			retVal += opts.char; // add trailing char
		}
		return retVal;
	}
}


// lets us do "forEach" on NodeList, which is returned from document.querySelector
// not part of the spec, but most browsers throw this for convenience, but not IE11
if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(fn, scope) {
        for(var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    }
}



// HEADER SEARCH - HIDE/SHOW
$(".header-search-toggle").click(function () {
    $(".global-search").fadeIn(150, function () {
        document.getElementById("header-search").focus();
    });

});
$(document).mouseup(function (e) {
    var container = $(".global-search");

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.fadeOut(150);
    }
});

$('.regions-list [id^="link"]').on('mouseenter mouseleave', function (e) {
    $('.svg-map').find('path').removeClass('active');
    $('.regions-list').find('a').removeClass('hover');
    var url = $(this).attr('id');
    url = url.replace('link-', '');
    map = '#lmap-' + url;
    $(map).addClass('active');
});

$(function () {
    var $tooltip = $('.map .tooltip');
    $('.svg-map path').hover(function () {
        $('.svg-map').find('path').removeClass('active');
        $('.regions-list').find('a').removeClass('hover');

        var tip = $(this).attr('title');
        var link = $(this).attr('id');

        link = link.replace('lmap-', 'link-');
        $('#' + link).addClass('hover');
        $tooltip.text(tip);
        $tooltip.show();


    }, function () {
        $tooltip.hide();
    });

});
