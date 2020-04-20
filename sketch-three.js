var scene, camera, renderer, cube, mesh;

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.PixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;

    document.body.appendChild(renderer.domElement);

    const loader = new THREE.OBJLoader();
    loader.load('resources/hort3.obj',
        (obj) => {
            let material = new THREE.PointsMaterial({ color: 0xFFFF00, size: 0.0001 });
            mesh = new THREE.Points(obj.children[0].geometry, material);
            mesh.material.color.setHex(0xFFFFFF);
            scene.add(mesh);
        },
        (xhr) => {
            console.log(xhr)
        },
        (err) => {
            consol.error("loading .obj went wrong,", err)
        }
    );

    camera.position.z = 20;

}

function animate() {
    requestAnimationFrame(animate);
    if (mesh != null) mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


window.addEventListener('resize', onWindowResize, false);

init();
animate();