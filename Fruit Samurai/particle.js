class Particle {
    constructor(x, y, z, vertical, scene) {
        this.r = 2 // Mudar em principio
        /** Posição */
        this.x = x
        this.y = y
        this.z = z

        /** Vai ser logo na função de move() que se vai "disincrmentar"o lifeSpan
         * 
         * 
         */
        this.lifeSpan = 60

        /** Velocidades */
        this.vx = vertical == true ? 0.1 : 0.5
        this.vy = vertical == true ? -0.5 : 0.1
        /** Esta velocidade vai ser sempre a mesma e constante */
        this.vz = 0.1

        /** Construir a bola */
        let widthSegments = 32, heightSegments = 32
        let particleGeometry = new THREE.SphereGeometry(this.r, widthSegments, heightSegments)
        let particleMesh = new THREE.MeshBasicMaterial({ color: 0x458b00 })
        this.particle = new THREE.Mesh(particleGeometry, particleMesh)
        scene.add(this.particle)
    }

    show() {
        
        this.lifeSpan -= 1
    }

    move() {
        this.particle.position.x += this.vx
        this.particle.position.y += this.vy
        this.particle.position.z += this.vz

        if(this.vx > 0) this.vx -= 0.0001
        if(this.vy > 0) this.vy -= 0.0001
        if(this.vz > 0) this.vz -= 0.0001
    }
}