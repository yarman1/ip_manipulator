'use strict';

const ipMain = require('../ip-manipulator');
const assert = require('assert').strict;

// Tests of validation system.
// It can validate: decimal and hexadecimal(isn't case sensitive) IPv4 addresses
// IPv6: native, link local, mapped, IPv4 embedded variants

const tester = function(data, testOp, resultArray, obj, funcName, property) {
  for (const test of data) {
    const [par, expected, name] = test;
    const result = property ? obj[funcName](par)[property] : obj[funcName](par);
    try {
      assert[testOp](result, expected, `Error in test "${name}"`);
    } catch (err) {
      const { message, operator } = err;
      resultArray.push({ message, par, expected, result, operator });
    }
  }
};

{
  console.log('Validation tests');
  const results = [];

  const validationIpv4Tests = [
    ['192.168.0.1', true, 'Valid decimal IPv4 address'],
    ['256.255.255.255', false, 'Invalid decimal IPv4 address'],
    ['c0.A8.0.1', true, 'Valid hexadecimal IPv4 address'],
    ['0xc0.0xA8.0x0.0x1', true, 'Another example of valid hex IPv4 address'],
    ['ac.10.8e.fff', false, 'Invalid hexadecimal IPv4 address'],
  ];

  tester(validationIpv4Tests, 'strictEqual', results, ipMain.IPv4, 'isValid');

  const validationIpv6Tests = [
    ['2001:0db8::8A2e:07a0:765d', true, 'Valid IPv6 native address'],
    ['fd3f::c126:9e70:532f::', false, 'Invalid IPv6 native address'],
    ['fddf:ebc3:cfcff::65ce:f32a', false, 'Another bad IPv6 native address'],
    ['fe80::ce80:ff88%eth2', true, 'Link local IPv6 address'],
    ['::ffff:192.168.0.1', true, 'Mapped IPv6 address'],
    ['64:ff96:1:a345:c70:2cfa:192.168.0.1', true, 'IPv4 embedded IPv6 address'],
  ];

  tester(validationIpv6Tests, 'strictEqual', results, ipMain.IPv6, 'isValid');

  console.table(results);

}
