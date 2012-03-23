var RC = RC || {};

RC.Player = function() {
    RC.RacerAccelStateEnum = {
        ACCEL : { value : 0, name : "accel" },
        REVERSE : { value : 1, name : "reverse" },
        STOP : { value : 2, name : "stop"},
        DRIFT : { value : 3, name : "drift" }
    };
    RC.RacerTurnStateEnum = {
        LEFT : { value : 1, name : "left" },
        NOTURN : { value : 0, name : "noturn" },
        RIGHT : { value : -1, name : "right" }
    };

    this.MAX_SPEED = 200;
    this.ACCEL_FORCE = 150;
    this.DRAG_MULTIPLIER = 0.98;
    this.STOP_MULTIPLIER = 0.90;
    this.TURN_SPEED = Math.PI / 2;
    this.accelState = RC.RacerAccelStateEnum.DRIFT;
    this.turnState = RC.RacerTurnStateEnum.NOTURN;
    RC.physics.makePhysical(this);
    RC.physics.addObject(this);
    this.rotation.y = Math.PI;
    this.position.set(0.0, 1.5, RC.END_ZONE_LENGTH);
    this.friction = 0.10;

    this.lastEndZone = RC.TrackEndZoneEnum.NEAR;
    this.lapCount = 0;

    this.inEndZone = function(obj, cube) {
        RC.log("player got end zone trigger (now lap " + obj.lapCount + ")");
        RC.physics.resetRotation(obj, cube.resetVector);
        if(cube.name === RC.TrackEndZoneEnum.NEAR.name) {
            obj.position.z = RC.END_ZONE_LENGTH + 1;
        } else if(cube.name === RC.TrackEndZoneEnum.FAR.name) {
            obj.position.z = (RC.TRACK_LENGTH + RC.END_ZONE_LENGTH) - 1;
        }
        if(obj.lastEndZone !== cube) {
            obj.lastEndZone = cube;
            obj.lapCount++;
            if(obj.lapCount >= RC.NLAPS) {
                RC.log("player wins!");
                // should probably push new EndState("win") here
            }
        }
    };
    RC.physics.addHotcubeCallback(RC.TrackEndZoneEnum.NEAR, this, this.inEndZone);
    RC.physics.addHotcubeCallback(RC.TrackEndZoneEnum.FAR, this, this.inEndZone);

    this.update = function(elapsed) {
        // get acceleration and turning states from keyboard        
        if(RC.keyboard.pressed("up")) {
            this.accelState = RC.RacerAccelStateEnum.ACCEL;
        } else if(RC.keyboard.pressed("down")) {
            this.accelState = RC.RacerAccelStateEnum.REVERSE;
        } else if(RC.keyboard.pressed("space")) {
            this.accelState = RC.RacerAccelStateEnum.STOP;
        } else {
            this.accelState = RC.RacerAccelStateEnum.DRIFT;
        }
        if(RC.keyboard.pressed("left")) {
            this.turnState = RC.RacerTurnStateEnum.LEFT;
        } else if(RC.keyboard.pressed("right")) {
            this.turnState = RC.RacerTurnStateEnum.RIGHT;
        } else {
            this.turnState = RC.RacerTurnStateEnum.NOTURN;
        }

        // apply rotations
        switch(this.turnState) {
        case RC.RacerTurnStateEnum.LEFT:
            RC.physics.rotate(this, this.TURN_SPEED * elapsed);
            break;
        case RC.RacerTurnStateEnum.RIGHT:
            RC.physics.rotate(this, -this.TURN_SPEED * elapsed);
            break;
        case RC.RacerTurnStateEnum.NOTURN:
            break;
        }
        
        // apply accel/decel/drift
        switch(this.accelState) {
        case RC.RacerAccelStateEnum.ACCEL:
            RC.physics.addForce(this, this.ACCEL_FORCE);
            RC.physics.clampMomentum(this, this.MAX_SPEED);
            break;
        case RC.RacerAccelStateEnum.REVERSE:
            RC.physics.addForce(this, -this.ACCEL_FORCE);
            RC.physics.clampMomentum(this, this.MAX_SPEED / 2);
            break;
        case RC.RacerAccelStateEnum.STOP:
            RC.physics.dampenMomentum(this, this.STOP_MULTIPLIER);
            break;
        case RC.RacerAccelStateEnum.DRIFT:
            RC.physics.dampenMomentum(this, this.DRAG_MULTIPLIER);
            break;
        }
    };
};
