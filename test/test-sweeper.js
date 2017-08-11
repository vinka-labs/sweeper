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

lab.experiment('Seeper', function() {
    lab.test('Placeholder', function(done) {
        const sweeper = new Sweeper();
        expect(sweeper).to.be.instanceof(Sweeper);
        done();
    });
});

//
//  test-sweeper.js ends here
