import { expect } from 'chai';
import { describe, it } from 'mocha';
// import sinon from 'sinon';


import {  extractUid } from '../utils'

describe('extractUid', () => {
    it('Should return the uid', () => {
        expect(extractUid('uid=100; expires=Mon, 18-Oct-2021 04:15:34 GMT; Max-Age=31536000; path=/')).to.equal(100)
    });
});