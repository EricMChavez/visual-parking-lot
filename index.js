var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
window.addEventListener('click', updateCar);

class Car {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.backX = 0;
		this.backY = 0;
		this.angle = 0;
		this.goal;
		this.wayPoint = [];
		this.direction = 0;
		this.div;
	}
	initCar() {
		this.div = document.createElement('div');
		this.div.classList = 'car';
		document.body.appendChild(this.div);
	}
	setCar() {
		this.angle = Math.atan2(this.backY - this.y, this.backX - this.x);
		this.backX = Math.cos(this.angle) * 40 + this.x;
		this.backY = Math.sin(this.angle) * 40 + this.y;
		this.div.style.left = this.x + 'px';
		this.div.style.top = this.y - 18 + 'px';
		this.div.style.transform = `rotate(${this.angle * 180 / Math.PI}deg)`;
	}
	setWayPoint(x, y) {
		this.wayPoint.push([ x, y ]);
	}
	moveCar() {
		if (this.wayPoint[0]) {
			this.direction = Math.atan2(this.wayPoint[0][1] - this.y, this.wayPoint[0][0] - this.x);
			this.x = Math.cos(this.direction) * 1 + this.x;
			this.y = Math.sin(this.direction) * 1 + this.y;
			if (
				this.x < this.wayPoint[0][0] + 1 &&
				this.x > this.wayPoint[0][0] - 1 &&
				this.y < this.wayPoint[0][1] + 1 &&
				this.y > this.wayPoint[0][1] - 1
			) {
				this.wayPoint.shift();
			}
		}
	}
}

let car = new Car(100, 100);
car.initCar();
function updateCar(e) {
	car.setWayPoint(e.clientX, e.clientY);
	ctx.beginPath();
	ctx.arc(e.clientX, e.clientY, 5, 0, Math.PI * 2, false);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'red';
	ctx.stroke();
}
function update() {
	car.moveCar();
	car.setCar();
}
setInterval(() => {
	update();
}, 10);
