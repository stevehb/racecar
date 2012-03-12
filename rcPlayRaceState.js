var RC = RC || {};

RC.PlayRaceState = function() {
    var i;
    var accumTime = 0;

    var timer = $("#game-timer");
    timer.text("0.00");
    
    RC.track = RC.track || new RC.Track();

    RC.camera.position.set(0, 10, 0);
    RC.camera.rotation.y = Math.PI;

    RC.player = new RC.Player();
    RC.racers = new Array(RC.NRACERS);
    RC.racers[0] = RC.player;
    for(i = 1; i < RC.NRACERS; i++) {
        RC.racers[i] = new RC.Racer(i);
    }

    this.update = function(elapsed) {
        accumTime += elapsed;
        timer.text(accumTime.toFixed(2));

        var len = RC.racers.length;
        for(i = 0; i < len; i++) {
            RC.racers[i].update(elapsed);
        }
        RC.physics.update(elapsed);

        RC.camera.position.x = RC.player.position.x;
        RC.camera.position.z = RC.player.position.z;
        RC.camera.rotation.y = RC.player.rotation.y;
    }
};
