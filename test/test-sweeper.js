//  -*- coding: utf-8 -*-
//  test-sweeper.js ---
//  created: 2017-08-11 08:09:39
//

'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');
const expect = Code.expect;
const Sweeper = require('../index');

class SP extends Sweeper {
    constructor() {
        const log = {};
        log.debug = log.error = log.warn = msg => this.logs.push(msg);
        super('TEST', 100, {log});
        this.logs = [];
        this.counter = 0;
    }

    run() {
        this.counter += 1;
        return Promise.reject('rejected');
    }
}

class SE extends Sweeper {
    constructor() {
        const log = {};
        log.debug = log.error = log.warn = msg => this.logs.push(msg);
        super('TEST', 100, {log});
        this.logs = [];
        this.counter = 0;
    }

    run() {
        this.counter += 1;
        throw new Error('argh');
    }
}

lab.experiment('Sweeper', function() {
    lab.test('New', done => {
        const sweeper = new Sweeper();
        expect(sweeper).to.be.instanceof(Sweeper);
        done();
    });

    lab.test('Run promise fails', done => {
        const sweeper = new SP();
        sweeper.start();

        setTimeout(() => {
            expect(sweeper.counter).to.be.equal(2);
            expect(sweeper.logs).to.have.length(3);
            sweeper.stop();
            done();
        }, 250);
    });

    lab.test('Run throws', done => {
        const sweeper = new SE();
        sweeper.start();

        setTimeout(() => {
            expect(sweeper.counter).to.be.equal(2);
            expect(sweeper.logs).to.have.length(3);
            sweeper.stop();
            done();
        }, 250);
    });
});

//
//  test-sweeper.js ends here
