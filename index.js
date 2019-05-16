var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
let cars = [];
let queue = [];
let leaveRequest = [];
let moving = [];
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
	[ [ 47, 15 ], [ 47, 155 ], 'open', 'free' ], //0
	[ [ 100, 15 ], [ 100, 155 ], 'open', 'free' ], //1
	[ [ 155, 15 ], [ 155, 155 ], 'open', 'free' ], //2
	[ [ 208, 15 ], [ 208, 155 ], 'open', 'free' ], //3
	[ [ 260, 15 ], [ 260, 155 ], 'open', 'free' ], //4
	[ [ 314, 15 ], [ 314, 155 ], 'open', 'free' ], //5
	[ [ 366, 15 ], [ 366, 155 ], 'open', 'free' ], //6
	[ [ 420, 15 ], [ 420, 155 ], 'open', 'free' ], //7
	[ [ 473, 15 ], [ 473, 155 ], 'open', 'free' ], //8

	// left spaces
	[ [ 25, 227 ], [ 165, 227 ], 'open', 'free' ], //9
	[ [ 25, 280 ], [ 165, 280 ], 'open', 'free' ], //10
	[ [ 25, 335 ], [ 165, 335 ], 'open', 'free' ], //11
	[ [ 25, 389 ], [ 165, 389 ], 'open', 'free' ], //12
	[ [ 25, 440 ], [ 165, 440 ], 'open', 'free' ], //13
	// middle spaces
	[ [ 303, 227 ], [ 165, 227 ], 'open', 'free' ], //14
	[ [ 303, 280 ], [ 165, 280 ], 'open', 'free' ], //15
	[ [ 303, 335 ], [ 165, 335 ], 'open', 'free' ], //16
	[ [ 303, 389 ], [ 165, 389 ], 'open', 'free' ], //17
	[ [ 303, 440 ], [ 165, 440 ], 'open', 'free' ], //18
	// right spaces
	[ [ 492, 227 ], [ 350, 227 ], 'open', 'free' ], //19
	[ [ 492, 280 ], [ 350, 280 ], 'open', 'free' ], //20
	[ [ 492, 335 ], [ 350, 335 ], 'open', 'free' ], //21
	[ [ 492, 389 ], [ 350, 389 ], 'open', 'free' ], //22
	[ [ 492, 440 ], [ 350, 440 ], 'open', 'free' ], //23
	// bottom spaces
	[ [ 45, 660 ], [ 45, 520 ], 'open', 'free' ], //24
	[ [ 100, 660 ], [ 100, 520 ], 'open', 'free' ], //25
	[ [ 155, 660 ], [ 155, 520 ], 'open', 'free' ], //26
	[ [ 208, 660 ], [ 208, 520 ], 'open', 'free' ], //27
	[ [ 260, 660 ], [ 260, 520 ], 'open', 'free' ], //28
	[ [ 314, 660 ], [ 314, 520 ], 'open', 'free' ], //29
	[ [ 366, 660 ], [ 366, 520 ], 'open', 'free' ], //30
	[ [ 420, 660 ], [ 420, 520 ], 'open', 'free' ], //31
	[ [ 473, 660 ], [ 473, 520 ], 'open', 'free' ] //32
];

class Car {
	constructor() {
		this.x = 800;
		this.y = 520;
		this.backX = this.x;
		this.backY = this.y;
		this.angle = 0;
		this.goal;
		this.wayPoint = [];
		this.direction = 0;
		this.div;
		this.color = colorFactory();
		this.parked = false;
	}
	initCar() {
		this.div = document.createElement('div');
		this.div.classList = 'car';
		this.div.style.backgroundImage = this.color;
		document.body.appendChild(this.div);
	}
	setCar() {
		this.angle = Math.atan2(this.backY - this.y, this.backX - this.x);
		this.backX = Math.cos(this.angle) * 35 + this.x;
		this.backY = Math.sin(this.angle) * 35 + this.y;
		this.div.style.left = this.x + 'px';
		this.div.style.top = this.y - 18 + 'px';
		this.div.style.transform = `rotate(${this.angle * 180 / Math.PI}deg)`;
	}
	setTime() {
		this.parked = false;
		let time = Math.random() * 29 + 1;
		setTimeout(() => {
			leaveRequest.unshift(this);
		}, time * 1000);
	}
	setPath() {
		if (intersections[0][0] == this.goal[1][0]) {
			this.wayPoint.push(intersections[0]);
		} else if (intersections[1][0] == this.goal[1][0]) {
			this.wayPoint.push(intersections[1]);
		} else if (intersections[2][1] == this.goal[1][1] && intersections[2][0] > this.goal[1][0]) {
			this.wayPoint.push(intersections[1]);
			this.wayPoint.push(intersections[2]);
		} else if (intersections[2][1] == this.goal[1][1] && intersections[2][0] < this.goal[1][0]) {
			this.wayPoint.push(intersections[0]);
			this.wayPoint.push(intersections[3]);
		}
		this.wayPoint.push(this.goal[1]);
		this.wayPoint.push(this.goal[0]);
		this.parked = true;
	}
	setExit() {
		for (let i = 0; i < 30; i++) {
			if (this.goal[0] == spaces[i][0] && (i < 5 || i > 23)) {
				this.x += 2.5;
			}
		}
		this.wayPoint.push(this.goal[1]);
		if (this.goal[1][1] == intersections[0][1]) {
			this.wayPoint.push(intersections[0]);
			this.wayPoint.push(intersections[3]);
		} else if (this.goal[1][0] == intersections[2][0]) {
			this.wayPoint.push(intersections[2]);
		} else if (this.goal[1][0] == intersections[3][0]) {
			this.wayPoint.push(intersections[3]);
		}
		this.wayPoint.push([ 800, 155 ]);
		this.goal = 'exit';
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
				if (this.wayPoint[0][0] == 800) {
					moving.splice(moving.indexOf(this), 1);
				}
				this.wayPoint.shift();
			}
		} else if (this.parked == true) {
			moving.splice(moving.indexOf(this), 1);
			this.setTime();
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
function carFactory() {
	cars.unshift(new Car());
	cars[0].initCar();
	cars[0].setCar();
}
for (let x = 0; x < 100; x++) {
	carFactory();
}
for (let car of cars) {
	queue.push(car);
}

//
function attendant() {
	if (leaveRequest[0] && leaveRequest[0].goal != 'exit') {
		//	spaces[spaces.indexOf(leaveRequest[0].goal)][2] = 'open';
		leaveRequest[0].setExit();
		moving.push(leaveRequest.shift());
	}
	for (let spot of spaces) {
		if (spot[2] == 'open' && spot[3] == 'free') {
			spot[2] = 'closed';
			let car = queue.pop();
			car.goal = spot;
			car.setPath();
			break;
		}
	}
}
function toggleFree(spots) {
	for (let spot in spots) {
		if (spaces[spot][3] == 'free') {
			spaces[spot][3] = 'blocked';
		} else {
			spaces[spot][3] = 'free';
		}
	}
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
setInterval(() => {
	attendant();
}, 1100);
