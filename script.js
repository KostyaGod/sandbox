const body = document.querySelector('body');
// const game_display = document.getElementById('game_display');
const create_btn = document.getElementById('create_btn');
const box_height = document.getElementById('box_height');
const box_width = document.getElementById('box_width');
const box_bdr_width = document.getElementById('box_bdr_width');
const box_bgcolor = document.getElementById('box_bgcolor');
const box_bdrcolor = document.getElementById('box_bdrcolor');
const canvas = document.querySelector('canvas');
const box_mass = document.getElementById('box_mass');
const ctx = canvas.getContext('2d');
let objects = [];
let n = 0;
let clickedIndex = 0;
let isClicked = false;
let canvas_rect = canvas.getBoundingClientRect();
let dt = 0;
let lastTime = 0;

/*
// let rect_1 = {
//     x: -2,
//     y: -1.5,
//     width: 100,
//     height: 60,
//     dx: 2,
//     dy: 1.5,
//     color: 'green',
// };
// let rect_2 = {
//     x: canvas.width - 85 + 1.8,
//     y: canvas.height - 70 + 3,
//     width: 85,
//     height: 70,
//     dx: -1.8,
//     dy: -3,
//     color: 'blue',
// };
let circle_1 = {
    x: 38,
    y: 38.5,
    r: 40,
    dx: 2,
    dy: 1.5,
    color: 'green',
};
let circle_2 = {
    x: canvas.width - 60 + 1.8,
    y: canvas.height - 60 + 3,
    r: 60,
    dx: -1.8,
    dy: -3,
    color: 'blue',
};

// ctx.beginPath();
// ctx.fillStyle = 'red';
// ctx.arc(350, 200, 50, 0, 2 * Math.PI, false);
// ctx.fill();
// setInterval(move, 20);


function drawRectangle(rect) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}


function drawCircle(circle) {
    ctx.beginPath();
    ctx.fillStyle = circle.color;
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true);
    ctx.fill();
}


function walls_colision_rect(rect) {
    if (rect.x > canvas.width - rect.width || rect.x < 0) {
        rect.dx = -1 * rect.dx;
    }
    if (rect.y > canvas.height - rect.height || rect.y < 0) {
        rect.dy = -1 * rect.dy;
    }
}


function walls_colision_circle(circle) {
    if (circle.x > canvas.width - circle.r || circle.x < circle.r) {
        circle.dx = -1 * circle.dx;
    }
    if (circle.y > canvas.height - circle.r || circle.y < circle.r) {
        circle.dy = -1 * circle.dy;
    }
}


function move() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circle_1.x += circle_1.dx;
    circle_1.y += circle_1.dy;
    circle_2.x += circle_2.dx;
    circle_2.y += circle_2.dy;

    walls_colision_circle(circle_1);
    walls_colision_circle(circle_2);

    if (Math.sqrt(Math.abs(circle_1.x - circle_2.x) ** 2 + Math.abs(circle_1.y - circle_2.y) ** 2) < (circle_1.r + circle_2.r)) {
        circle_1.color = 'red';
        circle_2.color = 'black';
    } else {
        circle_1.color = 'green';
        circle_2.color = 'blue';
    }

    drawCircle(circle_1);
    drawCircle(circle_2);

    // drawRectangle(rect_1);
    // drawRectangle(rect_2);

    // if (x > canvas.width - 100 || x < 0) {
    //     dx = -1 * dx;
    // }
    // if (y > canvas.height - 60 || y < 0) {
    //     dy = -1 * dy;
    // }

    // if (x + 100 >= 200 && x <= 200) {
    //     ctx.fillStyle = 'green';
    // } else {
    //     ctx.fillStyle = 'red';
    // }

    // ctx.beginPath();
    // ctx.strokeStyle = 'blue';
    // ctx.moveTo(200, 0);
    // ctx.lineTo(200, canvas.height);
    // ctx.closePath();
    // ctx.stroke();

    window.requestAnimationFrame(move);
}

window.requestAnimationFrame(move);
*/

class Rectangle {

