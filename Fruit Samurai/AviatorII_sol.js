// THREEJS RELATED VARIABLES
var scene, renderer, camera, plane;

// 3D Models
var swordPivot;
var sword;

var verticalSwingValue = 0;
var verticalSwingTotal = 0;
var verticalSwingDecay = 0;

var horizontalTiltValue = 0;
var horizontalTiltTotal = 0;
var horizontalTiltDecay = 0;

var horizontalSwingValue = 0;
var horizontalSwingTotal = 0;
var horizontalSwingDecay = 0;



window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the objects
    createSword();

    // add the lights
    createLights();

    // listen to the mouse
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mousedown', handleMouseDown, false);

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    animate();
}

//INIT THREE JS, SCREEN, SCENE, CAMERA AND MOUSE EVENTS
function createScene() {
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    // var axes = new THREE.AxisHelper(100);
    // scene.add(axes)


    // create a camera, which defines where we're looking at
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

    // position the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#e4e0ba");

    plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshBasicMaterial({
            opacity: 0.0,
            transparent: true,
            visible: false
        }));
    scene.add(plane);

    /*****************************
    * SHADOWS 
    ****************************/
    // enable shadow rendering
    renderer.shadowMap.enabled = true;

    // add the output of the renderer to the DIV with id "world"
    document.getElementById('world').appendChild(renderer.domElement);

    // listen to the screen: if the user resizes it we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

function createSword() {
    var swordGeometry = new THREE.BoxGeometry(2, 100, 10);
    var swordMaterial = new THREE.MeshPhongMaterial({ color: 0xd8d0d1 });
    sword = new THREE.Mesh(swordGeometry, swordMaterial);

    swordPivot = new THREE.Object3D();

    swordPivot.add(sword);
    scene.add(swordPivot);
    sword.position.y += 20;
    swordPivot.position.set(0, 0, 0);

    sword.castShadow = true;
    sword.receiveShadow = true;

    var axes = new THREE.AxisHelper(100);
    var axesScene = new THREE.AxisHelper(100);
    swordPivot.add(axes)
    scene.add(axesScene);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
    // A hemisphere light is a gradient colored light 
    // Parameters: sky color, ground color, intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);


    // make the hemisphere light FOLLOW THE PLANE object
    //directionalLight.target = plane;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);

    // var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(helper);
    // var helper2 = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(helper2);

}


function animate() {

    // render
    renderer.render(scene, camera);

    //update objects
    updateSword();

    requestAnimationFrame(animate);


}


// HANDLE MOUSE EVENTS
var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
    var tx = -1 + (event.clientX / window.innerWidth) * 2;
    var ty = 1 - (event.clientY / window.innerHeight) * 2;
    mousePos = { x: tx, y: ty };
}
function handleMouseDown(event) {
    if (event.shiftKey) {
        //swordPivot.rotation.z = -Math.PI/2;

        if (horizontalTiltTotal >= 0 && verticalSwingTotal >= 0) {
            console.log("horizontal")
            horizontalTiltValue = -0.25
            horizontalTiltTotal = -0.01
            horizontalTiltDecay = -0.02
            //swordPivot.rotation.z += horizontalSwingTotal;
            horizontalSwingValue = -0.50
            horizontalSwingTotal = -0.75
            horizontalSwingDecay = -0.02
        }
    }
    else {

        if (verticalSwingTotal >= 0 && horizontalTiltTotal >= 0) {
            console.log("vertical")
            verticalSwingValue = -0.50
            verticalSwingTotal = -0.75
            verticalSwingDecay = -0.02
            // swordPivot.rotation.x += verticalSwingTotal;
        }
    }



}

function updateSword() {
    //swordPivot.rotation.z += 0.01;
    var targetX = mousePos.x * 200;
    var targetY = mousePos.y * 100 + 100;

    // // update the airplane's position
    // plane.position.x = targetX;
    // plane.position.y = targetY + 100;

    // // update the sword's position SMOOTHLY
    // swordPivot.position.x += (targetX - swordPivot.position.x + 100) * 0.1;
    // swordPivot.position.y += (targetY - swordPivot.position.y + 100) * 0.1;


    swordPivot.position.x += (targetX - swordPivot.position.x) * 0.1;
    swordPivot.position.y += (targetY - swordPivot.position.y) * 0.1;
    console.log(targetX - swordPivot.position.x)

    sword.rotation.z = (targetY - swordPivot.position.y) * 0.007;

    swordPivot.rotation.x += verticalSwingValue;
    swordPivot.rotation.z += horizontalTiltValue;
    swordPivot.rotation.y -= horizontalSwingValue;


    console.log(horizontalTiltValue + " " + swordPivot.rotation.z)


    verticalSwingTotal += verticalSwingValue;
    verticalSwingValue -= verticalSwingDecay;
    horizontalTiltTotal += horizontalTiltValue;
    horizontalTiltValue -= horizontalTiltDecay;
    horizontalSwingTotal += horizontalSwingValue;
    horizontalSwingValue -= horizontalSwingDecay;
    //console.log("value: " + horizontalSwingValue + "  total: " + horizontalSwingTotal + "    decay:" + horizontalSwingDecay)

    if (verticalSwingTotal < -2 * Math.PI) {
        verticalSwingTotal = 0;
        verticalSwingValue = 0;
        verticalSwingDecay = 0;
        swordPivot.rotation.x = 0;
        console.log("done")
    }

    if (horizontalTiltTotal > 0) {
        horizontalTiltTotal = 0;
        horizontalTiltValue = 0;
        horizontalTiltDecay = 0;
        swordPivot.rotation.z = 0;

        horizontalSwingTotal = 0;
        horizontalSwingValue = 0;
        horizontalSwingDecay = 0;
        swordPivot.rotation.y = 0;
        console.log("done")
    }

}



