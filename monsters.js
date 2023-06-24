const monsters = {
    cat: {
        position: {
            x: 400,
            y: 600
        },
        image: {
            src:'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/satidle.png'
        },
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        name: 'Cat',
        attacks: [attacks.Scratch, attacks.Swiftswipe]
    },
    hostile: {
        position: {
            x: 1250,
            y: 470
        },
        image: {
            src:'F:/Code/VSCode/JavaScript/JavaScript Projects/JavaScriptGame/Assets/hostile.png'
        },
        frames: { //Hostile image cropping
            max: 1, //However many frames are in the sprite
            hold: 30
        },
        animate: true,
        isEnemy: true,
        name: 'Hostile',
        attacks: [attacks.Scratch, attacks.Swiftswipe]
    }
}