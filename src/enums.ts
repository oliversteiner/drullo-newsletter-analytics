export const enum TaskStatus {
  DEFAULT = 'default',
  WAITING = 'waiting',
  WORKING = 'working',
  DONE = 'done',
  WARNING = 'warning',
  ERROR = 'error',
}

export const enum TaskStatusMessage {
  DEFAULT = 'bereit',
  WAITING = 'wartet...',
  WORKING = 'wird ausgeführt...',
  DONE = 'beendet',
  WARNING = 'beendet mit Fehlern',
  ERROR = 'nicht ausgeführt',
}

export const enum EnumsSubscriberStatus {
  NONE = 'none', // white outline
  SEND = 'send', // white full
  OPEN = 'open', // green
  ERROR = 'error', // red ( email-address invalide)
  UNSUBSCRIBE = 'unsubscribe', // viollet
  WARNING = 'warning', // orange (not definded)
}
