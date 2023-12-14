let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if (instance) return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src = 'audio/bgm.mp3'

    this.clickAudio = new Audio()
    this.clickAudio.src = 'audio/click.wav'

    this.selectAudio = new Audio()
    this.selectAudio.src = 'audio/select.wav'

    // this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playClick() {
    this.clickAudio.currentTime = 0
    this.clickAudio.play()
  }

  playSelect() {
    this.selectAudio.currentTime = 0
    this.selectAudio.play()
  }
}
