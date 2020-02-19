class Particle {
    constructor(x, y, z, vertical, scene, color) {
        this.r = 0.9 // Mudar em principio
        /** Posição */
        this.x = x
        this.y = y
        this.z = z

        this.lifeSpan = 20

        /** Velocidades */
        this.vx = Math.random() * 2 - 1/ 100 + 0.6
        this.vy = Math.random() * (-3) + 1/ 100 - 0.6
        /** Esta velocidade vai ser sempre a mesma e constante */
        this.vz = -4

        if (Math.random() > 0.5) this.vx *= -1

        if (vertical) {
            this.vy -= 3
        }
        else {
            this.vx = this.vx * (-1) - 5
        }
        /** Construir a bola */
        let widthSegments = 32, heightSegments = 32
        let particleGeometry = new THREE.SphereGeometry(this.r, widthSegments, heightSegments)
        let particleMesh = new THREE.MeshBasicMaterial({ color: color })
        this.particle = new THREE.Mesh(particleGeometry, particleMesh)
        scene.add(this.particle)
        this.particle.position.set(this.x, this.y, this.z)
    }

    show() {

        this.lifeSpan -= 1
    }

    move() {
        this.particle.position.x += this.vx
        this.particle.position.y += this.vy
        this.particle.position.z += this.vz

        if (this.vx > 0) this.vx -= 0.03
        if (this.vy > 0) this.vy -= 0.03
        if (this.vz > 0) this.vz -= 0.03
    }

    remove() {
        if (this.lifeSpan <= 0) {
            scene.remove(this.particle)
            return true
        }
        return false
    }
}