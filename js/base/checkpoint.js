export default class Checkpoint {
    constructor() {
        this.clasli = 0
    }
  
    /**
     * 进入下一关
     */
    nextPass() {
        console.log(this.clasli)
        play.init(4, com.clasli[this.clasli].map)
    }
    increase() {
        this.clasli = this.clasli + 1
    }
  }
  