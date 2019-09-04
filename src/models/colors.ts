export interface ColorsInterface {
  send: ColorsItemInterface
  open: ColorsItemInterface
  unsubscribe: ColorsItemInterface
  error: ColorsItemInterface
}

export interface ColorsItemInterface {
  border: string
  background: string
}

class Colors implements ColorsInterface {
  public send: ColorsItemInterface
  public open: ColorsItemInterface
  public unsubscribe: ColorsItemInterface
  public error: ColorsItemInterface

  public constructor() {
    // TODO: add Dark-Mode switch
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

export default Colors
