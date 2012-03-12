var RC = RC || {};

RC.PlayCountdownState = function() {
    RC.PlayStateEnum = {
        FADEIN : { value : 0, name : "fade in" },
        COUNTDOWN : { value : 1, name : "countdown" },
    };
    var state = RC.PlayStateEnum.FADEIN;
    this.COUNTDOWN_TIME = 3; // seconds

    // set up timer, ready to countdown
    var accumTime = 0;
    var timer = $("#game-timer");
    timer.text(this.COUNTDOWN_TIME.toFixed(2));

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
    $("#tmp-cover").fadeOut(3000, "linear", function() {
        RC.log("activating count down");
        state = RC.PlayStateEnum.COUNTDOWN;
        timer.show();
        $("#canvas-container").remove("#tmp-cover");
    });

    // track & camera
    RC.track = new RC.Track();
    RC.camera.position.set(0, 10, 0);
    RC.camera.rotation.y = Math.PI;

    this.update = function(elapsed) {
        if(state === RC.PlayStateEnum.COUNTDOWN) {
            accumTime += elapsed;
            var remaining = this.COUNTDOWN_TIME - accumTime;
            if(remaining > 0.0) {
                timer.text(remaining.toFixed(2));
            } else {
                timer.text("0.00");
                RC.log("activating race");
                RC.stateStack.pop();
                RC.stateStack.push(new RC.PlayRaceState());
            }
        }
    }
};
