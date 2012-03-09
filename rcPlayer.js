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
    RC.log("making physical with RC.physics=" + RC.physics);
    RC.physics.makePhysical(this);
    RC.physics.addObject(this);
    this.rotation.y = Math.PI;
    this.position.set(0.0, 5.0, RC.END_ZONE_LENGTH);
    this.friction = 0.10;

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

        // check for end zone flip
        //if(RC.track.inEndZone(this.position)) {
        //    this.rotation.y += Math.PI;
        //}
    };
};
