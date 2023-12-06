import Matter from '../libs/matter.js'

export default class Collide {
    constructor(engine) {
        this.engine = engine
    }
    getCollide() {
        Matter.Events.on(this.engine, 'collisionStart', function (event) {
            const pairs = event.pairs
            pairs.forEach(pair => {
                // console.log(pair)
            })
        })
    }
    isCollideWith(sp1,sp2) {
        const spX = sp2.positionPrev.x + 10
        const spY = sp2.positionPrev.y + 10
        const distanceX = spX - (sp1.positionPrev.x + 10)
        const distanceY = spY - (sp1.positionPrev.y + 10)
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        return distance <= 20
    }
}
