var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('click', getColor);
var lot = document.getElementById('parkinglot');

ctx.drawImage(lot, 0, 0, lot.naturalWidth * (canvas.height / lot.naturalHeight), canvas.height);
function getColor(e) {
	var x = e.clientX;
	var y = e.clientY;
	var p = ctx.getImageData(x, y, 1, 1).data;
	console.log(p);
}
