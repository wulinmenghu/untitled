//CLASS:����ƽ�ơ�
function Pan(layer) {
    this.layer = layer;
    this.div = layer.div;
    this.active();
    this.dragging = false;
}

Pan.prototype.startPan = function(e) {
    this.dragging = true;
    //��һ��ʼ��������λ�á�
    this.lastX = (e.offsetX || e.layerX);
    this.lastY = (e.offsetY || e.layerY);
    //���������ʽ��
    this.layer.div.style.cursor = "move";
    CanvasSketch.stopEventBubble(e);
}

Pan.prototype.pan = function(e) {
    if(this.dragging) {
        var layer = this.layer;
        //����ı������ֵ
        var dx = (e.offsetX || e.layerX) - this.lastX;
        var dy = (e.offsetY || e.layerY) - this.lastY;
        this.lastX = (e.offsetX || e.layerX);
        this.lastY = (e.offsetY || e.layerY);
        layer.center.x -= dx * layer.res;
        layer.center.y += dy * layer.res;
        layer.moveTo(layer.zoom, layer.center);
    }
    CanvasSketch.stopEventBubble(e);
}

Pan.prototype.endPan = function(e) {
    this.layer.div.style.cursor = "default";
    this.dragging = false;
    CanvasSketch.stopEventBubble(e);
}

Pan.prototype.Events = [["mousedown", Pan.prototype.startPan],
                        ["mousemove", Pan.prototype.pan],
                        ["mouseup", Pan.prototype.endPan]];

                        
Pan.prototype.active = function () {
    for(var i = 0, len = this.Events.length; i < len; i++) {
        var type = this.Events[i][0];
        var listener = this.Events[i][1];
        listener = CanvasSketch.bindAsEventListener(listener, this);
        this.div.addEventListener(type, listener, true);        
    }
}                