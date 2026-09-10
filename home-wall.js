'use strict';
// Avoid running decorative motion while the page is in the background.
function updateMotion(){document.documentElement.classList.toggle('motion-paused',document.hidden);}
document.addEventListener('visibilitychange',updateMotion);
updateMotion();
