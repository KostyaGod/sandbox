const body = document.querySelector('body');
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
        this.isClicked = false;
        this.bdrWidth = bdrWidth;
    }

    draw() {
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
        canvas.width = displayWidth;
        canvas.height = displayHeight;
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
        return dt > middle ? middle : dt
    }
}();

/* ------ Main Update Function ------ */
function Update(currentTime) {
    dt = correctDT((currentTime - lastTime) / 1000);
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
    if ((box_width.value > 0) &&
        (box_height.value > 0) &&
        (box_bdr_width.value > 0) &&
        (box_mass.value > 0)) {
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

