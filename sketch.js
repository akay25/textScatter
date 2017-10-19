var text_img;
var pts = [];

function setup() {

	var text_data = "Happy Diwali";

	createCanvas(window.innerWidth, window.innerHeight);

	text_img = textToimage(text_data);
	
	var points = [];
	for(var i=0;i<text_img.width;i++){
		for(var j=0;j<text_img.height;j++){
			var res_c = text_img.get(i, j);
			if(res_c[0] == 255 && res_c[1] == 255 && res_c[2] == 255){
				var pt = createVector(i, j);
				points.push(pt);
			}			
		}
	}
	var offsetx = width/2 - text_img.width/2;
	var offsety = height/3;

	for(var i=0;i<points.length;i++){
			var e = new Pt(points[i].x+offsetx, points[i].y+offsety);
			pts.push(e);
	}
}

var flagEnded = true;
var start = false;
var stage = 0;

function draw() {
	background(0);

    flagEnded = true;

    switch(stage){
        case 0:
            for(var i = 0;i<pts.length;i++){
                pts[i].show();
                if(start === true)
                    pts[i].update();
                if(pts[i].over === false)
                    flagEnded = false;
            }
            if(flagEnded === true){
                stage = 1;
                for(var i=0;i<pts.length;i++)
                    pts[i].dest = createVector(random(width), random(height));
            }
        break;
        
        case 1:
            for(var i = 0;i<pts.length;i++){
                pts[i].show();
                if(start === true)
                    pts[i].reach();
                if(pts[i].exploded === false)
                    flagEnded = false;
            }
            if(flagEnded === true)
                stage = 2;
        break;
        
        case 2:
            for(var i = 0;i<pts.length;i++){
                pts[i].show();
                if(start === true)
                    pts[i].fade();
                if(pts[i].faded === false)
                    flagEnded = false;
            }
            if(flagEnded === true){
                start = false;
                stage = -1;
            }
        break;

        default:
            console.log('Program ended');
    }
}

function keyPressed(){
	if(key == ' ' && start === false)
		start = true;
}

function Pt(x, y){
	this.dest = createVector(x, y);
    this.source = createVector(random(width), random(height));
    this.speedFactor = 3;

    this.alpha = 255;
    this.r = random(250, 255);
    this.g = random(200, 255);
    this.c = null;
    
    this.over = false;
    this.exploded = false;
    this.faded = false;

	this.show = function(){
        if(this.alpha == 0)
            this.faded = true;
        this.c = color(this.r, this.g, 0, this.alpha);
		stroke(this.c);
        fill(this.c, 0);
		point(this.source.x, this.source.y);
	}

	this.update = function(){
        var d = this.dest.dist(this.source);
		if(d > 1 && this.over === false){
			var dest = this.dest;
            var src = this.source;
			var speed = createVector(0, 0);
			
			if(src.x > dest.x)
				speed.x = random(-this.speedFactor, 0)*random(0, this.speedFactor-1);
			else
				speed.x = random(0, this.speedFactor)*random(0, this.speedFactor-1);
			
			if(src.y > dest.y)
				speed.y = random(-this.speedFactor, 0)*random(0, this.speedFactor-1);
			else	
				speed.y = random(0, this.speedFactor)*random(0, this.speedFactor-1);

			this.source.add(speed);
		}else
            this.over = true;
	}

    this.reach = function(){
        var d = this.dest.dist(this.source);
		if(d > 0.5)
            this.source = p5.Vector.lerp(this.dest, this.source, 0.9); 
        else
            this.exploded = true;
        
        this.fade();
    }

    this.fade = function(){
        this.alpha = lerp(0, this.alpha, 0.9); 
    }
}

function textToimage(ptext, fontStyle){
	var box = measureText(ptext, 45, fontStyle);
	
	var img = createGraphics(box.width, box.height);
	
	img.background(0);
	img.fill(255);
	img.stroke(255);

	img.textSize(45);
	img.textStyle(fontStyle);

	img.text(ptext, 1, 1 + 45);

	return img;
}

function measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
}