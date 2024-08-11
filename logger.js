class Logger {
    static levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

    static currentLevel = Logger.levels.DEBUG;

    static log(message, level = Logger.levels.DEBUG) {
        if (level >= Logger.currentLevel) {
            console.log(`${new Date().toISOString()} - LOG: ${message}`);
        }
    }

    static info(message) {
        this.log(`INFO: ${message}`, Logger.levels.INFO);
    }

    static warn(message) {
        this.log(`WARNING: ${message}`, Logger.levels.WARN);
    }

    static error(message) {
        this.log(`ERROR: ${message}`, Logger.levels.ERROR);
    }

    static setLevel(level) {
        Logger.currentLevel = level;
    }
}


export default Logger;