    constructor(x, y, width, height, bgcolor, bdrcolor, ctx, id, F, mass, bdrWidth) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.bgcolor = bgcolor;
        this.bdrcolor = bdrcolor;
        this.speedX = 0;
        this.speedY = 0;
        this.ctx = ctx;
        this.n = id;
        this.moveToX = 0;
        this.moveToY = 0;
        this.mass = mass;  //
        this.a = F / mass;
        this.mg = mass * 10;  //
        this.isClicked = false;
        this.bdrWidth = bdrWidth;
    }

    draw() {
        // console.log(this.x, this.y);
        this.ctx.beginPath();
        this.ctx.fillStyle = this.bgcolor;
        this.ctx.rect(this.x + this.bdrWidth / 2, this.y + this.bdrWidth / 2, this.width - this.bdrWidth, this.height - this.bdrWidth);
        if (this.bdrWidth != 0) {
            this.ctx.lineWidth = this.bdrWidth;
            this.ctx.strokeStyle = this.bdrcolor;
            this.ctx.stroke();
        }
        this.ctx.fill()
        this.ctx.closePath();
    }

    isMouseDown(clickX, clickY) {
        if ((clickX >= this.x) &&
            (clickX <= (this.x + this.width)) &&
            (clickY >= this.y) &&
            (clickY <= (this.y + this.height))) {
            return true;
        } else {
            return false;
        }
    }

    walls_colision() {
        if (this.x >= (canvas.width - this.width) || this.x <= 0) {
            if (this.x >= (canvas.width - this.width)) {
                this.x = (canvas.width - this.width);
            } else {
                this.x = 0;
            }
            this.speedX *= -0.5;
            this.speedY *= 0.99;
        }
        if (this.y >= (canvas.height - this.height) || this.y <= 0) {
            if (this.y >= (canvas.height - this.height)) {
                this.y = (canvas.height - this.height);
            } else {
                this.y = 0;
            }
            this.speedY *= -0.5;
            this.speedX *= 0.99;
        }
    }

    move(dt) {
        if (this.isClicked) {
            let dx = this.moveToX - this.x - this.width / 2;
            let dy = this.moveToY - this.y - this.height / 2;
            let dr = Math.sqrt(dx ** 2 + dy ** 2);
            if (Math.abs(dx) < this.width / 2) {
                this.x += this.speedX * dt + (this.a * Math.abs(dx) / dr * Math.sign(this.speedX) * (-2)) * (dt ** 2) / 2;
                this.speedX += (this.a * Math.abs(dx) / dr * Math.sign(this.speedX) * (-2)) * dt;
            } else {
                this.x += this.speedX * dt + (this.a * dx / dr) * (dt ** 2) / 2;
                this.speedX += this.a * dx * dt / dr;
            }
            if (Math.abs(dy) < this.height / 2) {
                this.y += this.speedY * dt + (this.a * Math.abs(dy) / dr * Math.sign(this.speedY) * (-1) + 100) * (dt ** 2) / 2;
                this.speedY += (this.a * Math.abs(dy) / dr * Math.sign(this.speedY) * (-1) + 100) * dt;
            } else {
                this.y += this.speedY * dt + (this.a * dy / dr + 100) * (dt ** 2) / 2;
                this.speedY += (this.a * dy / dr + 100) * dt;
            }
        } else {
            this.y += this.speedY * dt + 100 * (dt ** 2) / 2;
            this.x += this.speedX * dt;
            this.speedY += 100 * dt;
        }
    }
}


/* ------Update Width and Height of Canvas Display ------ */
function UpdateCanvasDisplay() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // console.log(canvas.width, canvas.height);
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        // console.log(canvas.width, canvas.height);
    }
}

/* ------ Сalculation of average of 10 dt ------ */
const correctDT = function () {
    let first = true;
    let prevs = [];
    return (dt) => {
        if (first) {
            first = false;
            return 0;
        }

        if (prevs.length < 2) {
            prevs.push(dt);
            return dt;
        }
        const middle = prevs.reduce((acc, el) => {
            return acc += el
        }, 0) / 2;
        prevs[0] = prevs[1];
        prevs[1] = dt;
        // console.log(dt, prevs, middle)
        return dt > middle ? middle : dt
    }
}();


window.addEventListener('pageshow', () => {
    // lastTime = animationTimeline.currentTime;
    console.log("lastTime:");
})

// document.addEventListener('freeze', () => {
//     lastTime = animationTimeline.currentTime;
//     console.log("lastTime:" + lastTime);
// })

/* ------ Main Update Function ------ */
function Update(currentTime) {
    dt = correctDT((currentTime - lastTime) / 1000);
    // console.log(dt)
    // dt = (currentTime - lastTime) / 1000;
    // console.log(currentTime);
    lastTime = currentTime;
    CheckedCollisions();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((item) => {
        item.walls_colision();
        item.move(dt);
        item.draw();
    });

    UpdateCanvasDisplay();

    window.requestAnimationFrame(Update);
}

