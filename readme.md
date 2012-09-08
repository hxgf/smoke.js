IN THIS FORK:
- Enables signals to have custom classes applied

ALSO SEE:
- A branch on this fork called Animated or [Click here](http://argyleink.github.com/smoke.js/) it
- It uses a sweet css3 animation framework to control the in and out animations of signals



Notify or get approval from your users quickly and with style. This alert system uses css animations and background (so there are no images or js animation code...so it's really lightweight).

It's easy to implement and really easy to change the style.

Take a look at the demo: [http://ssssnakes.com/smoke/](http://ssssnakes.com/smoke/).




Supported Browsers
------------------
- Chrome
- Firefox
- Safari
- IE 6+ (usable, no animation [who cares], visual IE6 support [transparencies, etc] is up to you)
- iOS Mobile Safari

(widespread mobile support [android, blackberry, windows] uncertain...whatevs)





License
--------

(MIT License)

Copyright (c) 2011 Jonathan Youngblood &lt;jonathan.youngblood@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



Thanks!
--------
IE support, JSLint compliance, loading on demand, and other cool improvements facilitated by these dudes:

- Hugo Diaz
- Michal Zielenkiewicz
- Leon Fedotov
- Lautaro Orazi
- Leonardo Souza
- Carlos Brito Lage



Current User Notices
---------------------
-If any of your custom css depends on #smoke-out (like the original themes did), you'll need to change it to .smoke-base. Similarly, any #smoke-bg dependencies need to change to .smokebg.



Planned Updates
---------------
-Close dialog when "esc" is pressed (i think it's working on everything but .signal())

-Logic to support stacking alert (and possibly signal) dialogs better (show in the right order, one at a time)
	-errors in ie 7-8 :(
	
-Get webkit outbound transitions working properly again

-Uniform callback implementation for everything (it's currently being done a little differently for prompt/confirm() and alert())