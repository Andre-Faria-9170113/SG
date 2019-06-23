// THREEJS RELATED VARIABLES
var scene, renderer, camera, plane, texto = null;

// 3D Models

let loader = new THREE.FontLoader();
let font = null
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
var verticalSwingGuide;

/** Total de balas */
let totalBalls = 5;

/** "Jogador" */
let jogador = {
    vidas: 3,
    pontos: 0
}

// Tentar usar os stats

let killBall = false

/** Variável global para dizer se o jogo acabou ou não */
let fini = false

/** Array de Bolas */
let balls = []
/** Array de bolas cortadas */
let cutBalls = []
/** Array com as particulas,
 * Vai se dar push de X particulas ao "estourar" as bolas
 */
let particles = []

let grav = -0.01;

/** Tempo de intervalo de lançamento das bolas */
let intervalos = [200, 150, 100];

//gerar intervalo 1ª bola
let intervalo = intervalos[Math.floor(Math.random() * 3)];
let timeCount = 0

/** Game Settings (Em principio não se vai alterar estas settings\) */
const gameSet = {
    x_vel: 1,
    y_vel: 1,
    z_vel: 1
}

//variáveis controlos 
let mousedown = false;
let shiftKey = false;

let vertical = true

var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;

window.onload = function init() {
    start()
}
function start() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the objects
    createSword();

    // add the lights
    createLights();

    //Criar chão
    createFloor()

    //Criar o texto
    loader.load('fonts/helvetiker_regular.typeface.json', (res) => {
        font = res
        texto = createText("Vidas: 3 - Pontos: 0")
        // console.log(texto, res) 
        // console.log(texto)
        scene.add(texto)
    })

    // listen to the mouse
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);

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
    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#e4e0ba");

    // plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10),
    //     new THREE.MeshBasicMaterial({
    //         opacity: 0.0,
    //         transparent: true,
    //         visible: false
    //     }));
    // scene.add(plane);

    /*****************************
    * SHADOWS 
    ****************************/
    // enable shadow rendering


    // add the output of the renderer to the DIV with id "world"
    document.getElementById('world').appendChild(renderer.domElement);

    // listen to the screen: if the user resizes it we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

