var RC = RC || {};

RC.Track = function() {
    var NTRACK_SEGMENTS = 5;
    var geom, material, segLength, worldRot;
    var totalLength, halfWidth;
    var i, z;

    /* Create main track, minus the end zones. Track is made up of 
     * NTRACK_SEGMENTS segments, starting just past the near end 
     * zone and ending just before the far end zone.
     */
    segLength = RC.TRACK_LENGTH / NTRACK_SEGMENTS;
    material = new THREE.MeshBasicMaterial({ map : RC.textures.roadTexture });
    geom = new THREE.PlaneGeometry(RC.TRACK_WIDTH, segLength, 10, 10);
    worldRot = (-Math.PI / 2);
    for(i = 0; i < NTRACK_SEGMENTS; i++) {
        this.mesh = new THREE.Mesh(geom, material);
        this.mesh.rotation.x = worldRot;
        z = RC.END_ZONE_LENGTH + (i * segLength) + (segLength / 2);
        this.mesh.position.z = z; // geom. this.totalLength / 2;
        RC.scene.add(this.mesh);
    }

    /* Add end zones as walls
     */
    material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    material.opacity = 0.1;
    geom = new THREE.PlaneGeometry(RC.TRACK_WIDTH, 20, 10, 10);
    this.nearEndPlane = new THREE.Mesh(geom, material);
    this.nearEndPlane.position.set(0, 10, RC.END_ZONE_LENGTH);
    RC.scene.add(this.nearEndPlane);
    this.farEndPlane = new THREE.Mesh(geom, material);
    this.farEndPlane.position.set(0, 10, RC.END_ZONE_LENGTH + RC.TRACK_LENGTH);
    this.farEndPlane.flipSided = true;
    RC.scene.add(this.farEndPlane);

    // create end zone 'hotcubes'
    halfWidth = RC.TRACK_WIDTH / 2;
    totalLength = RC.TRACK_LENGTH + (2 * RC.END_ZONE_LENGTH);
    RC.TrackEndZoneEnum = {
        NEAR : { 
            min : new THREE.Vector3(-halfWidth, 0, 0),
            max : new THREE.Vector3(halfWidth, 20, RC.END_ZONE_LENGTH),
            name : "nearEndZone",
            resetVector : new THREE.Vector3(0, Math.PI, 0)
        },
        FAR : { 
            min : new THREE.Vector3(-halfWidth, 0, totalLength - RC.END_ZONE_LENGTH),
            max : new THREE.Vector3(halfWidth, 20, totalLength),
            name : "farEndZone",
            resetVector : new THREE.Vector3(0, 0, 0)
        }
    };

    // create wireframe blocks and add to scene
    var nBlocks = 100;
    var zOffset, leftGeom, righGeom, leftMesh, rightMesh;
    var tmpMat = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    for(i = 0; i < nBlocks; i++) {
        zOffset = RC.END_ZONE_LENGTH + ((i/nBlocks) * RC.TRACK_LENGTH);
        leftGeom = new THREE.CubeGeometry(20, 20, 20, 1, 1, 1);
        leftMesh = new THREE.Mesh(leftGeom, tmpMat);
        leftMesh.position.set(-RC.TRACK_WIDTH/2 - 10, 10, zOffset);
        rightGeom = new THREE.CubeGeometry(20, 20, 20, 1, 1, 1);
        rightMesh = new THREE.Mesh(rightGeom, tmpMat);
        rightMesh.position.set(RC.TRACK_WIDTH/2 + 10, 10, zOffset);

        leftMesh.moveable = false;
        RC.physics.addObject(leftMesh);
        rightMesh.moveable = false;;
        RC.physics.addObject(rightMesh);

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

    this.update = function(elapsed) {

    };
};
