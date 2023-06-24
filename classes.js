class Sprite {
    constructor({ 
        position, 
        image, 
        frames = { max: 1, hold: 20 }, 
        sprites, 
        animate = false
    }) {
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src

        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        c.restore()

        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.hold === 0) {
            if(this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }

    unDraw() {
        {
            this.frames.elapsed = 0
            this.frames.val = 0
        }
    }
}

class Monster extends Sprite {
    constructor({
        position, 
        image, 
        frames = { max: 1, hold: 20 }, 
        sprites, 
        animate = false,
        isEnemy = false, 
        name,
        attacks
    }) {
        super({
            position, 
            image, 
            frames,
            sprites, 
            animate
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint() {
        document.querySelector('#dialogueBox').innerHTML = this.name + ' died!'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }

    attack({attack, recipient, renderedSprites}) {
        let healthBar = '#enemyHealthBar'
        if(this.isEnemy) healthBar = '#playerHealthBar'
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attack.name

        recipient.health -= attack.damage

        switch(attack.name) {
            case 'Swiftswipe':
                const excrementImage = new Image()
                excrementImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/projectile.png'
                const excrement = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: excrementImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true
                })

                renderedSprites.splice(1, 0, excrement)

                gsap.to(excrement.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                         //Enemy actually gets hit
                         gsap.to(healthBar, {
                            width: recipient.health - attack.damage + '%'
                        })
                        
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
        
                        gsap.to(recipient, {
                            opacity: 0.2,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        renderedSprites.splice(1, 1)
                    }
                })
                break;
            case 'Scratch':
                const tl = gsap.timeline()

                let movementDistance = 20
                if(this.isEnemy) movementDistance = -20
        
                tl.to(this.position, {
                    x: this.position.x + movementDistance
                })
                    .to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        //Enemy actually gets hit
                        gsap.to(healthBar, {
                            width: recipient.health - attack.damage + '%'
                        })
                        
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
        
                        gsap.to(recipient, {
                            opacity: 0.2,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
            break;
        }
    }
}

class Boundary {
    static width = 64
    static height = 64
    constructor({position}) {
        this.position = position
        this.width = 64
        this.height = 64
    }

    draw() {
        c.fillStyle = /*'rgba(0, 0, 0, 0)'*/ 'rgba(255, 0, 0, 0.2'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Item {
    constructor({
        name = '',
        quantity = 0,
        value = 0,
        rarity = ''
    }) {
        this.name = name
        this.quantity = quantity
        this.value = value
        this.rarity = rarity
    }
}