function createSword() {
    var swordGeometry = new THREE.BoxGeometry(2, 100, 10);
    var swordMaterial = new THREE.MeshPhongMaterial({ color: 0xd8d0d1, shininess: 10 });
    sword = new THREE.Mesh(swordGeometry, swordMaterial);

    swordBBox = new THREE.Box3().setFromObject(sword);


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

    // var axes = new THREE.AxisHelper(100);
    // var axesScene = new THREE.AxisHelper(100);
    // swordPivot.add(axes)
    // scene.add(axesScene);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
    // A hemisphere light is a gradient colored light 
    // Parameters: sky color, ground color, intensity of the light
    // hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x0000ff, 0.9);

    // var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(0, 200, 400)
    // directionalLight.castShadow = true;
    // directionalLight.shadowCameraVisible = true;
    // directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 2048;
    // directionalLight.shadow.camera.near = -1000;    // default
    // directionalLight.shadow.camera.far = 1000;     // default
    // scene.add(directionalLight);

    //Create a DirectionalLight and turn on shadows for the light
    var light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(0, 200, 300); 			//default; light shining from top
    light.castShadow = true;            // default  
    scene.add(light);

    //Set up shadow properties for the light
    light.shadow.camera.left = -310;  // default
    light.shadow.camera.right = 310; // default
    light.shadow.camera.top = 500;    // default
    light.shadow.camera.bottom = 0;     // default
    light.shadow.camera.far = 1000;     // default

    var helper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(helper);

    var ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);


    // make the hemisphere light FOLLOW THE PLANE object
    //directionalLight.target = plane;

    // to activate the lights, just add them to the scene
    //scene.add(hemisphereLight);

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
    swordBBox = new THREE.Box3().setFromObject(sword);

    if (!fini) {
        /** Generate and update balls */
        if (balls.length <= 1) {
            timeCount++
            if (timeCount >= intervalo) {
                generateBalls()
            }
        }

        updateBalls();
        for (let i = 0; i < balls.length; i++) {
            let BBox = new THREE.Box3().setFromObject(balls[i]);
            var collision = BBox.intersectsBox(swordBBox);
            if (collision == true && killBall == true) {
                //GERAR DUAS METADES DA BOLA ORIGINAL CONFORME O CORTE
                let r = balls[i].radius

                let geometry1;
                let geometry2;
                if (vertical) {
                    geometry1 = new THREE.SphereGeometry(r, 32, 32, Math.PI / 2, Math.PI)
                    geometry2 = new THREE.SphereGeometry(r, 32, 32, 3 * Math.PI / 2, Math.PI)
                }
                else {
                    geometry1 = new THREE.SphereGeometry(r, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2)
                    geometry2 = new THREE.SphereGeometry(r, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)
                }
                
                //console.log("balls[i]: "+balls[i])
                let halfColor = balls[i].color
                let mesh = new THREE.MeshLambertMaterial({ color: halfColor, side: THREE.DoubleSide })
                let half1 = new THREE.Mesh(geometry1, mesh)
                let half2 = new THREE.Mesh(geometry2, mesh)
                half1.castShadow = true;
                half1.receiveShadow = true;
                half2.castShadow = true;
                half2.receiveShadow = true;

                scene.add(half1)
                scene.add(half2)

                half1.position.set(balls[i].position.x, balls[i].position.y, balls[i].position.z)
                half2.position.set(balls[i].position.x, balls[i].position.y, balls[i].position.z)

                half1.vx = 0.5
                half2.vx = -0.5

                half1.vy = 0.5
                half2.vy = -0.5

                jogador.pontos += 10

                texto = createText(`Vidas: ${jogador.vidas} - Pontos: ${jogador.pontos}`)
                // console.log(texto, res) 
                // console.log(texto)
                scene.add(texto)

                if (vertical) {
                    half1.rotateZ = -0.02
                    half2.rotateZ = 0.02
                }
                else {
                    half1.rotateZ = -0.02
                    half2.rotateZ = 0.02
                }

                cutBalls.push(half1);
                cutBalls.push(half2);

                //balls[i].material.color.setRGB(1, 0, 0);
                balls[i].visible = false;
                let rmBall = balls.splice(i, 1)[0]
                let nPaticles = Math.round((Math.random() + 1) * 15 - 15)
                for (let j = 0; j < nPaticles; j++) {
                    //Como saber se é vertical swing or horizontal
                    particles.push(new Particle(rmBall.position.x, rmBall.position.y, rmBall.position.z, vertical, scene))
                }
                //console.log(particles, "O ARray de particulas!!!!!")
            }
            // else {
            //     balls[i].material.color.setRGB(0, 0, 1);
            // }
            //console.log(collision)
        }
        updateCutBalls()
        if (particles.length > 0) {
            for (let i = 0; i < particles.length; i++) {
                particles[i].show()
                particles[i].move()
                if (particles[i].remove()) {
                    //console.log(particles[i], "Removida")
                    particles.splice(i, 1)
                }
            }
        }

        if (mousedown == true && shiftKey == true) {
            horizontalSwingGuide.visible = true;
            verticalSwingGuide.visible = false;
        }
        else if (mousedown == true && shiftKey == false) {
            horizontalSwingGuide.visible = false;
            verticalSwingGuide.visible = true;
        }
        else if (mousedown == false && shiftKey == false) {
            horizontalSwingGuide.visible = false;
            verticalSwingGuide.visible = false;
        }

        if (horizontalSwingTotal != 0 || verticalSwingTotal != 0) {
            verticalSwingGuide.visible = false;
            horizontalSwingGuide.visible = false;
        }
    }
    else {
        /** Criar um ecrã de fim de jogo */

    }

    /** Até te animaste te te */
    kilBall = false
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
                killBall = true

                //swordPivot.rotation.z += horizontalSwingTotal;
                horizontalSwingValue = -0.50
                horizontalSwingTotal = -0.75
                horizontalSwingDecay = -0.02

                // horizontalSwingGuide.visible = false;
                // verticalSwingGuide.visible = false;
                vertical = false
                mousedown = false;
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
                killBall = true
                vertical = true
                // swordPivot.rotation.x += verticalSwingTotal;

                // horizontalSwingGuide.visible = false;
                // verticalSwingGuide.visible = false;
                mousedown = false;
            }

        }
    }
}

