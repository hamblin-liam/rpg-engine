function map(settings) {
    this.hashMap = [];
    this.width = settings.width;
    this.height = settings.height;
    this.tileWidth = settings.tileWidth;
    this.tileHeight = settings.tileHeight;
    
    this.rows = this.height / this.tileWidth;
    this.columns = this.width / this.tileHeight;

    this.init = function () {
        for (r = 0; r < this.rows; r++) {
            for (c = 0; c < this.columns; c++) {
                this.hashMap.push({
                    x: c * this.tileWidth,
                    y: r * this.tileHeight,
                    width: this.tileWidth,
                    height: this.tileHeight
                });
            }
        }
    };

    this.init();

}