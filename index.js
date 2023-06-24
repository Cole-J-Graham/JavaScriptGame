const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
let clicked = false

const image = new Image()
image.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/test map.png'

//const foregroundImage = new Image()
//foregroundImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/foregroundObjects.png'

const playerImage = new Image()
playerImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/move without FX.png'

const playerLeftImage = new Image()
playerLeftImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/move without FX left.png'

const playerAttackImageRight = new Image()
playerAttackImageRight.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/black cat attack.png'

const playerRunImage = new Image()
playerRunImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/black cat run.png'

const playerIdleRightImage = new Image()
playerIdleRightImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/idleRight.png'

const playerIdleLeftImage = new Image()
playerIdleLeftImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/idleLeft.png'

canvas.width = 1600
canvas.height = 840

const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+= 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const battleZones = []
const boundaries = []

const offset = {
    x: -1264,
    y: -1150
}

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 141 / 4 / 2,
        y: canvas.height / 2 - 50 / 2,
    },
    image: playerImage,
    frames: {
        max: 4,
        hold: 20
    },
    sprites: {
        right: playerImage,
        left: playerLeftImage,
        attack: playerAttackImageRight,
        run: playerRunImage,
        idleRight: playerIdleRightImage,
        idleLeft: playerIdleLeftImage
    }
})

const background = new Sprite({
    position: {
    x: offset.x,
    y: offset.y
},
image: image
})

/*const foreground = new Sprite({
    position: {
    x: offset.x,
    y: offset.y
},
image: foregroundImage
})*/

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 11818) //Collision map tile
            boundaries.push(
                new Boundary({
                    position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
        
        }
    })
    )
})
})
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 71) //Battle zone map tile
            battleZones.push(
                new Boundary({
                    position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
        
        }
    })
    )
})
})

console.log(boundaries)

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    e: {
        pressed: false
    },
    shiftKey: {
        pressed: false
    }
}

const movables = [background, ...boundaries, /*foreground*/, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    player.draw()

    document.querySelector('#userInterface').style.display = 'none'

    let moving = true
    let movespeed = 2.5
    let lastKey = ''
    player.animate = false

    if(battle.initiated) return

    //Combat Activation
    if(keys.w.pressed && keys.a.pressed || keys.w.pressed && keys.d.pressed || keys.s.pressed && keys.a.pressed || keys.s.pressed && keys.d.pressed 
        || keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
            for (let i = 0; i < battleZones.length; i++) {
                const battleZone = battleZones[i]
                const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) //Find width of intersecting rectangle for more proper collision for battle events
                - Math.max(player.position.x, battleZone.position.x))
                * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
                - Math.max(player.position.y, battleZone.position.y))
                if (
                    rectangularCollision({
                        rectangle1: player,
                        rectangle2: battleZone
                    }) &&
                    overlappingArea > (player.width * player.height) / 2 &&
                    Math.random() < 0.01
                ) {
                    console.log('activate battle')
                    //deactivate current animation loop
                    window.cancelAnimationFrame(animationId)
                    battle.initiated = true
                    //Hide Inventory if open
                    clicked = false
                    document.querySelector('#Inventory').style.display = "none"
                    document.querySelector('#footerButton').innerHTML = 'Inventory^'
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.4,
                        onComplete() {
                            gsap.to('#overlappingDiv', {
                                opacity: 1,
                                duration: 0.4,
                                onComplete() {
                                    initBattle()
                                    animateBattle()
                                    gsap.to('#overlappingDiv', {
                                        opacity: 0,
                                        duration: 0.4,
                                    })
                                }
                            })
                        }
                    })
                    break
                }
            }

        }

    //Player Movement
    if (keys.w.pressed && keys.a.pressed) {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x + movespeed,
                        y: boundary.position.y + movespeed
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        {
            movables.forEach((movable) => {
                movable.position.y += movespeed
                movable.position.x += movespeed
            })
        }

    } else if (keys.w.pressed && keys.d.pressed) {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x - movespeed,
                        y: boundary.position.y + movespeed
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        {
            movables.forEach((movable) => {
                movable.position.x -= movespeed
                movable.position.y += movespeed
            })
        }

    } else if (keys.s.pressed && keys.a.pressed) {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x + movespeed,
                        y: boundary.position.y - movespeed
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        {
            movables.forEach((movable) => {
                movable.position.x += movespeed
                movable.position.y -= movespeed
            })
        }

    } else if (keys.s.pressed && keys.d.pressed) {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x - movespeed,
                        y: boundary.position.y - movespeed
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        {
            movables.forEach((movable) => {
                movable.position.x -= movespeed
                movable.position.y -= movespeed
            })
        }
       
    } else if (keys.w.pressed) {
        player.animate = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + movespeed
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        {
            movables.forEach((movable) => {
                movable.position.y += movespeed
            })
        }
       
    } else if(keys.a.pressed) {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x + movespeed,
                        y: boundary.position.y
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        movables.forEach((movable) => {
            movable.position.x += movespeed
        })
        
    } else if(keys.s.pressed) {
        player.animate = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - movespeed
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        movables.forEach((movable) => {
            movable.position.y -= movespeed
        })
        
    } else if(keys.d.pressed) {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                        x: boundary.position.x - movespeed,
                        y: boundary.position.y
                    }
                }
                })
            ) {
                moving = false
                break
            }
        }

        if(moving)
        movables.forEach((movable) => {
            movable.position.x -= movespeed
        })
    } else if(keys.e.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.attack
    }
}
animate()

window.addEventListener('keydown', (e) => {
switch (e.key) {
    case 'w':
        keys.w.pressed = true
        break
    case 'a':
        keys.a.pressed = true
        break
    case 's':
        keys.s.pressed = true
        break
    case 'd':
        keys.d.pressed = true
        break
    case 'e':
        keys.e.pressed = true
        break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            player.unDraw();
            break
        case 'a':
            keys.a.pressed = false
            player.unDraw();
            break
        case 's':
            keys.s.pressed = false
            player.unDraw();
            break
        case 'd':
            keys.d.pressed = false
            lastKey = 'd'
            player.unDraw();
            break
        case 'e':
            keys.e.pressed = false
            player.unDraw();
            break
        case 'shiftKey':
            keys.shiftKey.pressed = false
            lastKey = 'shiftKey'
            break
    }
})

function menu() {
    footer = document.querySelector('#footerButton')
    footer.addEventListener('click', (e) => {
        if(e && clicked === false) {
            clicked = true
            document.querySelector('#Inventory').style.display = "block"
            document.querySelector('#footerButton').innerHTML = '         -'
        } 
        else if (e && clicked === true) {
            clicked = false
            document.querySelector('#Inventory').style.display = "none"
            document.querySelector('#footerButton').innerHTML = 'Inventory^'
        }
    })
}