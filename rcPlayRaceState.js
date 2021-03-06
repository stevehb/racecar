var RC = RC || {};

RC.PlayRaceState = function() {
    var accumTime = 0, timer;
    var i;

    timer = $("#game-timer");
    timer.text("0.00");
    
    RC.track = RC.track || new RC.Track();
    RC.player = RC.player || new RC.Player();
    if(RC.racers.length !== RC.NRACERS) {
        RC.racers.length = RC.NRACERS;
        RC.racers[0] = RC.player;
        for(i = 1; i < RC.NRACERS; i++) {
            RC.racers[i] = new RC.Racer();
        }
    }
    $.each(RC.racers, function(idx, racer) {
        racer.position.x = (idx * RC.RACER_WIDTH) + (RC.RACER_WIDTH / 2);
        racer.position.x -= (RC.TRACK_WIDTH / 2);
        racer.mesh.position.x = racer.position.x;
    });

    $("#cover").css({
        "background-color": "rgb(255, 255, 255)"
    });

    RC.camera.position.copy(RC.player.position);
    RC.camera.rotation.copy(RC.player.rotation);

    this.update = function(elapsed) {
        accumTime += elapsed;
        timer.text(accumTime.toFixed(2));

        var len = RC.racers.length;
        for(i = 0; i < len; i++) {
            RC.racers[i].update(elapsed);
        }
        RC.physics.update(elapsed);

        RC.camera.position.copy(RC.player.position);
        RC.camera.rotation.copy(RC.player.rotation);

        RC.debug(1, " pos: [" + RC.player.position.x.toFixed(2) + "," +
            RC.player.position.y.toFixed(2) + "," + 
            RC.player.position.z.toFixed(2) + "]");
        RC.debug(2, " rotation=[" + RC.player.rotation.x.toFixed(2) + "," +
            RC.player.rotation.y.toFixed(2) + ", " + 
            RC.player.rotation.z.toFixed(2) + "]");
        RC.debug(3, " momentum=[" + RC.player.momentum.x.toFixed(2) + "," +
            RC.player.momentum.y.toFixed(2) + ", " + 
            RC.player.momentum.z.toFixed(2) + "]");
    }
};
