//ͼ����
function Layer(div) {
    var style = div.style;
    var size = new CanvasSketch.Size(parseInt(style.width), parseInt(style.height));
    this.size = size;
    this.div = div;    
    this.maxBounds = new CanvasSketch.Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.bounds = new CanvasSketch.Bounds(-size.w / 2, -size.h / 2, size.w / 2, size.h / 2);
    this.center = this.bounds.getCenter();
    this.zoom = 100;
    this.getRes();
    this.vectors = {};
    //����ʸ��ͼ�ε��ܸ�����
    this.vectorsCount = 0;
    //����һ����Ⱦ����
    this.renderer = new Canvas(this);
}

//���res����ǰzoom��ÿ���ش���ĵ�λ���ȡ� 
//���統ǰ���ű���Ϊ 200% ��ͨ������õ� resΪ0.5��˵����ǰzoom��ÿ������ֻ��ʾ0.5����λ���ȡ�
Layer.prototype.getRes = function() {
    this.res = 1 / (this.zoom / 100);
    return this.res;
}

Layer.prototype.addVectors = function (vectors) {
    this.renderer.lock = true;
    for(var i = 0, len = vectors.length; i < len; i++) {
        if(i == len-1) {this.renderer.lock = false;}
        this.vectors[vectors[i].id] = vectors[i];
        this.drawVector(vectors[i]);
    }
    this.vectorsCount += vectors.length;
}

Layer.prototype.drawVector = function (vector) {
    var style;
	if(!vector.style) {
        style = new CanvasSketch.defaultStyle();
    } else {
		style = vector.style;
	}
    this.renderer.drawGeometry(vector.geometry, style);
}

Layer.prototype.moveTo = function (zoom, center) {
    this.zoom = zoom;
    if(!center) {
        center = this.center;
    }
    var res = this.getRes();
    var width = this.size.w * res;
    var height = this.size.h * res;
    //��ȡ�µ���ͼ��Χ��
    var bounds = new CanvasSketch.Bounds(center.x - width/2, center.y - height/2, center.x + width/2, center.y + height/2);
    this.bounds = bounds;
    //��¼�Ѿ�����vector�ĸ���
    var index = 0;
    this.renderer.lock = true;
    for(var id in this.vectors){
        index++;
        if(index == this.vectorsCount) {
            this.renderer.lock = false;
        }
        this.drawVector(this.vectors[id]);
    }
}

//ͨ����Ļ�����趨center��
Layer.prototype.setCenterFromPx = function (px) {
    this.center = new CanvasSketch.Position(px.x * this.res + this.maxBounds.left, -px.y * this.res + this.maxBounds.top);
}