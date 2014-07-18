var canvas, ctx, level1, level2, tiled_data, keystate, resourcesLoaded = false, dopan = false;


function main() {

    canvas = document.createElement("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.innerText = "Canvas is not supported in your browser!";
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
    //ctx.scale(1.5,1.5);

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
        camera();
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
    var camera = tiled_data.camera.getOffset();
    ctx.clearRect(0 + camera.xOffset , 0 + camera.yOffset, canvas.width, canvas.height);
    tiled_data.render(ctx);
    

}
function camera(){
    if(dopan){
         tiled_data.camera.move();
    }
   
}

function update() {}

function draw() {}

main();