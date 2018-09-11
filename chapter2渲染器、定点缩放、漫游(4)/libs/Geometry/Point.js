function Point(x, y) {
    Geometry.apply(this, arguments);
    this.x = x;
    this.y = y;
}

Point.prototype = new Geometry();
//point��ĺ����ꡣ
Point.prototype.x = null;
//point��������ꡣ
Point.prototype.y = null;

//�õ���ķ�Χ��
Point.prototype.getBounds = function () {
    if(!this.bounds) {
        var x = this.x;
        var y = this.y;
        this.bounds = new CanvasSketch.Bounds(x, y, x, y);
        return this.bounds;
    } else {
        return this.bounds;
    }
}

//clone������
Point.prototype.clone = function () {
    return new Point(this.x, this.y);
}

Point.prototype.geoType = "Point";
