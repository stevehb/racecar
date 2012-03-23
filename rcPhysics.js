var RC = RC || {};

RC.Physics = function() {
    this.objList = new Array();
    this.hotcubeCallbacks = new Array();

    this.makePhysical = function(obj) {
        obj.momentum = new THREE.Vector3(0, 0, 0);
        obj.position = new THREE.Vector3(0, 0, 0);
        obj.rotation = new THREE.Vector3(0, 0, 0);
        obj.accumForce = new THREE.Vector3(0, 0, 0);  
        obj.friction = 0.0;
        obj.moveable = true;
    };

    this.addObject = function(obj) {
        //RC.log("adding object to physics");
        this.objList.push(obj);
    };

    this.addForce = function(obj, forceScalar) {
        // add forceScalar to accumForce
        obj.accumForce.x += -Math.sin(obj.rotation.y) * forceScalar;
        obj.accumForce.z += -Math.cos(obj.rotation.y) * forceScalar;
    };

    this.dampenMomentum = function(obj, scalar) {
        obj.momentum.multiplyScalar(scalar);
        if(obj.momentum.length() < 1.0) {
            obj.momentum.set(0.0, 0.0, 0.0);
        }
    };

    this.clampMomentum = function(obj, max) {
        if(obj.momentum.length() > max) {
            obj.momentum.multiplyScalar(max / obj.momentum.length());
        }
    };

    this.rotate = function(obj, rad) {
        // add rotation, clamp value
        obj.rotation.y += rad;
        if(obj.rotation.y > (2 * Math.PI)) { 
            obj.rotation.y -= (2 * Math.PI); 
        } else if(obj.rotation.y < 0.0) { 
            obj.rotation.y += (2 * Math.PI); 
        }

        // preserve momentum according to friction
        var magnitude = obj.momentum.length();
        obj.momentum.multiplyScalar(1.0 - obj.friction);
        obj.momentum.x += -Math.sin(obj.rotation.y) * (magnitude * obj.friction);
        obj.momentum.z += -Math.cos(obj.rotation.y) * (magnitude * obj.friction);
    };

    this.resetRotation = function(obj, rotation) {
        // reset rotation 
        obj.rotation.y = rotation.y;

        // reset momentum
        var magnitude = obj.momentum.length();
        obj.momentum.multiplyScalar(0.0);
        obj.momentum.x = -Math.sin(obj.rotation.y) * magnitude;
        obj.momentum.z = -Math.cos(obj.rotation.y) * magnitude;

        // and accumForce
        magnitude = obj.accumForce.length();
        obj.accumForce.multiplyScalar(0.0);
        obj.accumForce.x = -Math.sin(obj.rotation.y) * magnitude;
        obj.accumForce.z = -Math.cos(obj.rotation.y) * magnitude;
    };

    this.addHotcubeCallback = function(cube, obj, func) {
        RC.log("adding callback for cube " + cube.name);
        this.hotcubeCallbacks.push({
            "cube" : cube,
            "obj" : obj,
            "func" : func
        });
    }

    this.update = function(elapsed) {
        $.each(this.objList, function(idx, obj) {
            // turn accumulated forces into momentum, 
            // then turn momentum into movement
            if(obj.moveable) {
                obj.momentum.x += obj.accumForce.x * elapsed;
                obj.momentum.z += obj.accumForce.z * elapsed;
                obj.position.x += obj.momentum.x * elapsed;
                obj.position.z += obj.momentum.z * elapsed;
                obj.accumForce.set(0, 0, 0);
            }
        });

        // check hotcubes callbacks
        $.each(this.hotcubeCallbacks, function(idx, callback) {
            var cube = callback.cube;
            var obj = callback.obj;
            var pos = obj.position;

            if(pos.x > cube.min.x && pos.x < cube.max.x &&
                pos.y > cube.min.y && pos.y < cube.max.y &&
                pos.z > cube.min.z && pos.z < cube.max.z) {
                callback.func(obj, cube);
            }
        });
    };
};
