function tiled(settings, callback) {
    this.file = settings.filename;
    this.layer;
    this.tileRange = {};
    this.tileSets = {};
    this.highlight = false;
    this.lineWidth = 2;
    this.grid = false;
    this.map;
    this.mouse = {
        x: 0,
        y: 0
    };
    this.now;
    this.fps = 0;
    this.lastUpdate = (new Date) * 1;
    this.fpsFilter = 50;
    this.currentFPS = "0.0fps";
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
            if (callback !== undefined) {
                callback(true);
            }

        });

    };

    this.render = function (canvas) {
        var camera = this.camera.getOffset();
        var map_data = this.map.hashMap;
        for (t = 0; t < this.layer.layers.length; t++) {
            var layer = this.layer.layers[t];
            if (layer.type == "tilelayer") {
                for (i = 0; i < map_data.length; i++) {
                    var tile = map_data[i];

                    if (layer.data[i] != 0) {
                        var blockdata = layer.data[i];
                        //canvas.fillRect(tile.x , tile.y, 32, 32);
                        var key = this.getSpritePack(blockdata);
                        var metaId = Math.abs(key - blockdata);
                        try {
                            if (tile.x + this.layer.tilewidth > camera.xOffset && tile.x < window.innerWidth + camera.xOffset && tile.y + this.layer.tileheight > camera.yOffset && tile.y < window.innerHeight + camera.yOffset) {
                                this.tileSets[this.tileRange[key]][metaId].draw(ctx, tile.x, tile.y);
                            }

                        } catch (error) {
                            ctx.font = '20pt Calibri';
                            ctx.fillStyle = 'red';
                            ctx.fillText("Rendering", 10, 70);
                        }

                    }
                }
            } else if (layer.type == "objectgroup") {
                voidlayer = layer;
                for (i = 0; i < layer.objects.length; i++) {
                    if (layer.objects[i].name != "" && layer.objects[i].properties.onhover) {
                        if (this.mouse.x >= layer.objects[i].x && this.mouse.y >= layer.objects[i].y && this.mouse.x <= layer.objects[i].x + layer.objects[i].width && this.mouse.y <= layer.objects[i].y + layer.objects[i].height) {
                            ctx.save();
                            ctx.font = layer.objects[i].properties.font ? layer.objects[i].properties.font : "15pt Calibri";
                            ctx.fillStyle = layer.objects[i].properties.fontColour ? layer.objects[i].properties.fontColour : "black";
                            ctx.textAlign = "center";
                            ctx.fillText(layer.objects[i].name, layer.objects[i].x + (layer.objects[i].width / 2), layer.objects[i].y - 2);
                            ctx.restore();
                        }
                    }
                    if (layer.objects[i].polyline || layer.objects[i].polygon) {
                        var object;
                        if (layer.objects[i].polygon) {
                            object = layer.objects[i].polygon;
                            object.push({
                                x: 0,
                                y: 0
                            });
                        } else {
                            object = layer.objects[i].polyline;
                        }

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

                    } else if (layer.objects[i].ellipse) {
                        if (this.highlight) {

                            ctx.beginPath();
                            var radius = 15;
                            ctx.arc(layer.objects[i].x + (layer.objects[i].width / 2), layer.objects[i].y + (layer.objects[i].height / 2), radius, 0, 2 * Math.PI, false);
                            ctx.lineWidth = 5;
                            ctx.strokeStyle = 'rgba(67, 205, 128, 0.8)';
                            ctx.stroke();


                        }

                    } else {
                        if (this.highlight) {
                            ctx.save();
                            ctx.fillStyle = "rgba(220, 20, 60, 0.8)";
                            ctx.fillRect(layer.objects[i].x, layer.objects[i].y, layer.objects[i].width, layer.objects[i].height);
                            ctx.restore();
                        }

                    }

                }
            }




        }
        if (this.grid) {
            for (i = 0; i < map_data.length; i++) {
                var tile = map_data[i];
                ctx.beginPath();
                ctx.rect(tile.x, tile.y, tile.width, tile.height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }
        }

        var message = 'Mouse position: ' + this.mouse.x + ',' + this.mouse.y;
        var camera = this.camera.getOffset();
        ctx.font = '20pt Calibri';
        ctx.fillStyle = 'black';
        ctx.fillText(message, 10 + camera.xOffset, 25 + camera.yOffset);
        ctx.fillText(this.currentFPS, 10 + camera.xOffset, 50 + camera.yOffset);

        this.selector.draw(thisClass);
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
    this.logic = function () {
        if (keystate[72]) {
            delete keystate[72];
            if (this.highlight) {
                this.highlight = false;
            } else {
                this.highlight = true;
            }
        }
        if (keystate[71]) {
            delete keystate[71];
            if (this.grid) {
                this.lineWidth = 2;
                this.grid = false;
            } else {
                this.lineWidth = 5;
                this.grid = true;
            }
        }
          if (keystate[80]) {
            delete keystate[80];
            dopan = true;
        }

        var thisFrameFPS = 1000 / ((this.now = new Date) - this.lastUpdate);
        if (this.now != this.lastUpdate) {
            this.fps += (thisFrameFPS - this.fps) / this.fpsFilter;
            this.lastUpdate = this.now;
        }
    };
    this.setMap = function (map, callback) {
        this.tileRange = {};
        //this.tileSets = {};
        this.file = map;
        this.read();
        if (callback !== undefined) {
            callback(true);
        }
    };

    this.selector = {
        colour: "rgba(0, 255, 127, 0.6)",
        draw: function (tiled_data) {
            if (tiled_data !== undefined && tiled_data.map !== undefined) {
                for (m = 0; m < tiled_data.map.hashMap.length; m++) {
                    var tile = tiled_data.map.hashMap[m];
                    if (tiled_data.mouse.x >= tile.x && tiled_data.mouse.y >= tile.y && tiled_data.mouse.x <= tile.x + tiled_data.layer.tilewidth && tiled_data.mouse.y <= tile.y + tiled_data.layer.tileheight) {
                        ctx.save()
                        ctx.fillStyle = this.colour;
                        ctx.fillRect(tile.x, tile.y, tiled_data.layer.tilewidth, tiled_data.layer.tileheight);
                        ctx.restore();
                    }
                }
            }

        },

        setColour: function (colour) {
            this.colour = colour;
        }
    };

    this.camera = {
        x: 0,
        y: 0,
        tiled: this,
        max: 0,
        speed: 8,
        move: function () {
            this.max =  this.getCamera().objects[0].polyline[1].x - (window.innerWidth/2);

            if (this.x < this.max) {
                this.x += this.speed;
            
                //this.y += this.speed;
                ctx.translate(-this.speed, 0);
            }

        },

        getOffset: function () {
            return {
                xOffset: this.x,
                yOffset: this.y
            };
        },

        getCamera: function (){
            //console.log(this.tiled);
            for(c = 0; c < this.tiled.layer.layers.length; c++){
                if(this.tiled.layer.layers[c].name == "camera"){
                    return this.tiled.layer.layers[c];
                }
            }
        }
    };

    var thisClass = this;
    canvas.addEventListener('mousemove', function (evt) {
        thisClass.selector.draw(thisClass);
        var rect = canvas.getBoundingClientRect();
        var canvasOffset = thisClass.camera.getOffset();
        thisClass.mouse = {
            x: evt.clientX - rect.left + canvasOffset.xOffset,
            y: evt.clientY - rect.top + canvasOffset.yOffset
        };
    }, false);
    /*canvas.addEventListener('mousedown', function (evt) {
        var rect = canvas.getBoundingClientRect();
        thisClass.mouse = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }, false);*/
    setInterval(function () {
        thisClass.currentFPS = thisClass.fps.toFixed(1) + "fps";
    }, 1000);

    this.read();
}