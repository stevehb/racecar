var RC = RC || {};

RC.Racer = function() {
    var geom, material;
    var turnState, accelState;

    this.MAX_SPEED = 175;
    this.ACCEL_FORCE = 175;
    this.DRAG_MULTIPLIER = 0.90;
    this.STOP_MULTIPLIER = 0.90;
    this.TURN_SPEED = Math.PI / 2;

    RC.RacerAccelStateEnum = RC.RacerAccelStateEnum || {
        ACCEL : { value : 0, name : "accel" },
        REVERSE : { value : 1, name : "reverse" },
        STOP : { value : 2, name : "stop"},
        DRIFT : { value : 3, name : "drift" }
    };
    RC.RacerTurnStateEnum = RC.RacerTurnStateEnum || {
        LEFT : { value : 1, name : "left" },
        NOTURN : { value : 0, name : "noturn" },
        RIGHT : { value : -1, name : "right" }
    };

    accelState = RC.RacerAccelStateEnum.ACCEL;
    turnState = RC.RacerTurnStateEnum.NOTURN;
    RC.physics.makePhysical(this);
    this.rotation.y = Math.PI;
    this.position.set(0.0, 1.5, RC.END_ZONE_LENGTH);
    this.friction = 0.10;
    this.boundingRadius = 2.0;
    this.lastEndZone = RC.TrackEndZoneEnum.NEAR;
    this.lapCount = 0;
    RC.physics.addObject(this);

    geom = new THREE.CubeGeometry(4, 4, 4, 2, 2, 2);
    material = new THREE.MeshBasicMaterial({ color : 0xbb4444 });
    this.mesh = new THREE.Mesh(geom, material);
    RC.scene.add(this.mesh);

    this.inEndZone = function(obj, cube) {
        RC.log("racer got end zone trigger (now lap " + obj.lapCount + ")");

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
                RC.log("racer wins!");
                RC.stateStack.push(new RC.EndState("lose"));
                $("#cover").css("background-color", "black");
                $("#cover").show();
                $("#cover").fadeOut("slow");
            }
        }
    };
    RC.physics.addHotcubeCallback(RC.TrackEndZoneEnum.NEAR, this, this.inEndZone);
    RC.physics.addHotcubeCallback(RC.TrackEndZoneEnum.FAR, this, this.inEndZone);

    this.update = function(elapsed) {
        // apply rotations
        switch(turnState) {
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
        switch(accelState) {
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

        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
    };
};
