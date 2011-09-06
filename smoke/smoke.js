var smoke = {
  smoketimeout: [],
  init: false,
  zindex: 1000,
  i: 0,

	bodyload: function(id){
		var ff = document.createElement('div');
				ff.setAttribute('id','smoke-out-'+id);
/* 				ff.setAttribute('class','smoke-base'); */
				ff.className = 'smoke-base';
				ff.style.zIndex = smoke.zindex;
				smoke.zindex++;
				document.body.appendChild(ff);
	},

	newdialog: function(){
		var newid = new Date().getTime();
				newid = Math.random(1,99) + newid;	

		// make a new container while you're at it
		if (!smoke.init){		
	    smoke.listen(window,"load", function(){
		    smoke.bodyload(newid);
			});
		}else{
	    smoke.bodyload(newid);		
		}

		return newid;
	},

	forceload: function(){},

	build: function(e,f){
		smoke.i++;
		
		// determine stacking order
		f.stack = smoke.i;

		e = e.replace(/\n/g,'<br />');
		e = e.replace(/\r/g,'<br />');

		var prompt = '';

		if (f.type == 'prompt'){
			prompt = 
				'<div class="dialog-prompt">'+
						'<input id="dialog-input-'+f.newid+'" type="text" ' + (f.params.value ? 'value="' + f.params.value + '"' : '') + ' />'+
					'</div>';
		}

		
		var ok = 'OK';
		var cancel = 'Cancel';
		var classname = '';
		
		if (f.params.ok){
			ok = f.params.ok;
		}
		
		if (f.params.cancel){
			cancel = f.params.cancel;
		}
		
		if (f.params.classname){
			classname = f.params.classname;
		}


		var buttons = '';
		if (f.type != 'signal'){
			buttons = '<div class="dialog-buttons">';
			if (f.type == 'alert'){
				buttons +=
					'<button id="alert-ok-'+f.newid+'">'+ok+'</button>';
			}
			if (f.type == 'prompt' || f.type == 'confirm'){
				buttons +=
					'<button id="'+f.type+'-cancel-'+f.newid+'" class="cancel">'+cancel+'</button>'+
					'<button id="'+f.type+'-ok-'+f.newid+'">'+ok+'</button>';
			}
			buttons += '</div>';
		}


		var box = 
		'<div id="smoke-bg-'+f.newid+'" class="smokebg"></div>'+
		'<div class="dialog smoke '+classname+'">'+
			'<div class="dialog-inner">'+
					e+
					prompt+
					buttons+			
			'</div>'+
		'</div>';

	



		if (!smoke.init){		
	    smoke.listen(window,"load", function(){
	    	smoke.finishbuild(e,f,box);
			});
		}else{
	    	smoke.finishbuild(e,f,box);
		}

	},



	finishbuild: function(e,f,box){
	
		var ff = document.getElementById('smoke-out-'+f.newid+'');
				ff.className = 'smoke-base smoke-visible';		
				ff.innerHTML = box;
				
		while (ff.innerHTML == ""){
			ff.innerHTML = box;
		}
		
		// clear the timeout if it's already been activated
		if (smoke.smoketimeout[f.newid]){
				clearTimeout(smoke.smoketimeout[f.newid]);
		}
		
		// close on background click
		// buberdds got rid of this for ie support?
		var g = document.getElementById('smoke-bg-'+f.newid+'');
	      smoke.listen(g,"click", function(){
					smoke.destroy(f.type, f.newid);
					if (f.type == 'prompt' || f.type == 'confirm'){
						f.callback(false);
					}
					
					if (f.type == 'alert' && typeof f.callback !== 'undefined') {
						f.callback();
					}					
				});
	
	
		// listeners for button actions
	
		if (f.type == 'alert'){
			// return true
			var h = document.getElementById('alert-ok-'+f.newid+'');
		      smoke.listen(h,"click", function(){
						smoke.destroy(f.type, f.newid);
						if (typeof f.callback !== 'undefined') {
							f.callback();
						}					
					});
	
	
			// listen for enter key or space, close it
			document.onkeyup = function(e){
	  		if (!e) e = window.event;
				if (e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 27){
					smoke.destroy(f.type, f.newid);
					if (typeof f.callback !== 'undefined') {
						f.callback();
					}					

				}
			};
		}
		
		if (f.type == 'confirm'){
			// return false
			var h = document.getElementById('confirm-cancel-'+f.newid+'');            
		      smoke.listen(h,"click", function(){
							smoke.destroy(f.type, f.newid);
							f.callback(false);
					});
	
	
			
			// return true
			var i = document.getElementById('confirm-ok-'+f.newid+'');  
		      smoke.listen(i,"click", function(){
							smoke.destroy(f.type, f.newid);
							f.callback(true);
					});
					
			// listen for enter key or space, close it & return true, esc will close with false
			document.onkeyup = function(e){
	  		if (!e) e = window.event;
				if (e.keyCode == 13 || e.keyCode == 32){
					smoke.destroy(f.type, f.newid);
					f.callback(true);
				} else if (e.keyCode == 27){
					smoke.destroy(f.type, f.newid);
					f.callback(false);
				}
	
			};
	
		}
		
		if (f.type == 'prompt'){
			// focus on input
			var pi = document.getElementById('dialog-input-'+f.newid+'');
				
				setTimeout(function(){
					pi.focus();
					pi.select();
				},100);
	
			// return false
			var h = document.getElementById('prompt-cancel-'+f.newid+'');
		      smoke.listen(h,"click", function(){
						smoke.destroy(f.type, f.newid);
						f.callback(false);
					});
	
			// return	contents of input box
			var j = document.getElementById('dialog-input-'+f.newid+'');
			var i = document.getElementById('prompt-ok-'+f.newid+'');
		      smoke.listen(i,"click", function(){
							smoke.destroy(f.type, f.newid);
							f.callback(j.value);
					});
					
			// listen for enter
			document.onkeyup = function(e){
	  		if (!e) e = window.event;
				if (e.keyCode == 13){
					smoke.destroy(f.type, f.newid);
					f.callback(j.value);
				} else if (e.keyCode == 27){
					smoke.destroy(f.type, f.newid);
					f.callback(false);
				}
			};
		}
	
	
		// close after f.timeout ms
		if (f.type == 'signal'){
			smoke.smoketimeout[f.newid] = setTimeout(function(){
				smoke.destroy(f.type, f.newid);
			},f.timeout);
		}

	},
	
	
		
	destroy: function(type,id){
		var box = document.getElementById('smoke-out-'+id);
/* 				box.setAttribute('class','smoke-base'); */
				box.className = 'smoke-base';

			
			// confirm/alert/prompt remove click listener
			if (g = document.getElementById(type+'-ok-'+id)){
				smoke.stoplistening(g,"click",function(){});
				document.onkeyup = null;
			}
			
			// confirm/prompt remove click listener
			if (h = document.getElementById(type+'-cancel-'+id)){
				smoke.stoplistening(h,"click",function(){});
			}
			
			smoke.i = 0;
			box.innerHTML = '';

	},

	alert: function(e,f,g){
		if (typeof(f) != 'object'){
			f = false;
		}
		
		var id = smoke.newdialog();
		smoke.build(e,{type:'alert',callback:g,params:f,newid:id});
	},
	
	signal: function(e,f){
		if (typeof(f) == 'undefined'){
			f = 5000;
		}
		
		var id = smoke.newdialog();
		smoke.build(e,{type:'signal',timeout:f,params:false,newid:id});
	},
	
	confirm: function(e,f,g){
		if (typeof(g) != 'object'){
			g = false;
		}
		
		var id = smoke.newdialog();
		smoke.build(e,{type:'confirm',callback:f,params:g,newid:id});
		
	},
	
	prompt: function(e,f,g){
		if (typeof(g) != 'object'){
			g = false;
		}
		
		var id = smoke.newdialog();
		return smoke.build(e,{type:'prompt',callback:f,params:g,newid:id});
	},
	
	listen: function(e,f,g){
	
    if (e.addEventListener) {
      e.addEventListener(f, g, false);
    } else if (e.attachEvent){
      var r = e.attachEvent('on'+f, g);
      return r;
    }else{
    	return false;
    }
	},
	
	stoplistening: function(e,f,g){	
    if (e.removeEventListener) {
      e.removeEventListener("click", g, false);
    } else if (e.detachEvent){
      var r = e.detachEvent('on'+f, g);
      return r;
    }else{
    	return false;
    }
	}
};

		if (!smoke.init){		
	    smoke.listen(window,"load", function(){
		    smoke.init = true;
			});
		}