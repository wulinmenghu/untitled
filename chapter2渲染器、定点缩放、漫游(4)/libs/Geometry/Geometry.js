function Geometry(){
    this.id = CanvasSketch.getId("geomtry_");
}

//bounds���Զ����˵�ǰGeometry��Ӿ��η�Χ��
Geometry.prototype.bounds = null;

//����Geometry��id���ԡ�
Geometry.prototype.id = null;

//�����bounds�����¡�ķ���
Geometry.prototype.clone = function () {
    return new Geometry();
}

//���ٵ�ǰ��Geometry
Geometry.prototype.destroy = function () {
    this.bounds = null;
    this.id = null;
}