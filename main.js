var canvas, ctx, level1, level2, tiled_data, keystate, resourcesLoaded = false;


function main() {

    canvas = document.createElement("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");

    keystate = {};

    document.addEventListener("keydown", function(evt) {
            keystate = {};
            keystate[evt.keyCode] = true;
    });

    document.addEventListener("keyup", function(evt) {
            delete keystate[evt.keyCode];
    });

    init();


}
function init() {
    tiled_data = new tiled({
        filename: "map.json"
    }, function (hasloaded) {
        if(hasloaded){
             runner();

        }
       
    });


}

function runner() {
    var loop = function () {
        tiled_data.logic();
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
    tiled_data.render(ctx);

}

function update() {}

function draw() {}

main();