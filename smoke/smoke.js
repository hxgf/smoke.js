var smoketimeout;
var smoke = {

	pageload: function(){
	window.addEventListener('load', function(){
		smoke.bodyload();
	}, false);
	},

	bodyload: function(){
		if (!document.getElementById('smoke-out')){
			var ff = document.createElement('div');
					ff.setAttribute('id','smoke-out');
					ff.setAttribute('class','smoke-base');
					document.body.appendChild(ff);
		}
	},

	forceload: function(){
	smoke.bodyload();
	},

	build: function(e,f){
		e = e.replace(/\n/g,'<br />');
		e = e.replace(/\r/g,'<br />');
		var prompt = '';
		if (f.type == 'prompt'){
			prompt =
				'<div class="dialog-prompt">'+
						'<input id="dialog-input" type="text" />'+
					'</div>';
		}

		var buttons = '';
		if (f.type != 'signal'){
			buttons = '<div class="dialog-buttons">';
			if (f.type == 'alert'){
				buttons +=
					'<button id="alert-ok">OK</button>';
			}

			if (f.type == 'prompt' || f.type == 'confirm'){
				buttons +=
					'<button id="'+f.type+'-cancel" class="cancel">Cancel</button>'+
					'<button id="'+f.type+'-ok">OK</button>';
			}

			buttons += '</div>';
		}

		var box =
		'<div id="smoke-bg"></div>'+
		'<div class="dialog smoke">'+
			'<div class="dialog-inner">'+
					e+
					prompt+
					buttons+
			'</div>'+
		'</div>';

		var ff = document.getElementById('smoke-out');
		ff.innerHTML = box;
		ff.className = 'smoke-base smoke-visible';

		// clear the timeout if it's already been activated
		if (smoketimeout){
				clearTimeout(smoketimeout);
		}

		// close on background click
		var g = document.getElementById('smoke-bg');
				g.addEventListener("click",function(){
					smoke.destroy(f.type);
					if (f.type == 'prompt' || f.type == 'confirm'){
						f.callback.call(f.scope, false);
					}
				}, false);

		// listeners for button actions

		if (f.type == 'alert'){
			// return true
			var h = document.getElementById('alert-ok');
					h.addEventListener("click",function(){
						smoke.destroy(f.type);
					}, false);

			// listen for enter key or space, close it
			document.onkeyup = function(e){
				if (e.keyCode == 13 || e.keyCode == 32){
					smoke.destroy(f.type);
				}
			};
		}

		if (f.type == 'confirm'){
			// return false
			var h = document.getElementById('confirm-cancel');
					h.addEventListener("click",function(){
								smoke.destroy(f.type);
								f.callback.call(f.scope, false);
					}, false);


			// return true
			var i = document.getElementById('confirm-ok');
					i.addEventListener("click",function(){
								smoke.destroy(f.type);
								f.callback.call(f.scope, true);
					}, false);

			// listen for enter key or space, close it & return true, esc will close with false
			document.onkeyup = function(e){
				if (e.keyCode == 13 || e.keyCode == 32){
					smoke.destroy(f.type);
					f.callback.call(f.scope, true);
				} else if(e.keyCode == 27) {
					smoke.destroy(f.type);
					f.callback.call(f.scope, false);
				}
			};

		}

		if (f.type == 'prompt'){
			// focus on input
			var pi = document.getElementById('dialog-input');

				setTimeout(function(){
					pi.focus();
					pi.select();
				},100);

			// return false
			var h = document.getElementById('prompt-cancel');
					h.addEventListener("click",function(){
								smoke.destroy(f.type);
								f.callback.call(f.scope, false);
					}, false);

			// return   contents of input box
			var j = document.getElementById('dialog-input');
			var i = document.getElementById('prompt-ok');
					i.addEventListener("click",function(){
								smoke.destroy(f.type);
								f.callback.call(f.scope, j.value);
					}, false);

			// listen for enter/esc
			document.onkeyup = function(e){
				if (e.keyCode == 13){
					smoke.destroy(f.type);
					f.callback.call(f.scope, j.value);
				} else if(e.keyCode == 27) {
					f.callback.call(f.scope, false);
				}
			};
		}



		// close after f.timeout ms
		if (f.type == 'signal'){
			smoketimeout = setTimeout(function(){
				smoke.destroy(f.type);
			},f.timeout);
		}

	},

	destroy: function(type){
		var box = document.getElementById('smoke-out');
				box.setAttribute('class','smoke-base');


			// confirm/alert/prompt remove click listener
			if (g = document.getElementById(type+'-ok')){
				g.removeEventListener("click", function(){}, false);

				// remove keyup listener
				document.onkeyup = null;
			}

			// confirm/prompt remove click listener
			if (h = document.getElementById(type+'-cancel')){

				h.removeEventListener("click", function(){}, false);
			}
	},

	alert: function(e){
		smoke.build(e,{type:'alert'});
	},

	signal: function(e,f){
		if (typeof(f) == 'undefined'){
			f = 5000;
		}
		smoke.build(e,{type:'signal',timeout:f});
	},

	confirm: function(e,f,s){
		smoke.build(e,{type:'confirm',callback:f,scope:s});

	},

	prompt: function(e,f,s){
		return smoke.build(e,{type:'prompt',callback:f, scope:s});
	}

};

// and start this
smoke.pageload();




// future

	// maybe ie (8-) support (event handlers, cat monocles)

	// custom prefs
		// custom true/false button text options

