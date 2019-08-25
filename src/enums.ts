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
