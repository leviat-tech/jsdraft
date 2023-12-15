const DatabaseObject = require('dxf-writer/src/DatabaseObject');


class Viewport extends DatabaseObject {
  constructor(name, height, centreX, centreY) {
    super(['AcDbSymbolTableRecord', 'AcDbViewportTableRecord']);
    this.name = name;
    this.height = height;
    this.centreX = centreX;
    this.centreY = centreY;
  }

  tags(manager) {
    manager.push(0, 'VPORT');
    super.tags(manager);
    manager.push(2, this.name);
    manager.push(40, this.height);
    manager.push(12, this.centreX);
    manager.push(22, this.centreY);
    /* No flags set */
    manager.push(70, 0);
  }
}

module.exports = Viewport;
