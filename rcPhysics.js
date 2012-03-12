var RC = RC || {};

RC.Physics = function() {
    this.objList = new Array();
    this.hotspots = new Array();

    this.makePhysical = function(obj) {
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

    this.addHotspot2d = function(rect, callback) {
        this.hotspots.push({ 
            "rect": rect, 
            "callback": callback 
        });
    };

    this.update = function(elapsed) {
        var objRectPos = new THREE.Rectangle();
        $.each(this.objList, function(idx, obj) {
            // turn accumulated forces into momentum, 
            // then turn momentum into movement
            obj.momentum.x += obj.accumForce.x * elapsed;
            obj.momentum.z += obj.accumForce.z * elapsed;
            obj.position.x += obj.momentum.x * elapsed;
            obj.position.z += obj.momentum.z * elapsed;
            obj.accumForce.set(0, 0, 0);

            // trigger hotspots
            $.each(RC.physics.hotspots, function(idx, spot) {
                objRectPos.empty();
                objRectPos.addPoint(obj.position.x, obj.position.z);
                if(spot.rect.intersects(objRectPos)) {
                    RC.log("got a hit!");
                    spot.callback(spot.rect, obj);
                } else {
                    //RC.log("no hit: spot=[" + spot.rect.getLeft() + "," + spot.rect.getTop() + "," + 
                    //        spot.rect.getRight() + "," + spot.rect.getBottom() + "] " +
                    //        "obj=" + objRectPos.getLeft() + "," + objRectPos.getTop() + "," + 
                    //        objRectPos.getRight() + "," + objRectPos.getBottom() + "]");
                }
            });
        });
    };
};
