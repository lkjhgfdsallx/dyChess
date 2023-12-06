import Matter from '../libs/matter.js'

export default class Border {
    constructor(world) {
        this.world = world
    }
    generateBorder() {
        let bottomHeight = 80
        let leftWidth = 60
        const borderBottom = Matter.Bodies.rectangle(
            canvas.width / 2, canvas.height + 30,
            canvas.width, bottomHeight, {
            isStatic: true,
            render: {
                visible: false
            }
        })
        const borderTop = Matter.Bodies.rectangle(
            canvas.width / 2, 0,
            canvas.width, bottomHeight, {
            isStatic: true,
            render: {
                visible: false
            }
        })
        const borderLeft = Matter.Bodies.rectangle(
            -20, canvas.height / 2,
            leftWidth, canvas.height, {
            isStatic: true,
            render: {
                visible: false
            }
        })
        const borderRight = Matter.Bodies.rectangle(
            canvas.width + 20, canvas.height / 2,
            leftWidth, canvas.height, {
            isStatic: true,
            render: {
                visible: false
            }
        })
        Matter.World.add(this.world, [borderBottom, borderLeft, borderRight])
    }
}
