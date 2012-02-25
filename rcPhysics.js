var RC = RC || {};

RC.Physics = function() {
    this.objList = new Array();

    this.makePhysical = function(obj) {
        obj.movable = true;
        obj.momentum = new THREE.Vector3(0, 0, 0);
        obj.position = new THREE.Vector3(0, 0, 0);
        obj.rotation = new THREE.Vector3(0, 0, 0);
        obj.accumForce = new THREE.Vector3(0, 0, 0);  
        obj.friction = 0.0;      
    };

    this.addObject = function(obj) {
        RC.log("adding object to physics");
        this.objList.push(obj);
    };

    this.applyForce = function(obj, force) {
        // take force and add it to accumForce
        obj.accumForce.x += -Math.sin(obj.rotation.y) * force;
        obj.accumForce.z += -Math.cos(obj.rotation.y) * force;
    };

    this.clampMomentum = function(obj, max) {
        if(obj.momentum.length() > max) {
            obj.momentum.multiplyScalar(max / obj.momentum.length());
        }
    };

    this.rotate = function(obj, rad) {
        // add rotation, clamp value
        var prevRotation = obj.rotation.clone();
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

    this.update = function(elapsed) {
        // turn accumulated forces into momentum, 
        // turn momentum into movement
        var i, obj;
        for(i = 0; i < this.objList.length; i++) {
            obj = this.objList[i];
            obj.momentum.x += obj.accumForce.x * elapsed;
            obj.momentum.z += obj.accumForce.z * elapsed;
            obj.position.x += obj.momentum.x * elapsed;
            obj.position.z += obj.momentum.z * elapsed;
            obj.accumForce.set(0, 0, 0);
        }
    };
};
