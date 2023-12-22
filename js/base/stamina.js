export default class Checkpoint {
    constructor() {
        this.stamina = tt.getStorageSync("stamina") || 0
    }

    /**
     * 体力值降低
     */
    staminaLow(num) {
        this.stamina = this.stamina - num
    }

    /**
     * 体力值增加
     */
    staminaAdd(num) {
        this.stamina = this.stamina + num
    }

    /**
     * 存储体力值
     */
    setStorage() {
        tt.setStorageSync("stamina", this.stamina)
    }
}
