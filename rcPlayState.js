var RC = RC || {};

RC.PlayState = function() {
    RC.PlayStateEnum = {
        WAITING : { value : 0, name : "waiting" },
        COUNTDOWN : { value : 1, name : "countdown" },
        RACING : { value : 2, name : "racing" }
    };
    var state = RC.PlayStateEnum.WAITING;
    this.COUNTDOWN_TIME = 3; // seconds
    var accumTime = 0;

    // create div to cover canvas, make it the background clear color,
    // and fade it out to transparent
    var bgColor = RC.renderer.getClearColor();
    var rgbString = "rgb(" + 
        (bgColor.r * 255).toFixed(0) + "," + 
        (bgColor.g * 255).toFixed(0) + "," + 
        (bgColor.b * 255).toFixed(0) + ")";
    $("#canvas-container").append("<div id='tmp-cover'></div>");
    $("#tmp-cover").css({
        "position" : "absolute",
        "margin": "2px",
        "left": "0",
        "top": "0",
        "width": RC.WIDTH.toString(),
        "height": RC.HEIGHT.toString(),
        "background-color": rgbString
    });
    $("#tmp-cover").show();
    $("#tmp-cover").fadeOut(3000, function() {
        RC.log("activating count down");
        state = RC.PlayStateEnum.COUNTDOWN;
        timer.show();
    });

    var timer = $("#game-timer");
    timer.text(this.COUNTDOWN_TIME.toFixed(2));
    var track = new RC.Track();

    RC.camera.position.set(0, 10, 0);
    RC.camera.rotation.y = Math.PI;

    this.update = function(elapsed) {
        switch(state) {
        case RC.PlayStateEnum.COUNTDOWN:
            this.updateCountdown(elapsed);
            break;
        case RC.PlayStateEnum.RACING:
            this.updateRace(elapsed);
            break;
        }
    };

    this.updateCountdown = function(elapsed) {
        accumTime += elapsed;
        var remaining = this.COUNTDOWN_TIME - accumTime;
        if(remaining > 0.0) {
            timer.text(remaining.toFixed(2));
        } else {
            timer.text("0.00");
            accumTime = 0.0;
            RC.player = new RC.Player();
            RC.log("activating race");
            state = RC.PlayStateEnum.RACING;
        }
    }

    this.updateRace = function(elapsed) {
        accumTime += elapsed;
        timer.text(accumTime.toFixed(2));

        RC.player.update(elapsed);
        RC.physics.update(elapsed);
        RC.camera.position.x = RC.player.position.x;
        RC.camera.position.z = RC.player.position.z;
        RC.camera.rotation.y = RC.player.rotation.y;
    }
}
