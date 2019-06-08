// THREEJS RELATED VARIABLES
var scene, renderer, camera, plane;

// 3D Models

/** Espada  */
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

//Guias Cortes
var verticalSwingGuide;
var horizontalSwingGuide;
// var verticalSwingGuide;

/** "Jogador" */
let jogador = {
    vidas: 3,
    pontos: 0
}

/** Array de Bolas */
let balls = []
let grav = -0.01;

/** Tempo de intervalo de lançamento das bolas */
let intervalos = [500, 400, 300];

//gerar intervalo 1ª bola
let intervalo = intervalos[Math.floor(Math.random() * 3)];
let timeCount = 0

/** Game Settings (Em principio não se vai alterar estas settings\) */
const gameSet = {
    x_vel: 1,
    y_vel: 1,
    z_vel: 1
}

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
    document.addEventListener('mouseup', handleMouseUp, false);
    // document.addEventListener('keydown', handleKeyDown, false);
    // document.addEventListener('keyup', handleKeyUp, false);

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

    //guia de corte vertical
    var geometryVertical = new THREE.CylinderGeometry(70, 70, 1, 32, 1.5, false, -Math.PI / 2, -Math.PI);

    var swingGuideMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    swingGuideMaterial.transparent = true;
    swingGuideMaterial.opacity = 0.5;

    // Create the final object to add to the scene
    verticalSwingGuide = new THREE.Mesh(geometryVertical, swingGuideMaterial);
    verticalSwingGuide.visible = false;

    swordPivot.add(verticalSwingGuide);
    verticalSwingGuide.rotation.z = Math.PI / 2



    //guia de corte horizontal
    var geometryHorizontal = new THREE.CylinderGeometry(70, 70, 1, 32, 1.5, false, -Math.PI / 2, -Math.PI);

    // Create the final object to add to the scene
    horizontalSwingGuide = new THREE.Mesh(geometryHorizontal, swingGuideMaterial);
    horizontalSwingGuide.visible = false;

    swordPivot.add(horizontalSwingGuide);



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

    /** Render */
    renderer.render(scene, camera);

    /** update sword */
    updateSword();

    /** Generate and update balls */
    if (balls.length <= 1) {
        timeCount++
        if (timeCount >= intervalo) {
            generateBalls()
        }
    }

    updateBalls();

    /** Até te animaste te te */
    requestAnimationFrame(animate);
}


// HANDLE MOUSE EVENTS
var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
    var tx = -1 + (event.clientX / window.innerWidth) * 2;
    var ty = 1 - (event.clientY / window.innerHeight) * 2;
    mousePos = { x: tx, y: ty };
}
function handleMouseUp(event) {
    if (event.shiftKey) {
        //swordPivot.rotation.z = -Math.PI/2;

        if (horizontalTiltTotal >= 0 && verticalSwingTotal >= 0) {
            if (horizontalSwingGuide.visible) {
                console.log("horizontal")
                horizontalTiltValue = -0.25
                horizontalTiltTotal = -0.01
                horizontalTiltDecay = -0.02
                //swordPivot.rotation.z += horizontalSwingTotal;
                horizontalSwingValue = -0.50
                horizontalSwingTotal = -0.75
                horizontalSwingDecay = -0.02

                horizontalSwingGuide.visible = false;
                verticalSwingGuide.visible = false;
            }

        }
    }
    else {

        if (verticalSwingTotal >= 0 && horizontalTiltTotal >= 0) {
            if (verticalSwingGuide.visible) {
                console.log("vertical")
                verticalSwingValue = -0.50
                verticalSwingTotal = -0.75
                verticalSwingDecay = -0.02
                // swordPivot.rotation.x += verticalSwingTotal;

                horizontalSwingGuide.visible = false;
                verticalSwingGuide.visible = false;
            }

        }
    }
}

function handleMouseDown(event) {
    if (verticalSwingTotal >= 0 && horizontalSwingTotal >= 0) {
        if (event.shiftKey) {
            horizontalSwingGuide.visible = true;
            verticalSwingGuide.visible = false;
        }
        else {
            horizontalSwingGuide.visible = false;
            verticalSwingGuide.visible = true;
        }
    }

}

// function handleKeyDown(event) {
//     if(event.keyCode == "16"){
//         verticalSwingGuide.visible = false;
//         horizontalSwingGuide.visible = true;
//     }
// }

// function handleKeyUp(event) {
//     if(event.keyCode == "16"){
//         verticalSwingGuide.visible = true;
//         horizontalSwingGuide.visible = false;
//     }
// }

function updateSword() {
    //swordPivot.rotation.z += 0.01;
    var targetX = mousePos.x * 200;
    var targetY = mousePos.y * 100 + 100;


    // // update the sword's position SMOOTHLY
    // swordPivot.position.x += (targetX - swordPivot.position.x + 100) * 0.1;
    // swordPivot.position.y += (targetY - swordPivot.position.y + 100) * 0.1;


    swordPivot.position.x += (targetX - swordPivot.position.x) * 0.1;
    swordPivot.position.y += (targetY - swordPivot.position.y) * 0.1;
    // console.log(targetX - swordPivot.position.x)

    sword.rotation.z = (targetY - swordPivot.position.y) * 0.007;

    swordPivot.rotation.x += verticalSwingValue;
    swordPivot.rotation.z += horizontalTiltValue;
    swordPivot.rotation.y -= horizontalSwingValue;


    // console.log(horizontalTiltValue + " " + swordPivot.rotation.z)


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

        horizontalSwingGuide.visible = false;
        verticalSwingGuide.visible = false;
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

        horizontalSwingGuide.visible = false;
        verticalSwingGuide.visible = false;
        console.log("done")
    }

    //DISABLE SWING GUIDES WHILE SWINGING
    // if(horizontalSwingTotal == 0 && verticalSwingTotal == 0){
    //     //horizontalSwingGuide.visible = true;
    //     verticalSwingGuide.visible = true;
    // }


}

function generateBalls() {
    /** Criar aqui as bolas, mas mover-las no updateBalls, usar array "global" */
    /** Construir a bola */
    if (balls.length < 3) {
        let r = Math.round(Math.random() * 4 + 2), widthSegments = 32, heightSegments = 32
        let materialProp = { color: 0x0000ff }
        let geometry = new THREE.SphereGeometry(r, widthSegments, heightSegments)
        let mesh = new THREE.MeshBasicMaterial(materialProp)
        let ball = new THREE.Mesh(geometry, mesh)

        ball.vx = Math.random() * 6 - 3;
        ball.vy = Math.random() + 0.5;

        balls.push(ball)
        scene.add(ball)

        console.log("added Ball " + balls.length + "")
        /** Escolher um intervalo diferente */
        timeCount = 0
        intervalo = intervalos[Math.floor(Math.random() * 3)]
    }
}

function updateBalls() {
    if (balls.length > 0) {
        for (let i = 0; i < balls.length; i++) {
            balls[i].position.y += balls[i].vy;
            balls[i].vy += grav;

            balls[i].position.x += balls[i].vx;
        }
    }
}
