function spriteSheet(img, tileset, tiled_class){
	this.tiles = [];
	for(r = 0; r < tileset.imageheight / tileset.tileheight; r++){
		for(c = 0; c < tileset.imagewidth / tileset.tilewidth; c++){
			this.tiles.push(new Sprite(img, c*tileset.tilewidth, r*tileset.tileheight, tileset.tilewidth, tileset.tileheight));
		}
	}
	tiled_class.tileSets[tileset.name] = this.tiles;
}
function Sprite(img, x, y, width, height) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}
Sprite.prototype.draw = function(canvas, x, y) {
	canvas.drawImage(this.img,this.x, this.y,this.width,this.height,x,y,this.width,this.height);
};
