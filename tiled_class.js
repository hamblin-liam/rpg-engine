function tiled(settings, callback) {
    this.file = settings.filename;
    this.layer;
    this.tileRange = {};
    this.tileSets = {};
    this.highlight = false;
    this.lineWidth = 2;
    this.grid = false;
    this.map;



    this.read = function () {
        var thisClass = this;
        ajax("GET", this.file, "", function (layer) {
            layer = JSON.parse(layer);
            thisClass.map = new map({
            width: layer.width * layer.tilewidth,
            height: layer.height * layer.tileheight,
            tileWidth: layer.tilewidth,
            tileHeight: layer.tileheight
            });
            thisClass.layer = layer;
            thisClass.loadTilePacks();
            if(callback !== undefined){
                 callback(true);
            }
           

        });

    };

    this.render = function (canvas) {
        var map_data  = this.map.hashMap;
        for (t = 0; t < this.layer.layers.length; t++) {
            var layer = this.layer.layers[t];
            if (layer.type == "tilelayer") {
                for (i = 0; i < map_data.length; i++) {
                    var tile = map_data[i];

                    if (this.layer.layers[t].data[i] != 0) {
                        var blockdata = this.layer.layers[t].data[i];
                        //canvas.fillRect(tile.x , tile.y, 32, 32);
                        var key = this.getSpritePack(blockdata);
                        var metaId = Math.abs(key - blockdata);
                        this.tileSets[this.tileRange[key]][metaId].draw(ctx, tile.x, tile.y);
                    }
                }
            } else if (layer.type == "objectgroup") {
                voidlayer = layer;
                for (i = 0; i < layer.objects.length; i++) {
                    if(layer.objects[i].polyline){
                                var object = layer.objects[i].polyline;
                                var offset = {
                                    x: layer.objects[i].x,
                                    y: layer.objects[i].y
                                };
                                if (this.highlight) {
                                    ctx.beginPath();
                                    ctx.lineWidth = this.lineWidth;
                                    ctx.strokeStyle = "yellow";
                                    for (o = 0; o < object.length; o++) {
                                        if (o == 0) {
                                            ctx.moveTo(object[o].x + offset.x, object[o].y + offset.y);
                                        }
                                        ctx.lineTo(object[o].x + offset.x, object[o].y + offset.y);
                                    }
                                    ctx.stroke();
                                }

                    }else if(layer.objects[i].ellipse){
                        if(this.highlight){
                             ctx.beginPath();
                                var radius = 15;
                                ctx.arc(layer.objects[i].x + (layer.objects[i].width/2), layer.objects[i].y + (layer.objects[i].height/2), radius , 0, 2 * Math.PI, false);
                                ctx.lineWidth = 5;
                                ctx.strokeStyle = 'rgba(67, 205, 128, 0.8)';
                                ctx.stroke();
                        }
                               
                    }else{
                        if(this.highlight){
                                ctx.save();
                                ctx.fillStyle = "rgba(220, 20, 60, 0.8)";
                                ctx.fillRect(layer.objects[i].x, layer.objects[i].y, layer.objects[i].width, layer.objects[i].height);
                                ctx.restore();
                        }
                      
                    }
                  
                }
            }




        }
        if(this.grid){
             for(i = 0; i < map_data.length; i++){
                    var tile = map_data[i];
                    ctx.beginPath();
                    ctx.rect(tile.x, tile.y, tile.width, tile.height);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                }
        }
    };

    this.getSpritePack = function (blockid) {
        var mykey;
        for (var key in this.tileRange) {
            if (this.tileRange.hasOwnProperty(key)) {
                if (blockid >= parseInt(key)) {
                    mykey = key;
                }
            }
        }
        //console.log(this.tileRange[mykey]);
        return mykey;
    };

    this.loadTilePacks = function () {
        var localObj = {};
        var tile = {};
        var remaining = this.layer.tilesets.length;
        var thisClass = this;
        for (t = 0; t < this.layer.tilesets.length; t++) {
            var tileset = this.layer.tilesets[t];
            this.tileRange[tileset.firstgid] = tileset.name;
            localObj[tileset.name] = tileset.image;
            tile[tileset.name] = tileset;
        }
        this.loadImages(localObj, function (images) {
            for (var key in images) {
                if (images.hasOwnProperty(key)) {
                    spriteSheet(images[key], tile[key], thisClass);
                    resourcesLoaded = true;
                }
            }
        });


    };

    this.loadImages = function (sources, callback) {
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for (var src in sources) {
            numImages++;
        }
        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function () {
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
            images[src].src = sources[src];
        }
    };
    this.keys  = function(){
        if(keystate[72]){
            delete keystate[72];
            if(this.highlight){
                this.highlight = false;
            }else{
                this.highlight = true;
            }
        }
        if(keystate[71]){
            delete keystate[71];
            if(this.grid){
                this.grid = false;
            }else{
                this.grid = true;
            }
        }

    };
    this.setMap = function(map, callback){
        this.file = map;
        this.read();
        if(callback !== undefined){
           callback(true); 
        }    
    };  


    this.read();
}