/* ------ Сollision check ------ */
function isCollision(Rect, lastRect) {
    if ((Rect.x < (lastRect.x + lastRect.width)) &&
        (lastRect.x < (Rect.x + Rect.width)) &&
        (Rect.y < (lastRect.y + lastRect.height)) &&
        (lastRect.y < (Rect.y + Rect.height))) {
        return true;
    } else {
        return false;
    }
}

/* ------ Global Collision Check ------ */
function CheckedCollisions() {
    let objects_collisions = new Object();
    objects.forEach((Rect, index) => {
        let lastObj = objects.slice(index + 1);
        lastObj.forEach((lastRect, lastIndex) => {
            if (isCollision(Rect, lastRect)) {
                if (index.hasOwnProperty(objects_collisions)) {
                    objects_collisions.index += lastIndex;
                } else {
                    let speedXAfter = (Rect.speedX * Rect.mass + lastRect.speedX * lastRect.mass) / (Rect.mass + lastRect.mass);
                    let speedYAfter = (Rect.speedY * Rect.mass + lastRect.speedY * lastRect.mass) / (Rect.mass + lastRect.mass);
                    let dx, dy;
                    let LeftFront = false;
                    let TopFront = false;
                    if ((Rect.x - lastRect.x) >= 0) {
                        dx = (lastRect.x + lastRect.width - Rect.x) / 2;
                        LeftFront = true;
                    } else {
                        dx = (Rect.x + Rect.width - lastRect.x) / 2;
                        LeftFront = false;
                    }

                    if ((Rect.y - lastRect.y) >= 0) {
                        dy = (lastRect.y + lastRect.height - Rect.y) / 2;
                        TopFront = true;
                    } else {
                        dy = (Rect.y + Rect.height - lastRect.y) / 2;
                        TopFront = false;
                    }
                    Rect.speedX = speedXAfter;
                    Rect.speedY = speedYAfter;
                    lastRect.speedX = speedXAfter;
                    lastRect.speedY = speedYAfter;

                    if (dx <= dy) {
                        if (LeftFront) {
                            Rect.x += dx;
                            lastRect.x -= dx;
                        } else {
                            Rect.x -= dx;
                            lastRect.x += dx;
                        }
                    } else {
                        if (TopFront) {
                            Rect.y += dy;
                            lastRect.y -= dy;
                        } else {
                            Rect.y -= dy;
                            lastRect.y += dy;
                        }
                    }
                    objects_collisions.index = lastIndex;
                }
            }
        });
    });
}


/* ------ Add a mousedown click event handler  ------ */
canvas.addEventListener('mousedown', (event) => {
    if (n !== 0) {
        console.log('hey');
        canvas_rect = canvas.getBoundingClientRect();

        // calculate click coordinates
        let x = event.clientX - canvas_rect.x;
        let y = event.clientY - canvas_rect.y;

        // check whether an object is clicked
        objects.forEach((item, index) => {
            if (item.isMouseDown(x, y)) {
                item.isClicked = true;
                clickedIndex = index;
                isClicked = true;
            }
        });
    }
});


/* ------ Add a mouseup click event handler ------ */
body.addEventListener('mouseup', () => {
    if (n != 0) {
        objects[clickedIndex].isClicked = false;
    }
});


/* ------ Add a mousemove click event handler ------ */
canvas.addEventListener('mousemove', (event) => {
    if (isClicked) {

        // Сalculation of target motion coordinates for the clicked object
        objects[clickedIndex].moveToX = event.clientX - canvas_rect.x;
        objects[clickedIndex].moveToY = event.clientY - canvas_rect.y;
    }
});


/* ------ Global Collision Check ------ */
create_btn.addEventListener('click', () => {
    if ((box_width.value != 0) &&
        (box_height.value != 0)) {
        if (n < 4) {
            objects.push(new Rectangle(300, 150, Number(box_width.value), Number(box_height.value), box_bgcolor.value, box_bdrcolor.value, ctx, n, 5000, Number(box_mass.value), Number(box_bdr_width.value)));
            console.log(objects);
            n++;
        } else {
            alert('Maximum number of objects exceeded.');
        }
        if (n == 1) {
            window.requestAnimationFrame(Update);
            console.log('start');
        }
    } else {
        alert('You entered an incorrect height or width value. (They must be strictly positive numbers and not equal to 0)');
    }
});

