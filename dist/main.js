/* jshint devel:true */
'use strict';

console.log('%c  %c', 'background-image: url("http://www.emoji-cheat-sheet.com/graphics/emojis/heart.png"); background-size: cover', 'color: #FFFFFF');

BS.newTabLinks();

window.addEventListener('load', function () {

  // Animate the loader out on load
  setTimeout(function () {
    document.querySelector('#loaderContainer').classList.add('remove');
  }, 3000);



});
