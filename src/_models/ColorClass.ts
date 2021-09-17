export interface Color {
  send: ColorItemInterface
  open: ColorItemInterface
  unsubscribe: ColorItemInterface
  error: ColorItemInterface
}

export interface ColorItemInterface {
  border: string
  background: string
}

export default class ColorClass implements Color {
  public send: ColorItemInterface
  public open: ColorItemInterface
  public unsubscribe: ColorItemInterface
  public error: ColorItemInterface

  public constructor() {
    this.send = {
      border: 'rgba(255,255,255,0.21)',
      background: 'rgba(255,255,255,0.13)',
    }

    this.open = {
      border: 'rgba(27,145,0,0.9)',
      background: 'rgba(0,255,81,0.5)',
    }

    this.unsubscribe = {
      border: 'rgba(128,0,128,0.9)',
      background: 'rgba(128,0,128,0.5)',
    }

    this.error = {
      border: 'rgba(255,12,7,0.9)',
      background: 'rgba(255,0,47,0.5)',
    }
  }
}

