/**
*	SMOKE.JS - 0.1.3
*	(c) 2011-2013 Jonathan Youngblood
*	demos / documentation: http://smoke-js.com/
*/

(function(window, document) {

	'use strict';

	var smoke = {
        smoketimeout: [],
        init: false,
        zindex: 1000,
        i: 0,

		bodyload: function(id) {
			var ff = document.createElement('div');
			ff.setAttribute('id','smoke-out-'+id);
			ff.className = 'smoke-base';
			ff.style.zIndex = smoke.zindex;
			smoke.zindex++;
			document.body.appendChild(ff);
		},

		newdialog: function() {
			var newid = new Date().getTime();
				newid = Math.random(1,99) + newid;

			if (!smoke.init) {
		    	smoke.listen(window,"load", function() {
			    	smoke.bodyload(newid);
				});
			} else {
		    	smoke.bodyload(newid);
			}

			smoke.newid = newid;
		},

		build: function (e, f) {
			smoke.i++;

			f.stack = smoke.i;

			e = e.replace(/\n/g,'<br />');
			e = e.replace(/\r/g,'<br />');

			var prompt = '',
			    ok = 'OK',
			    cancel = 'Cancel',
			    classname = '',
			    buttons = '',
			    box;

			if (f.type === 'prompt') {
				prompt =
					'<div class="dialog-prompt">'+
						'<input id="dialog-input-'+smoke.newid+'" type="text" ' + (f.params.value ? 'value="' + f.params.value + '"' : '') + ' />'+
					'</div>';
			}

			if (f.params.ok) {
				ok = f.params.ok;
			}

			if (f.params.cancel) {
				cancel = f.params.cancel;
			}

			if (f.params.classname) {
				classname = f.params.classname;
			}

			if (f.type !== 'signal') {
				buttons = '<div class="dialog-buttons">';
				if (f.type === 'alert') {
					buttons +=
						'<button id="alert-ok-'+smoke.newid+'">'+ok+'</button>';
				}
				 else if (f.type === 'quiz') {

					if (f.params.button_1) {
						buttons +=
							'<button class="quiz-button" id="'+f.type+'-ok1-'+smoke.newid+'">'+f.params.button_1+'</button>';
					}

					if (f.params.button_2) {
						buttons +=
							'<button class="quiz-button" id="'+f.type+'-ok2-'+smoke.newid+'">'+f.params.button_2+'</button>';
					}

					if (f.params.button_3) {
						buttons +=
							'<button class="quiz-button" id="'+f.type+'-ok3-'+smoke.newid+'">'+f.params.button_3+'</button>';
					}
					if (f.params.button_cancel) {
						buttons +=
							'<button id="'+f.type+'-cancel-'+smoke.newid+'" class="cancel">'+f.params.button_cancel+'</button>';
					}

				}

				 else if (f.type === 'prompt' || f.type === 'confirm') {
					if (f.params.reverseButtons) {
						buttons +=
							'<button id="'+f.type+'-ok-'+smoke.newid+'">'+ok+'</button>' +
							'<button id="'+f.type+'-cancel-'+smoke.newid+'" class="cancel">'+cancel+'</button>';
					} else {
						buttons +=
							'<button id="'+f.type+'-cancel-'+smoke.newid+'" class="cancel">'+cancel+'</button>'+
							'<button id="'+f.type+'-ok-'+smoke.newid+'">'+ok+'</button>';
					}
				}
				buttons += '</div>';
			}


			box =
				'<div id="smoke-bg-'+smoke.newid+'" class="smokebg"></div>'+
				'<div class="dialog smoke '+classname+'">'+
					'<div class="dialog-inner">'+
							e+
							prompt+
							buttons+
					'</div>'+
				'</div>';

			if (!smoke.init) {
				smoke.listen(window,"load", function() {
					smoke.finishbuild(e,f,box);
				});
			} else {
				smoke.finishbuild(e,f,box);
			}

		},

		finishbuild: function(e, f, box) {

			var ff = document.getElementById('smoke-out-'+smoke.newid);

			ff.className = 'smoke-base smoke-visible  smoke-' + f.type;
			ff.innerHTML = box;

			while (ff.innerHTML === "") {
				ff.innerHTML = box;
			}

			if (smoke.smoketimeout[smoke.newid]) {
				clearTimeout(smoke.smoketimeout[smoke.newid]);
			}

			smoke.listen(
				document.getElementById('smoke-bg-'+smoke.newid),
				"click",
				function () {
					smoke.destroy(f.type);
					if (f.type === 'prompt' || f.type === 'confirm' || f.type === 'quiz') {
						f.callback(false);
					} else if (f.type === 'alert' && typeof f.callback !== 'undefined') {
						f.callback();
					}
				}
			);


			switch (f.type) {
				case 'alert':
					smoke.finishbuildAlert(e, f, box);
					break;
				case 'confirm':
					smoke.finishbuildConfirm(e, f, box);
					break;
				case 'quiz':
					smoke.finishbuildQuiz(e, f, box);
					break;
				case 'prompt':
					smoke.finishbuildPrompt(e, f, box);
					break;
				case 'signal':
					smoke.finishbuildSignal(e, f, box);
					break;
				default:
					throw "Unknown type: " + f.type;
			}
		},

		finishbuildAlert: function (e, f) {
			smoke.listen(
				document.getElementById('alert-ok-'+smoke.newid),
				"click",
				function () {
					smoke.destroy(f.type);
					if (typeof f.callback !== 'undefined') {
						f.callback();
					}
				}
			);

			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 27) {
					smoke.destroy(f.type);
					if (typeof f.callback !== 'undefined') {
						f.callback();
					}
				}
			};
		},

		finishbuildConfirm: function (e, f) {
			smoke.listen(
				document.getElementById('confirm-cancel-' + smoke.newid),
				"click",
				function () {
					smoke.destroy(f.type);
					f.callback(false);
				}
			);

			smoke.listen(
				document.getElementById('confirm-ok-' + smoke.newid),
				"click",
				function () {
					smoke.destroy(f.type);
					f.callback(true);
				}
			);

			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				if (e.keyCode === 13 || e.keyCode === 32) {
					smoke.destroy(f.type);
					f.callback(true);
				} else if (e.keyCode === 27) {
					smoke.destroy(f.type);
					f.callback(false);
				}
			};
		},

		finishbuildQuiz: function (e, f) {
			var a = document.getElementById('quiz-ok1-'+smoke.newid),
				b = document.getElementById('quiz-ok2-'+smoke.newid),
				c = document.getElementById('quiz-ok3-'+smoke.newid);

			smoke.listen(
				document.getElementById('quiz-cancel-' + smoke.newid),
				"click",
				function () {
					smoke.destroy(f.type);
					f.callback(false);
				}
			);


			if (a) {
				smoke.listen(
					a,
					"click",
					function () {
						smoke.destroy(f.type);
						f.callback(a.innerHTML);
					}
				);
			}


			if (b) {
				smoke.listen(
					b,
					"click",
					function () {
						smoke.destroy(f.type);
						f.callback(b.innerHTML);
					}
				);
			}


			if (c) {
				smoke.listen(
					c,
					"click",
					function () {
						smoke.destroy(f.type);
						f.callback(c.innerHTML);
					}
				);
			}

			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}
				if (e.keyCode === 27) {
					smoke.destroy(f.type, smoke.newid);
					f.callback(false);
				}
			};

		},

		finishbuildPrompt: function (e, f) {
			var pi = document.getElementById('dialog-input-'+smoke.newid);

			setTimeout(function () {
				pi.focus();
				pi.select();
			}, 100);

			smoke.listen(
				document.getElementById('prompt-cancel-'+smoke.newid),
				"click",
				function () {
					smoke.destroy(f.type);
					f.callback(false);
				}
			);

			smoke.listen(
				document.getElementById('prompt-ok-'+smoke.newid),
				"click",
				function () {
					smoke.destroy(f.type);
					f.callback(pi.value);
				}
			);

			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}

				if (e.keyCode === 13) {
					smoke.destroy(f.type);
					f.callback(pi.value);
				} else if (e.keyCode === 27) {
					smoke.destroy(f.type);
					f.callback(false);
				}
			};
		},

		finishbuildSignal: function (e, f) {

			document.onkeyup = function (e) {
				if (!e) {
					e = window.event;
				}

				if (e.keyCode === 27) {
					smoke.destroy(f.type);

					if (typeof f.callback !== 'undefined') {
						f.callback();
					}
				}
			};

			smoke.smoketimeout[smoke.newid] = setTimeout(function () {
				smoke.destroy(f.type);
				if (typeof f.callback !== 'undefined') {
					f.callback();
				}
			}, f.timeout);
		},


		destroy: function (type) {

			var id = smoke.newid,
                box = document.getElementById('smoke-out-'+id),
				okButton;

			if (type !== 'quiz') {
			    okButton = document.getElementById(type+'-ok-'+id);
			}

	    	var cancelButton = document.getElementById(type+'-cancel-'+id);
			box.className = 'smoke-base';

			if (okButton) {
				smoke.stoplistening(okButton, "click", function() {});
				document.onkeyup = null;
			}

			if (type === 'quiz') {
				var quiz_buttons = document.getElementsByClassName("quiz-button");
				for (var i = 0; i < quiz_buttons.length; i++) {
					smoke.stoplistening(quiz_buttons[i], "click", function() {});
					document.onkeyup = null;
				}
			}

			if (cancelButton) {
				smoke.stoplistening(cancelButton, "click", function() {});
			}

			// stops processing of destroying a modal twice with timeout
			if (type === 'signal') {
				window.clearTimeout(smoke.smoketimeout[smoke.newid]);
			}

			smoke.i = 0;
			document.body.removeChild(box);
			smoke.newid = null;
		},

		alert: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}

			smoke.newdialog();

			smoke.build(e, {
				type:     'alert',
				callback: f,
				params:   g
			});
		},

		signal: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}

			var duration = 5000;
			if (g.duration !== 'undefined'){
				duration = g.duration;
			}

			smoke.newdialog();
			smoke.build(e, {
				type:    'signal',
				callback: f,
				timeout: duration,
				params:  g
			});
		},

		confirm: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}

			smoke.newdialog();
			smoke.build(e, {
				type:     'confirm',
				callback: f,
				params:   g
			});
		},

		quiz: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}

			smoke.newdialog();
			smoke.build(e, {
				type:     'quiz',
				callback: f,
				params:   g
			});
		},

		prompt: function (e, f, g) {
			if (typeof g !== 'object') {
				g = false;
			}

			smoke.newdialog();
			return smoke.build(e, {
                type:'prompt',
                callback:f,
                params:g
            });
		},

		listen: function (e, f, g) {
    	    if (e.addEventListener) {
                return e.addEventListener(f, g, false);
    	    }

    	    if (e.attachEvent) {
                return e.attachEvent('on'+f, g);
    	    }

			return false;
		},

		stoplistening: function (e, f, g) {
		    if (e.removeEventListener) {
		      return e.removeEventListener(f, g, false);
		    }

		    if (e.detachEvent) {
		      return e.detachEvent('on'+f, g);
		    }

		    return false;
		}
	};


	smoke.init = true;

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = smoke;
	} else if (typeof define === 'function' && define.amd) {
		define('smoke', [], function() {
		    return smoke;
		});
	} else {
		window.smoke = smoke;
	}

})(window, document);
