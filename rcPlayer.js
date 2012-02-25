var RC = RC || {};

RC.Player = function() {
    RC.RacerAccelStateEnum = {
        ACCEL : { value : 0, name : "accel" },
        DRIFT : { value : 1, name : "drift" },
        BRAKE : { value : 2, name : "brake" }
    };
    RC.RacerTurnStateEnum = {
        LEFT : { value : 1, name : "left" },
        NOTURN : { value : 0, name : "noturn" },
        RIGHT : { value : -1, name : "right" }
    };

    this.MAX_SPEED = 200;
    this.ACCEL_FORCE = 150;
    this.DRAG_FORCE = 50;
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
        var printChange = false;

        // get acceleration and turning states from keyboard        
        if(RC.keyboard.pressed("up")) {
            this.accelState = RC.RacerAccelStateEnum.ACCEL;
        } else if(RC.keyboard.pressed("down")) {
            this.accelState = RC.RacerAccelStateEnum.BRAKE;
        } else if(RC.keyboard.pressed("space")) {
            RC.player.momentum.set(0, 0, 0);
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
            RC.physics.applyForce(this, this.ACCEL_FORCE);
            RC.physics.clampMomentum(this, this.MAX_SPEED);
            printChange = true;
            break;
        case RC.RacerAccelStateEnum.BRAKE:
            RC.physics.applyForce(this, -this.ACCEL_FORCE);
            RC.physics.clampMomentum(this, this.MAX_SPEED / 2);
            printChange = true;
            break;
        case RC.RacerAccelStateEnum.DRIFT:
            //this.momentum.x -= -Math.sin(this.rotation.y) * this.DRAG_FORCE * elapsed;
            //this.momentum.z -= -Math.cos(this.rotation.y) * this.DRAG_FORCE * elapsed;
            //printChange = true;
            //if(this.momentum.length() < 0.0) {
            //    printChange = false;
            //    this.speed = 0.0;
            //}
            break;
        }

        // check for end zone flip
        //if(RC.track.inEndZone(this.position)) {
        //    this.angle += Math.PI;
        //}

        if(printChange) {
            x = this.position.x;
            y = this.position.y;
            z = this.position.z;
            RC.log("speed=" + this.momentum.length() + ", pos=(" + x + ", " + y + ", " + z + ")");
        }
    };
};
