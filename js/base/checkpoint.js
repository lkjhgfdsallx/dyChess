export default class Checkpoint {
    constructor() {
        this.clasli = tt.getStorageSync("clasli") || 0
        this.clasliNum = []
    }

    /**
    * 进行游戏
    */
    playGame(num, clasliNum) {
        this.clasliNum = clasliNum
        if (num !== null || undefined) {
            this.clasli = num
        }
        play.init(4, clasliNum[this.clasli].map)
    }

    /**
    * 保存当前关卡数
    */
    saveLevelNum() {
        tt.setStorageSync("clasli", this.clasli)
    }

    /**
    * 进入下一关
    */
    increase() {
        if (this.clasli >= this.clasliNum.length - 1) {
            this.clasli = 0
        } else {
            this.clasli = parseInt(this.clasli) + 1
        }
        this.saveLevelNum()
        play.init(4, this.clasliNum[this.clasli].map)
    }
}
