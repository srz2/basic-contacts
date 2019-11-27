const mocha = require('mocha');
const chai = require('chai');

describe('Enviornment File', function() {
    const fs = require('fs');
    it('.env exists', function() {
        chai.assert.isTrue(fs.existsSync('.env'), "Enviornemtn File Does Not Exist");
    })
});