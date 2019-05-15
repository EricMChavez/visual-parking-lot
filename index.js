var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
let cars = [];
let intersections = [
	//Bottom Right
	[ 350, 520 ],
	//Bottom Left
	[ 165, 520 ],
	//Top Left
	[ 165, 155 ],
	//Top Right
	[ 350, 155 ]
];
let spaces = [
	//top spaces
	[ [ 47, 15 ], [ 47, 155 ], 'open' ],
	[ [ 100, 15 ], [ 100, 155 ], 'open' ],
	[ [ 155, 15 ], [ 155, 155 ], 'open' ],
	[ [ 208, 15 ], [ 208, 155 ], 'open' ],
	[ [ 260, 15 ], [ 260, 155 ], 'open' ],
	[ [ 314, 15 ], [ 314, 155 ], 'open' ],
	[ [ 366, 15 ], [ 366, 155 ], 'open' ],
	[ [ 420, 15 ], [ 420, 155 ], 'open' ],
	[ [ 473, 15 ], [ 473, 155 ], 'open' ],
	// bottom spaces
	[ [ 45, 660 ], [ 45, 520 ], 'open' ],
	[ [ 100, 660 ], [ 100, 520 ], 'open' ],
	[ [ 155, 660 ], [ 155, 520 ], 'open' ],
	[ [ 208, 660 ], [ 208, 520 ], 'open' ],
	[ [ 260, 660 ], [ 260, 520 ], 'open' ],
	[ [ 314, 660 ], [ 314, 520 ], 'open' ],
	[ [ 366, 660 ], [ 366, 520 ], 'open' ],
	[ [ 420, 660 ], [ 420, 520 ], 'open' ],
	[ [ 473, 660 ], [ 473, 520 ], 'open' ],
	// left spaces
	[ [ 25, 227 ], [ 165, 227 ], 'open' ],
	[ [ 25, 280 ], [ 165, 280 ], 'open' ],
	[ [ 25, 335 ], [ 165, 335 ], 'open' ],
	[ [ 25, 389 ], [ 165, 389 ], 'open' ],
	[ [ 25, 440 ], [ 165, 440 ], 'open' ],
	// middle spaces
	[ [ 303, 227 ], [ 165, 227 ], 'open' ],
	[ [ 303, 280 ], [ 165, 280 ], 'open' ],
	[ [ 303, 335 ], [ 165, 335 ], 'open' ],
	[ [ 303, 389 ], [ 165, 389 ], 'open' ],
	[ [ 303, 440 ], [ 165, 440 ], 'open' ],
	// right spaces
	[ [ 492, 227 ], [ 350, 227 ], 'open' ],
	[ [ 492, 280 ], [ 350, 280 ], 'open' ],
	[ [ 492, 335 ], [ 350, 335 ], 'open' ],
	[ [ 492, 389 ], [ 350, 389 ], 'open' ],
	[ [ 492, 440 ], [ 350, 440, 'open' ] ]
];

class Car {
	constructor(goal) {
		this.x = 650;
		this.y = 520;
		this.backX = this.x;
		this.backY = this.y;
		this.angle = 0;
		this.goal = goal;
		this.wayPoint = [];
		this.direction = 0;
		this.div;
		this.color = colorFactory();
	}
	initCar() {
		this.div = document.createElement('div');
		this.div.classList = 'car';
		this.div.style.backgroundImage = this.color;
		document.body.appendChild(this.div);
	}
	setCar() {
		this.angle = Math.atan2(this.backY - this.y, this.backX - this.x);
		this.backX = Math.cos(this.angle) * 30 + this.x;
		this.backY = Math.sin(this.angle) * 30 + this.y;
		this.div.style.left = this.x + 'px';
		this.div.style.top = this.y - 18 + 'px';
		this.div.style.transform = `rotate(${this.angle * 180 / Math.PI}deg)`;
	}
	setPath() {
		if (this.y == this.goal[1][1]) {
			this.wayPoint.push(this.goal[1]);
			this.wayPoint.push(this.goal[0]);
		} else if (intersections[0][0] == this.goal[1][0]) {
			this.wayPoint.push(intersections[0]);
			this.wayPoint.push(this.goal[1]);
			this.wayPoint.push(this.goal[0]);
		} else if (intersections[1][0] == this.goal[1][0]) {
			this.wayPoint.push(intersections[1]);
			this.wayPoint.push(this.goal[1]);
			this.wayPoint.push(this.goal[0]);
		} else if (intersections[2][1] == this.goal[1][1] && intersections[2][0] > this.goal[1][0]) {
			this.wayPoint.push(intersections[1]);
			this.wayPoint.push(intersections[2]);
			this.wayPoint.push(this.goal[1]);
			this.wayPoint.push(this.goal[0]);
		} else if (intersections[2][1] == this.goal[1][1] && intersections[2][0] < this.goal[1][0]) {
			this.wayPoint.push(intersections[0]);
			this.wayPoint.push(intersections[3]);
			this.wayPoint.push(this.goal[1]);
			this.wayPoint.push(this.goal[0]);
		}
	}
	setExit() {
		this.wayPoint.push(this.goal[1]);

		if (this.goal[1][1] == intersections[0][1]) {
			this.wayPoint.push(intersections[0]);
			this.wayPoint.push(intersections[3]);
		} else if (this.goal[1][0] == intersections[2][0]) {
			this.wayPoint.push(intersections[2]);
		} else if (this.goal[1][0] == intersections[3][0]) {
			this.wayPoint.push(intersections[3]);
		}
		this.wayPoint.push([ 650, 155 ]);
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
function colorFactory() {
	let colors = [
		`url('car-blue.png')`,
		`url('car-aqua.png')`,
		`url('car-dragon.png')`,
		`url('car-green.png')`,
		`url('car-grey.png')`,
		`url('car-hot-pink.png')`,
		`url('car-lime-green.png')`,
		`url('car-orange.png')`,
		`url('car-pink.png')`,
		`url('car-purple.png')`,
		`url('car-red-stripes.png')`,
		`url('car-red.png')`
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
function carFactory(goal) {
	cars.unshift(new Car(goal));
	cars[0].initCar();
	cars[0].setPath();
}

function updateCar(e) {
	car.setWayPoint(e.clientX, e.clientY);
	ctx.beginPath();
	ctx.arc(e.clientX, e.clientY, 5, 0, Math.PI * 2, false);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'red';
	ctx.stroke();
}
function update() {
	for (let car of cars) {
		car.moveCar();
		car.setCar();
	}
}
setInterval(() => {
	update();
}, 10);

function drawIntersection(intersection) {
	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.arc(intersection[0], intersection[1], 6, 0, 2 * Math.PI);
	ctx.stroke();
}
function drawSpaces(spot) {
	ctx.beginPath();
	ctx.fillStyle = 'green';
	ctx.arc(spot[0], spot[1], 3, 0, 2 * Math.PI);
	ctx.fill();
}
function drawFlags(flag) {
	ctx.beginPath();
	ctx.strokeStyle = 'blue';
	ctx.arc(flag[0], flag[1], 1, 0, 2 * Math.PI);
	ctx.stroke();
}
for (let intersection of intersections) {
	drawIntersection(intersection);
}
for (let spot of spaces) {
	drawSpaces(spot[0]);
	drawFlags(spot[1]);
}
for (let spot in spaces) {
	setTimeout(() => {
		carFactory(spaces[spot]);
	}, spot * 1500);
}
