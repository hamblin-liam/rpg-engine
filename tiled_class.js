function tiled(settings, callback){
	this.file = settings.filename;
	this.layer;
	this.tileRange = {};
	this.tileSets = {};

	this.read = function(){
		var thisClass = this;
 		ajax("GET", this.file, "", function(result){
			callback(JSON.parse(result));
 			thisClass.layer = JSON.parse(result); 
 			thisClass.loadTilePacks();
 			
 		});
 		
	};

	this.render = function(canvas, map_data){

		for(t = 0; t < this.layer.layers.length; t++){
		
			for(i = 0; i < map_data.length; i++){
				var tile = map_data[i];

					if(this.layer.layers[t].data[i] != 0){
						var blockdata = this.layer.layers[t].data[i];
					 	//canvas.fillRect(tile.x , tile.y, 32, 32);
					 	var key  = this.getSpritePack(blockdata);
					 	var metaId = Math.abs(key - blockdata);
					 	this.tileSets[this.tileRange[key]][metaId].draw(ctx, tile.x, tile.y);
					}
			 }
				
			
		}	
	};

	this.getSpritePack = function(blockid){
		var mykey;
		for (var key in this.tileRange) {
	  		if (this.tileRange.hasOwnProperty(key)) {
	  			if( blockid >=  parseInt(key)){
	  				mykey = key;
	  		  	}
			 }
		}
		//console.log(this.tileRange[mykey]);
	   return mykey;
	};

	this.loadTilePacks = function(){
		var localObj = {};
		var tile = {};
		var remaining = this.layer.tilesets.length;
		var thisClass = this;
		for(t = 0; t < this.layer.tilesets.length; t++){
			var tileset = this.layer.tilesets[t];
			this.tileRange[tileset.firstgid] = tileset.name;
			localObj[tileset.name] = tileset.image;
			tile[tileset.name] = tileset;
		}
		this.loadImages(localObj, function(images) {
        	 	for (var key in images) {
        	 		 if (images.hasOwnProperty(key)) {
        	 		 	spriteSheet(images[key], tile[key], thisClass);
        	 		 	resourcesLoaded = true;
        	 		 }
        	 	}
     	});
		
		
	};

	this.loadImages =  function(sources, callback) {
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for(var src in sources) {
          numImages++;
        }
        for(var src in sources) {
          images[src] = new Image();
          images[src].onload = function() {
            if(++loadedImages >= numImages) {
              callback(images);
            }
          };
          images[src].src = sources[src];
        }
     };


	this.read();
}

