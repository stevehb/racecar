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
    RC.stats.getDomElement().style.position = 'absolute';
    RC.stats.getDomElement().style.left = '0px';
    RC.stats.getDomElement().style.top = '0px';
    $("body")[0].appendChild(RC.stats.getDomElement());

    RC.log("creating scene");
    RC.scene = new THREE.Scene();
    
    RC.log("creating camera: fov=" + RC.FOV + ", aspect=" + (RC.WIDTH/RC.HEIGHT));
    RC.camera = new THREE.PerspectiveCamera(RC.FOV, RC.WIDTH / RC.HEIGHT, 1, 10000);
    RC.camera.position.set(0, 10, 0);
    RC.camera.rotation.y = Math.PI;
    RC.scene.add(RC.camera);

    RC.log("creating WebGLRenderer");
    RC.renderer = new THREE.WebGLRenderer({ antialias: true, maxLights: RC.NLIGHTS });
    RC.renderer.setClearColorHex(0x405060, 1.0);
    RC.renderer.setSize(RC.WIDTH, RC.HEIGHT);
    $("#canvas-container")[0].appendChild(RC.renderer.domElement);

    $.ajaxSetup({ async : false });
    $.getScript("rcGameMachine.js", function() { RC.game = new RC.GameMachine(); });
    $.getScript("rcPhysics.js", function() { RC.physics = new RC.Physics(); RC.log("loaded physics=" + RC.physics); });
    $.getScript("rcTrack.js", function() { RC.track = new RC.Track(); });
    $.getScript("rcPlayer.js", function() { RC.player = new RC.Player(); });
    //$.getScript("rcRacer.js");
    $.ajaxSetup({ async : true });
    
    RC.initLights();
    RC.initRacers();

    RC.lastTime = new Date();
    RC.update();
}

RC.initRacers = function() {
    // create RC.NRACERS here, and add updating in main loop  
};

RC.initLights = function() {
    var i, progress, tmpColor, light, zCoord;
    for(i = 0; i < RC.NLIGHTS; i++) {
        progress = i / RC.NLIGHTS;
        zCoord = RC.END_ZONE_LENGTH + (progress * RC.TRACK_LENGTH);
        tmpColor = new THREE.Color();
        tmpColor.setRGB(progress, 0.0, 1.0 - progress);
        light = new THREE.SpotLight(tmpColor.getHex());
        light.position.set(0, 30, zCoord);
        RC.scene.add(light);
        //RC.log("adding light " + i + " at (0, 30, " + zCoord + ")");
    }    
};

RC.update = function() {
    requestAnimationFrame(RC.update);
    var thisTime = new Date();
    var elapsed = (thisTime - RC.lastTime) / 1000;
    RC.lastTime = thisTime;
    
    switch(RC.game.state) {
    case RC.GameStateEnum.TITLE:
        RC.stats.update();
        RC.log("main loop: title state");
        RC.game.update(elapsed);
        break;
    case RC.GameStateEnum.PLAY_COUNT:
        RC.stats.update();
        RC.log("main loop: play_count state");
        RC.game.update(elapsed);
        break;
    case RC.GameStateEnum.PLAY_LIVE:
        RC.stats.update();
        RC.player.update(elapsed);
        RC.physics.update(elapsed);
        RC.game.update(elapsed);
        break;
    case RC.GameStateEnum.WIN:
        RC.stats.update();
        RC.game.update(elapsed);
        break;
    case RC.GameStateEnum.LOSE:
        RC.stats.update();
        RC.game.update(elapsed);
        break;
    };  

    RC.camera.position.x = RC.player.position.x;
    RC.camera.position.z = RC.player.position.z;
    RC.camera.rotation.y = RC.player.rotation.y;

    RC.renderer.render(RC.scene, RC.camera);
};

RC.log = function(msg) {
    console.log("RC: " + msg);
};