function handleMouseDown(event) {
    if (verticalSwingTotal >= 0 && horizontalSwingTotal >= 0) {
        // if (event.shiftKey) {
        //     // horizontalSwingGuide.visible = true;
        //     // verticalSwingGuide.visible = false;
        //     mousedown 
        // }
        // else {
        //     horizontalSwingGuide.visible = false;
        //     verticalSwingGuide.visible = true;
        // }
        mousedown = true;
    }

}

function handleKeyDown(event) {
    if (event.keyCode == "16") {
        // verticalSwingGuide.visible = false;
        // horizontalSwingGuide.visible = true;
        shiftKey = true;
    }
}

function handleKeyUp(event) {
    if (event.keyCode == "16") {
        // horizontalSwingGuide.visible = false;
        shiftKey = false;
    }
}

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
        killBall = false
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
        killBall = false
        console.log("done")
    }

    //DISABLE SWING GUIDES WHILE SWINGING
    // if(horizontalSwingTotal == 0 && verticalSwingTotal == 0){
    //     //horizontalSwingGuide.visible = true;
    //     verticalSwingGuide.visible = true;
    // }


}

function generateBalls() {
    if (balls.length < totalBalls) {
        /** Visto que estamos a fazer raios diferentes, 
         * então os pontos vão ser calculados consoante 
         * o raio das bolas.
         */
        let r = Math.round(Math.random() * 4 + 4), widthSegments = 32, heightSegments = 32
        let geometry = new THREE.SphereGeometry(r, widthSegments, heightSegments)
        let ballMat = new THREE.MeshLambertMaterial({color: new THREE.Color("rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")")})
        let ball = new THREE.Mesh(geometry, ballMat)
        ball.castShadow = true;
        ball.receiveShadow = true;  
        ball.radius = r;
        ball.color= ballMat.color;



        ball.vx = Math.floor(Math.random() * 6 - 3);
        ball.vy = Math.ceil(Math.random() + 0.5);

        ball.position.set(Math.floor(Math.random() * 100 - 50), -2, -50)

        balls.push(ball)
        scene.add(ball)

        // console.log("added Ball " + balls.length + "")
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
            if (balls[i].position.y <= -3 || balls[i].position.x > 300 || balls[i].position.x < -300) {
                // console.log(balls[i], balls[i].geometry.parameters.radius)
                scene.remove(balls[i])
                balls.splice(i, 1)

                /** retirar vidas
                 * porque se está a ser eliminada assim é porque 
                 * o jogador não lhe acertou
                 */
                jogador.vidas--
                texto = createText(`Vidas: ${jogador.vidas} - Pontos: ${jogador.pontos}`)
                // console.log(texto, res) 
                // console.log(texto)
                scene.add(texto)
                //console.log(jogador)
                if (jogador.vidas <= 0) {
                    console.log("Até te morreste te")
                    fini = true
                    startOver()
                }
            }
        }
    }
}
function updateCutBalls() {
    if (cutBalls.length > 0) {
        for (let i = 0; i < cutBalls.length; i++) {
            // console.log(cutBalls[i])
            cutBalls[i].position.y += cutBalls[i].vy;
            cutBalls[i].vy += grav * 3;
            cutBalls[i].rotation.z += cutBalls[i].rotateZ;

            cutBalls[i].position.x += cutBalls[i].vx;
            if (cutBalls[i].position.y <= -6 || cutBalls[i].position.x > 300 || cutBalls[i].position.x < -300) {
                // console.log(balls[i], balls[i].geometry.parameters.radius)
                scene.remove(cutBalls[i])
                cutBalls.splice(i, 1)
            }
        }
    }
}

function createText(nVidas) {

    if (texto != null) scene.remove(texto)
    let textGeometry = new THREE.TextGeometry(nVidas, {
        font: font,
        size: 7,
        height: 0,
        curveSegments: 30,
        bevelThickness: 0.7,
        bevelSize: 0.4,
        // bevelEnabled: true,
        bevelOffset: 0,
        bevelSegments: 1
    })
    textGeometry.computeBoundingBox()
    textGeometry.computeVertexNormals()
    let textMesh = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    let text = new THREE.Mesh(textGeometry, textMesh)
    // console.log(text)
    text.position.set(30, 190, 20)
    return text


}

function createFloor() {
    let floorGeometry = new THREE.PlaneGeometry(600, 1000, 100, 100)
    let floorMaterial = new THREE.MeshPhongMaterial({ color: 0xa0522d })
    let floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.receiveShadow = true;

    scene.add(floor)
    // floor.rotation.x = 0.1
    floor.rotation.set(-Math.PI / 2, Math.PI / 2000, Math.PI);
    //console.log(floor)

    //WALLS/CEILING
    let wallGeometry = new THREE.PlaneGeometry(600, 1000, 100, 100)
    let wallMaterial = new THREE.MeshPhongMaterial({ color: 0xa0522d, side: THREE.DoubleSide })
    let wallR = new THREE.Mesh(wallGeometry, wallMaterial)
    let wallL = new THREE.Mesh(wallGeometry, wallMaterial)
    wallR.receiveShadow = true;
    wallR.castShadow = true;
    wallL.receiveShadow = true;
    wallL.castShadow = true;

    floor.add(wallR)
    floor.add(wallL)
    //ceiling.position.y += 70
    wallR.position.x -= 300
    wallR.rotation.y = Math.PI / 2;
    wallL.position.x += 300
    wallL.rotation.y = Math.PI / 2;

    // console.log(floor)
}

function startOver() {
    /**
     * Voltar ao inicio,
     * jogador
     */
    let textGeometry = new THREE.TextGeometry("Clica em qualquer tecla para voltar a jogar", {
        font: font,
        size: 7,
        height: 0,
        curveSegments: 30,
        bevelThickness: 0.7,
        bevelSize: 0.4,
        bevelOffset: 0,
        bevelSegments: 1
    })
    textGeometry.computeBoundingBox()
    textGeometry.computeVertexNormals()
    let textMesh = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    let text = new THREE.Mesh(textGeometry, textMesh)
    // console.log(text)
    text.position.set(-60, 100, 0)
    scene.add(text)
    document.addEventListener('keypress', keypressedStartOver)

}
function keypressedStartOver() {
    
    /** Remover todas as bolas dos arrays e particulas também 
     * balls
     * cutBalls
     * particles
    */
    // jogador.vidas = 3
    // jogador.score = 0
    // fini = false

    // if (balls.length > 0) {

    //     for (let i = 0; i < balls.length; i++) {
    //         scene.remove(balls[i])
    //         balls.splice(i, 1)
    //     }
    // }
    // if (cutBalls.length > 0) {

    //     for (let i = 0; i < cutBalls.length; i++) {
    //         scene.remove(cutBalls[i])
    //         cutBalls.splice(i, 1)
    //     }
    // }
    // if (particles.length > 0) {

    //     for (let i = 0; i < particles.length; i++) {
    //         scene.remove(particles[i])
    //         particles.splice(i, 1)
    //     }
    // }
    
    // start()

    // document.removeEventListener('keypress', keypressedStartOver)
    location.reload()

}