var RC = RC || {};

RC.Track = function() {
    // create track mesh and add to scene
    this.totalLength = RC.TRACK_LENGTH + (RC.END_ZONE_LENGTH * 2);
    this.geom = new THREE.PlaneGeometry(RC.TRACK_WIDTH, this.totalLength, 10, 10);
    RC.log("created track with w=" + RC.TRACK_WIDTH + ", l=" + this.totalLength);
    this.material = new THREE.MeshLambertMaterial({ color: "0xffffff"});
    this.mesh = new THREE.Mesh(this.geom, this.material);
    this.mesh.rotation.x = (-Math.PI / 2);
    this.mesh.position.z = this.totalLength / 2;
    RC.scene.add(this.mesh);

    // create wireframe blocks and add to scene
    var nBlocks = 100;
    var i, zOffset, leftGeom, righGeom, leftMesh, rightMesh;
    var tmpMat = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    for(i = 0; i < nBlocks; i++) {
        zOffset = RC.END_ZONE_LENGTH + ((i/nBlocks) * RC.TRACK_LENGTH);
        leftGeom = new THREE.CubeGeometry(20, 20, 20, 1, 1, 1);
        leftMesh = new THREE.Mesh(leftGeom, tmpMat);
        leftMesh.position.set(-RC.TRACK_WIDTH/2 - 10, 10, zOffset);
        rightGeom = new THREE.CubeGeometry(20, 20, 20, 1, 1, 1);
        rightMesh = new THREE.Mesh(rightGeom, tmpMat);
        rightMesh.position.set(RC.TRACK_WIDTH/2 + 10, 10, zOffset);

        // TODO: add to physics for collisions
        RC.scene.add(leftMesh);
        RC.scene.add(rightMesh);
    }

    // add lighting
    var progress, tmpColor, light, zCoord;
    for(i = 0; i < RC.NLIGHTS; i++) {
        progress = i / RC.NLIGHTS;
        zCoord = RC.END_ZONE_LENGTH + (progress * RC.TRACK_LENGTH);
        tmpColor = new THREE.Color();
        tmpColor.setRGB(progress, 0.0, 1.0 - progress);
        light = new THREE.SpotLight(tmpColor.getHex());
        light.position.set(0, 30, zCoord);
        RC.scene.add(light);
    }

    // add endzones hotspots to physics
    var ezNear = new THREE.Rectangle(), ezFar = new THREE.Rectangle();
    ezNear.set(0, RC.END_ZONE_LENGTH, RC.TRACK_WIDTH, 0);
    ezFar.set(0, this.totalLength, RC.TRACK_WIDTH, this.totalLength - RC.END_ZONE_LENGTH);
    RC.physics.addHotspot2d(ezNear, this.triggerEndZone);
    RC.physics.addHotspot2d(ezFar, this.triggerEndZone);


    this.triggerEndZone = function(rect, obj) {
        RC.log("obj " + obj + " hit the hotspot [" + rect.getLeft() + "," + rect.getTop() + "," + rect.getRight() + "," + rect.getBottom() + "]");
    };
};
