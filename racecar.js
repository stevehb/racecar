var RC = RC || {};

RC.skyboxVertShader = 
    "void main() {" +
    "}";

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

    RC.keyboard = new THREEx.KeyboardState();
    
    RC.stats = new Stats();
    $("#stats")[0].appendChild(RC.stats.getDomElement());

    RC.log("creating scene");
    RC.scene = new THREE.Scene();
    
    RC.log("creating camera: fov=" + RC.FOV + ", aspect=" + (RC.WIDTH/RC.HEIGHT));
    RC.camera = new THREE.PerspectiveCamera(RC.FOV, RC.WIDTH / RC.HEIGHT, 1, 10000);
    RC.camera.position.set(0, 10, 0);
    RC.camera.rotation.y = Math.PI;
    RC.scene.add(RC.camera);

    RC.log("creating WebGLRenderer");
    RC.renderer = new THREE.WebGLRenderer({ antialias: true, maxLights: RC.NLIGHTS });
    RC.renderer.setClearColorHex(0x223344, 1.0);
    RC.renderer.setSize(RC.WIDTH, RC.HEIGHT);
    $("#canvas-container")[0].appendChild(RC.renderer.domElement);

    $.ajaxSetup({ async : false });
    $.getScript("rcPhysics.js", function() { RC.log("loaded physics"); });
    $.getScript("rcTitleState.js", function() { RC.log("loaded title state"); });
    $.getScript("rcPlayState.js", function() { RC.log("loaded play state"); });
    $.getScript("rcEndState.js", function() { RC.log("loaded end state"); });
    $.getScript("rcTrack.js", function() { RC.log("loaded track"); });
    $.getScript("rcPlayer.js", function() { RC.log("loaded player") });
    //$.getScript("rcRacer.js");
    $.ajaxSetup({ async : true });

    RC.physics = new RC.Physics();
    RC.stateStack = new Array();
    RC.stateStack.push(new RC.TitleState());

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
