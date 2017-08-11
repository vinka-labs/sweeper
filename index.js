//  -*- coding: utf-8 -*-
//  index.js ---
//  created: 2017-08-11 08:07:53
//

'use strict';

class Sweeper {
    constructor(name, interval, options={}) {
        this._started = false;
        this._timer = null;

        this._log = function (level, ...args) {
            if (!options.log) {
                return;
            }

            let fun = options.log[level];
            if (!fun && level === 'debug') {
                fun = options.log.log;
            }
            if (!fun) {
                throw Error(`sweeper log doesn't support '${level}' level`);
            }
            fun.call(options.log, ...args);
        };

        this.interval = interval;
        this.firstInterval = options.firstInterval || interval;
        this.name = name || String(this.constructor);
    }

    start() {
        if (!this._started) {
            this._log('debug', `sweeper ${this.name} started with interval ${this.interval}`);
            this._started = true;
            const timer = setTimeout(() => this._sweep(), this.firstInterval);
            this._timer = timer;
        } else {
            this._log('warn', `tried to start sweeper ${this.name} twice`);
        }
    }

    stop() {
        const timer = this._timer;
        if (timer) {
            this._log('debug', `timeout clear for sweeper ${this.name}`);
            clearTimeout(timer);
        }
        this._started = false;
        this._timer = null;
        this._log('debug', `sweeper ${this.name} stopped`);
    }

    wakeUp() {
        if (!this._started) {
            this._log('warn', `tried to wakeUp() ${this.name} when not started`);
            return;
        }

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        } else {
            this._log('warn', `no timer to be cleared in wakeUp() in ${this.name}`);
            return;
        }

        return this._sweep();
    }

    _sweep() {
        function next(me) {
            if (!me._started) {
                return;
            }
            const timer = setTimeout(() => me._sweep(), me.interval);
            me._timer = timer;
        }

        let ret;

        try {
            ret = this.run();
        } catch (e) {
            this._log('error', `error in ${this.name} sync poll`, e, (e || {}).stack);
        }

        if (ret && typeof ret.then === 'function') {
            ret.then(
                () => {},
                err => this._log('error', `error in ${this.name} async poll`, err, (err || {}).stack))
            .finally(() => next(this));
            return ret;
        } else {
            next(this);
        }
    }

    run() {
        throw Error(`sweeper ${this.name} must implement run()`);
    }
}

module.exports = Sweeper;

//
//  index.js ends here
