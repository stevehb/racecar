var RC = RC || {};

RC.EndState = function(type) {
    var x, y, z, camLookAt, camDestPos, camTween;
    var camTweenFinished = false, camTweenFinishTime;
    var fogDest, fogTween;
    var endingDiv;
    var accumTime = 0;
    var WINNING = "WIN";
    var playerWins = (type.toUpperCase().localeCompare(WINNING) === 0);

    endingDiv = $("#ending");
    endingDiv.hide();
    if(playerWins) {
        endingDiv.text("WINNING!");
        RC.log(type.toUpperCase() + "===" + WINNING);
    } else {
        endingDiv.text("You Lose!");
        RC.log(type.toUpperCase() + "!==" + WINNING);
    }

    endingDiv.css({
        "font-family" : "Helvetica,sans-serif",
        "font-size" : 72,
        "color" : "white"
    });
    endingDiv.center();
    endingDiv.fadeIn("slow");

    // set up camera swing
    x = RC.TRACK_WIDTH * 2;
    y = 40;
    z = (RC.TRACK_LENGTH + (2 * RC.END_ZONE_LENGTH)) / 2;
    camDestPos = new THREE.Vector3(x, y, z);
    camTween = new TWEEN.Tween(RC.camera.position).to(camDestPos, 10000);
    camTween.easing(TWEEN.Easing.Quadratic.EaseInOut);
    camTween.onComplete(function() {
        camTweenFinished = true;
        camTweenFinishTime = accumTime;
    });
    camTween.start();
    camLookAt = new THREE.Vector3(0, 0, z);

    // and fade in the fog
    fogDest = { density : 0.0 };
    fogTween = new TWEEN.Tween(RC.scene.fog).to(fogDest, 10000);
    fogTween.easing(TWEEN.Easing.Quintic.EaseOut);
    fogTween.start();

    this.update = function(elapsed) {
        var rgb;

        // move camera
        if(!camTweenFinished) {
            TWEEN.update();
        } else {
            rgb = Math.abs(Math.round(Math.cos(accumTime-camTweenFinishTime) * 255));
            endingDiv.css({
                "color" : "rgb(" + rgb + "," + rgb + "," + rgb + ")"
            });
        }
        RC.camera.lookAt(camLookAt);
        accumTime += elapsed;
        RC.debug(1, " pos: [" + RC.camera.position.x.toFixed(2) + "," +
            RC.camera.position.y.toFixed(2) + "," +
            RC.camera.position.z.toFixed(2) + "]");
        RC.debug(2, " rotation=[" + RC.camera.rotation.x.toFixed(2) + "," +
            RC.camera.rotation.y.toFixed(2) + ", " +
            RC.camera.rotation.z.toFixed(2) + "]");
        RC.debug(3, "rgb=" + rgb);
    };
};
