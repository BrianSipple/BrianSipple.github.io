!function(e){"use strict";function t(){var e,t=f.slice(0,f.length/2),i=f.slice(f.length/2),o=g?0:l;g?(e=new TimelineMax({}),e.add([c(),a(t,!1),a(i,!0)]),d.classList.remove("expanded")):(e=new TimelineMax({onStart:function(){d.classList.add("expanded")}}),e.add(s()),e.add([n(t,-o,!1),n(i,o,!0)])),g=!g}function n(e,t,n){var a,s,c,i,o=e.length,l=[];return e.forEach(function(e,r){s=n?t*(r+1)/o:t*(o-r)/o,c=n?r+1:o-r,a=n?T+.3*r:T+.3*(o-(r+1)),i=n?w[o+r]:w[o-r-1],l.push(TweenMax.set(e,{css:{zIndex:c}}),TweenMax.to(e,2.2*a,{x:s,scale:.6,scaleX:1.3,ease:Elastic.easeOut.config(1.01,.5)}),TweenMax.to(e,1.6*a,{scale:m,ease:Elastic.easeOut.config(1.1,.6),delay:.2*a-.1}),TweenMax.fromTo(i,.2*T,{scale:0},{scale:1,delay:.2*a-.1,ease:Power4.easeInOut}))}),l}function a(e,t){var n,a,s,c=[],i=e.length;return e.forEach(function(e,o){n=t?o+1:i-o,s=t?T+.1*o:T+.1*(i-o),a=t?w[o]:w[i-o-1],c.push(TweenMax.set(e,{css:{zIndex:n}}),TweenMax.to(e,.1*s+.4,{x:0,scale:.95,ease:Power4.easeInOut}),TweenMax.to(a,.2*T,{scale:0,ease:Power4.easeIn}))}),c}function s(){return TweenMax.to([d,f],.1*T,{scaleX:1.2,scaleY:.6,ease:Power4.easeOut,onComplete:function(){TweenMax.to(d,T,{scale:m,ease:Elastic.easeOut.config(1.1,.6),delay:.075*T}),TweenMax.to(u,.8*T,{scale:1.4,ease:Elastic.easeOut.config(1.1,.6)})}})}function c(){return TweenMax.to([d,u],1.4*T,{scale:1,delay:.1*T,ease:Elastic.easeOut.config(1.1,.3)})}function i(){for(var e,t,n,a=document.createDocumentFragment(),s=0,c=x.length;c>s;s++)e=document.createElement("button"),t=document.createElement("a"),n=document.createElement("i"),e.classList.add("button-share__link"),t.setAttribute("href",x[s].href),t.setAttribute("target","_new"),n.classList.add("ic"),n.classList.add("ic_share-link"),n.classList.add(x[s].iconClass),t.appendChild(n),e.appendChild(t),a.appendChild(e),f.push(e),w.push(n);r.appendChild(a),d.style.zIndex=f.length+1,l=(f.length-2)*h+(f.length-2)*p}function o(){i()}var l,r=document.querySelector(".button-set-container"),d=document.querySelector(".button-share__toggle"),u=d.querySelector(".ic"),h=d.clientWidth,p=.8*h,f=[],w=[],g=!1,m=.8,x=[{href:"https://www.twitter.com/@Brian_Sipple",iconClass:"icon-social-twitter"},{href:"https://www.linkedin.com/in/briansipple",iconClass:"icon-social-linkedin"},{href:"https://plus.google.com/+BrianSipple",iconClass:"icon-social-gplus"},{href:"https://github.com/BrianSipple",iconClass:"icon-social-github"}],T=1.1;e.addEventListener("load",function(){o()},!1),d.addEventListener("click",t,!1)}(window);