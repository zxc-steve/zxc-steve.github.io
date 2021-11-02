var img = new Image();
//img.crossOrigin = 'anonymous';
img.src = 'aaa.png';
console.log("qqqqqqq");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
img.onload = function () {
	ctx.drawImage(img, 0, 0);
	img.style.display = 'none';
};
var hoveredColor = document.getElementById('hovered-color');
var selectedColor = document.getElementById('selected-color');


function pick(event, destination) {
	var x = event.layerX;
	var y = event.layerY;
	var pixel = ctx.getImageData(x, y, 1, 1);
	var data = pixel.data;

	var ccc = "中文";
	console.log(ccc);

	const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
	destination.style.background = rgba;
	destination.textContent = rgba;

	//return rgba;
	return ccc;
}

canvas.addEventListener('mousemove', function (event) {
	pick(event, hoveredColor);
});
canvas.addEventListener('click', function (event) {
	pick(event, selectedColor);
});