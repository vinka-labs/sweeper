# Sweeper

## Usage

```javascript

const Sweeper = require('@vinka/sweeper');

class MyGreeter extends Sweeper {
    constructor() {
        super(
            'greeter',  // just name used for optional logging
            5000,  // sweep interval in milliseconds
            {
                log: require('winston'),  // optional logger
                firstInterval: 10000,     // optionally define different interval for the first sweep
            });
    }

    // this gets called in every 5000ms. after started
    run() {
        console.log('HELLO');
    }
};

const notifier = new Sweeper();
notifier.start();
setTimeout(() => notifier.stop(), 30 * 1000);

```
