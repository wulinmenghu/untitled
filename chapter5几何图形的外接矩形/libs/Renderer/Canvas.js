﻿//ClASS:渲染器类型
function Canvas (layer) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    //只有当lock为false的时候才会执行绘制。
    this.lock = true;
    this.layer = layer;
    this.setSize(layer.size);
    this.geometrys = {};
    layer.div.appendChild(this.canvas);
}

//设置canvas元素的大小。
Canvas.prototype.setSize = function(size){
    this.canvas.width = size.w;
    this.canvas.height = size.h;
    this.canvas.style.width = size.w + "px";
    this.canvas.style.height = size.h + "px";
}

//这个方法用于收集所有需要绘制的矢量元素。    
Canvas.prototype.drawGeometry = function(geometry, style){
    this.geometrys[geometry.id] = [geometry, style];
    //如果渲染器没有被锁定则可以进行重绘。
    if(!this.lock){
        this.redraw();
    }
}

//每次绘制都是全部清除，全部重绘。
//todo加入快照后可以大大提高性能。    
Canvas.prototype.redraw = function(){
    this.context.clearRect(0, 0, this.layer.size.w, this.layer.size.h);
    var geometry;
    if(!this.lock){
        for(var id in this.geometrys){
			geometry = this.geometrys[id][0];
			var bounds = geometry.getBounds();
			if(this.layer.bounds.intersect(bounds)) {			
				style = this.geometrys[id][1];
				this.draw(geometry, style, geometry.id); 
			}
        }
    }    
}

//每一个矢量元素的绘制，这里我们在以后会添加更多的矢量图形。
Canvas.prototype.draw = function(geometry, style, id){
    if(geometry.geoType == "Point"){
        this.drawPoint(geometry, style, id);
    }
    if(geometry.geoType == "Circle") {
        this.drawCircle(geometry, style, id);
    }
    if(geometry.geoType == "Line") {
        this.drawLine(geometry, style, id);
    }
    if(geometry.geoType == "LinerRing") {
        this.drawLinerRing(geometry, style, id);
    }
	if(geometry.geoType == "LinerRing") {
        this.drawLinerRing(geometry, style, id);
    }
	if(geometry.geoType == "Img") {
        this.drawImage(geometry, style, id);
    }
    //{todo} 我们在这里判断各种矢量要素的绘制。        
}

Canvas.prototype.drawLine = function(geometry, style, id) {
    this.setCanvasStyle("stroke", style);
    this.rendererPath(geometry, {fill: false, stroke: true}, id);
    this.setCanvasStyle("reset");
}

Canvas.prototype.drawLinerRing = function(geometry, style, id) {
    if(style.stroke) {
        this.setCanvasStyle("stroke", style);
        this.rendererPath(geometry, {fill: false, stroke: true}, id);
    }
    if(style.fill) {
        this.setCanvasStyle("fill", style);
        this.rendererPath(geometry, {fill: true, stroke: true}, id);
    }
    this.setCanvasStyle("reset");
}

Canvas.prototype.rendererPath = function(geometry, rendererType, id) {
    var points = geometry.points;
    var len = points.length;
    var context = this.context;
    context.beginPath();
    var start = this.getLocalXY(points[0]);
    var x = start.x;
    var y = start.y;
    if (!isNaN(x) && !isNaN(y)) {
        context.moveTo(x, y);
        for (var i=1; i<len; ++i) {
            var pt = this.getLocalXY(points[i]);
            context.lineTo(pt.x, pt.y);
        }
        if (rendererType.fill) {
            context.fill();
        } 
        if (rendererType.stroke) {
            context.stroke();
        } 
    }
}

//针对点的绘制方法。
Canvas.prototype.drawPoint = function(geometry, style, id){
    var radius = style.pointRadius;
    var twoPi = Math.PI*2;
    var pt = this.getLocalXY(geometry);
    //填充
    if(style.fill) {
        this.setCanvasStyle("fill", style)
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius, 0, twoPi, true);
        this.context.fill();
    }
    //描边
    if(style.stroke) {
        this.setCanvasStyle("stroke", style)
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius, 0, twoPi, true);
        this.context.stroke();
    }
    this.setCanvasStyle("reset");
}

//针对图片的绘制方法。
Canvas.prototype.drawImage = function(geometry, style, id){
    var canvas = this;
	if(!geometry.useUrl) {
		var img = geometry.image;
		imageLoad();
	}else {
		var img = new Image();
		img.onload = imageLoad;
		img.loadErro = imageErro;
		img.src = geometry.image;	
	}
	
	function imageLoad() {
		canvas.setCanvasStyle("fill", style);
		var fixedSize = style.fixedSize;
		var pt = canvas.getLocalXY(geometry.point);
		var width = style.width || img.width;
		var height = style.width || img.height;
		if(fixedSize) {
			var offsetX = width / 2;
			var offsetY = height / 2;
			canvas.context.drawImage(img, pt.x - offsetX, pt.y - offsetY, width, height);
		}else {
			var res = canvas.layer.getRes();
			var offsetX = width / 2 / res;
			var offsetY = height / 2 / res;
			canvas.context.drawImage(img, pt.x - offsetX, pt.y - offsetY, width / res, height / res);
		}
		if(geometry.useUrl) {
			geometry.useUrl = false;
			geometry.image = img;
		}
		canvas.setCanvasStyle("reset");
	}
	
	function imageErro() {
	
	}
}

//针对圆的绘制方法。
Canvas.prototype.drawCircle = function(geometry, style, id){
    var radius = geometry.radius
    var twoPi = Math.PI*2;
    var pt = this.getLocalXY(geometry);
    //填充
    if(style.fill) {
        this.setCanvasStyle("fill", style);
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius / this.layer.res, 0, twoPi, true);
        this.context.fill();
    }
    //描边
    if(style.stroke) {
        this.setCanvasStyle("stroke", style)
        this.context.beginPath();
        this.context.arc(pt.x, pt.y, radius / this.layer.res, 0, twoPi, true);
        this.context.stroke();
    }
    this.setCanvasStyle("reset");
}

//设置canvas的样式。
Canvas.prototype.setCanvasStyle = function(type, style) {
    if (type === "fill") {     
        this.context.globalAlpha = style['fillOpacity'];
        this.context.fillStyle = style['fillColor'];
    } else if (type === "stroke") {  
        this.context.globalAlpha = style['strokeOpacity'];
        this.context.strokeStyle = style['strokeColor'];
        this.context.lineWidth = style['strokeWidth'];
    } else {
        this.context.globalAlpha = 1;
        this.context.lineWidth = 1;
    }
}

//获得一个点的屏幕显示位置。
Canvas.prototype.getLocalXY = function(point) {
    var resolution = this.layer.getRes();
    var extent = this.layer.bounds;
    var x = (point.x / resolution + (-extent.left / resolution));
    var y = ((extent.top / resolution) - point.y / resolution);
    return {x: x, y: y};
}