var RC = RC || {};

function init() {
    RC.FOV = 75;
    RC.WIDTH = 854;
    RC.HEIGHT = 480;
    RC.NRACERS = 5;
    RC.RACER_WIDTH = 30;
    RC.TRACK_LENGTH = 1000;
    RC.TRACK_WIDTH = RC.NRACERS * RC.RACER_WIDTH;
    RC.END_ZONE_LENGTH = 50;
    RC.NLIGHTS = 5;
    RC.NLAPS = 5;

    // init keyboard extension
    RC.keyboard = new THREEx.KeyboardState();
    
    // stats counter
    RC.stats = new Stats();
    $("#stats")[0].appendChild(RC.stats.getDomElement());

    // three.js scene, camera, and renderer
    RC.scene = new THREE.Scene();
    RC.log("creating camera: fov=" + RC.FOV + ", aspect=" + (RC.WIDTH/RC.HEIGHT));
    RC.camera = new THREE.PerspectiveCamera(RC.FOV, RC.WIDTH / RC.HEIGHT, 1, 10000);
    RC.camera.position.set(0, 1.5, 0);
    RC.camera.rotation.y = Math.PI;
    RC.scene.add(RC.camera);
    RC.renderer = new THREE.WebGLRenderer({ antialias: true, maxLights: RC.NLIGHTS });
    RC.renderer.setClearColorHex(0x223344, 1.0);
    RC.renderer.setSize(RC.WIDTH, RC.HEIGHT);
    $("#canvas-container")[0].appendChild(RC.renderer.domElement);

    // create the title state, and start the updates
    RC.physics = new RC.Physics();
    RC.stateStack = new Array();
    RC.stateStack.push(new RC.TitleState());

    // set up  debug line
    $(".debug").css({
        "top": RC.HEIGHT + 10
    });

    RC.lastTime = new Date();
    RC.update();
}

RC.update = function() {
    var thisTime = new Date();
    var elapsed = (thisTime - RC.lastTime) / 1000;
    RC.lastTime = thisTime;
    
    var nStates = RC.stateStack.length;
    if(nStates > 0) {
        RC.stateStack[nStates-1].update(elapsed);
        RC.renderer.render(RC.scene, RC.camera);
        requestAnimationFrame(RC.update);
    } else {
        RC.log("ERROR: no more states :(");
    }
    RC.stats.update();
};

RC.log = function(msg) {
    console.log("RC: " + msg);
};

RC.debug = (function() {
    var info = ["", "", "", ""];

    return function(pos, msg) {
        info[pos] = msg;
        $("#debug").text(info[1] + " " + info[2] + " " + info[3])
    };
}());
