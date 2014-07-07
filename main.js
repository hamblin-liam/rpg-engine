var canvas, ctx, level1, tiled_data, resourcesLoaded = false;


function main() {

    canvas = document.createElement("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");

    init();


}

function init() {
    tiled_data = new tiled({
        filename: "map.json"
    }, function (layer) {
        level1 = new map({
            width: layer.width * layer.tilewidth,
            height: layer.height * layer.tileheight,
            tileWidth: layer.tilewidth,
            tileHeight: layer.tileheight
        });
        runner();
    });


}

function runner() {
    var loop = function () {
        render();
        update();
        draw();
        window.requestAnimationFrame(loop, ctx);
    };
    if (resourcesLoaded) {
        window.requestAnimationFrame(loop, ctx);
    } else {
        setTimeout(function () {
            runner();
        }, 1);
    }

}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tiled_data.render(ctx, level1.hashMap);

}



function update() {}

function draw() {}

main();