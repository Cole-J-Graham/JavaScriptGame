const battleBackgroundImage = new Image()
battleBackgroundImage.src = 'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/battle background.png'
const battleBackground = new Sprite({position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let cat
let hostile
let renderedSprites
let queue

let exp = 0
let expNext = 100
let level = 1

//Id for animation frame to cancel at will
let battleAnimationId

function levelUp() {
    //Increase Exp
    exp += Math.floor(Math.random() * 6) + 25
    //Set the increased exp bar appearance
    document.querySelector('#expStatBar').style.width = exp + '%'
    document.querySelector('#dialogueBox').innerHTML = this.name + ' Exp increased! ' + exp + '/' + expNext
    if(exp >= expNext) {
        level++
        exp = 0
        expNext = 100
        document.querySelector('#expStatBar').style.width = '0%'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' Level up! ' + level
        document.querySelector('#expText').innerHTML = 'Level: ' + level
    }
}

let items = []
let memoryFiberInit = false
let goldInit = false
const item = document.createElement('button')


function loot() {
    let gold = new Item ({
        name: 'Gold',
        quantity: this.quantity,
        value: 1,
        rarity: 'Customary'
    })

    let memoryFiber = new Item({
        name: 'Memory Fiber',
        quantity: this.quantity,
        value: 5,
        rarity: 'Customary'
    })

    if(memoryFiberInit === false) {
        items.push(memoryFiber)
    }

    if(goldInit === false) {
        items.push(gold)
    }

    //Create buttons depending on what buttons are already created and which aren't
    if(goldInit === false || memoryFiberInit === false) {
        memoryFiberInit = true
        goldInit = true
        items.forEach((items) => {
            //ERROR = forEach has no proper way to generate a button for each member of the array... Yet...
            items.quantity += Math.floor(Math.random() * 6) + 10
            item.innerHTML = items.name + ' x' + items.quantity
            document.querySelector('#inventory').append(item)
        })
    } else {
        items.forEach((items) => {
            items.quantity += Math.floor(Math.random() * 6) + 10
            item.innerHTML = items.name + ' x' + items.quantity
        })
    }
}

function mapTransition() {
    queue.push(() => {
        // fade back to black
        gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
                //Return to map
                cancelAnimationFrame(battleAnimationId)
                animate()
                //Hide combat UI
                document.querySelector('#userInterface').style.display = 'none'
                //Set div opacity to '0' to make map visible again
                gsap.to('#overlappingDiv', {
                    opacity: 0
                })
                //Enable movement again
                battle.initiated = false
            }
        })
    })
}

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()


    hostile = new Monster(monsters.hostile)
    cat = new Monster(monsters.cat)
    renderedSprites = [hostile, cat]
    queue = []

    //Creating attack buttons based off of sprite attack data
    cat.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    //Event listeners for buttons (attack)
document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
        //Selecting specific attack data from button press
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        //Player Attacking

        cat.attack({
            attack: selectedAttack,
            recipient: hostile,
            renderedSprites
        })
        
        if(hostile.health <= 0) {
            levelUp()
            loot()
            queue.push(() => {
                hostile.faint()
            })
            mapTransition()
        }
        
        //Randomizing hostile attack
        const randomAttack = hostile.attacks[Math.floor(Math.random() * hostile.attacks.length)]
        //Hostile Attacking
        queue.push(() => {
            hostile.attack({
                attack: randomAttack,
                recipient: cat,
                renderedSprites
            })
            if(cat.health <= 0) {
                queue.push(() => {
                    cat.faint()
                })
                mapTransition()
            }
        })
    })
    
    //Check if mouse is hovered over button and display attack type
    button.addEventListener('mouseenter', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack.type
        document.querySelector('#attackType').style.color = selectedAttack.color
    })
})
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    console.log(battleAnimationId);

    renderedSprites.forEach(sprites => {
        sprites.draw()
    })
}

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    //Queue grabbing enemy attack
    if(queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})