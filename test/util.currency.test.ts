import { assert } from 'chai';
import { IsoCurrency } from '../server/@types/IsoCurrency';
import {
  fetchIsoCurrency,
  convertToMinorUnits,
  convertToMajorUnits,
} from '../server/util/currency';

suite('currency util', function () {
  test('should fetch a real IsoCurrency object', async function () {
    const currency = await fetchIsoCurrency('MVR');
    assert.equal(currency?.CcyNm, 'Rufiyaa');
  });

  test('should return null if not a real ISO code', async function () {
    const currency = await fetchIsoCurrency('GNAR');
    assert.isNull(currency);
  });

  test('should convert USD in dollars and cents to cents', function () {
    const isoCurrency: IsoCurrency = {
      CtryNm: 'UNITED STATES OF AMERICA (THE)',
      CcyNm: 'US Dollar',
      Ccy: 'USD',
      CcyNbr: '840',
      CcyMnrUnts: '2',
    };
    const amount = convertToMinorUnits(35.62, isoCurrency);
    assert.equal(amount, 3562);
  });

  test('should convert Jordanian Dinar with three decimals to integer', function () {
    const isoCurrency: IsoCurrency = {
      CtryNm: 'JORDAN',
      CcyNm: 'Jordanian Dinar',
      Ccy: 'JOD',
      CcyNbr: '400',
      CcyMnrUnts: '3',
    };
    const amount = convertToMinorUnits(3249.365, isoCurrency);
    assert.equal(amount, 3249365);
  });

  test('should convert USD in cents to dollars and cents', function () {
    const isoCurrency: IsoCurrency = {
      CtryNm: 'UNITED STATES OF AMERICA (THE)',
      CcyNm: 'US Dollar',
      Ccy: 'USD',
      CcyNbr: '840',
      CcyMnrUnts: '2',
    };
    const amount = convertToMajorUnits(3562, isoCurrency);
    assert.equal(amount, 35.62);
  });

  test('should convert stored integer to Jordanian Dinars', function () {
    const isoCurrency: IsoCurrency = {
      CtryNm: 'JORDAN',
      CcyNm: 'Jordanian Dinar',
      Ccy: 'JOD',
      CcyNbr: '400',
      CcyMnrUnts: '3',
    };
    const amount = convertToMajorUnits(3249365, isoCurrency);
    assert.equal(amount, 3249.365);
  });

  test('should not convert number if minor units are invalid', function () {
    const isoCurrency: IsoCurrency = {
      CtryNm: 'JORDAN',
      CcyNm: 'Jordanian Dinar',
      Ccy: 'JOD',
      CcyNbr: '400',
    };
    const majorUnit1 = convertToMajorUnits(123, isoCurrency);
    assert.equal(majorUnit1, 123);

    const minorUnit1 = convertToMinorUnits(123, isoCurrency);
    assert.equal(123, minorUnit1);

    const majorUnit2 = convertToMajorUnits(123, null);
    assert.equal(majorUnit2, 123);

    const minorUnit2 = convertToMinorUnits(123, null);
    assert.equal(123, minorUnit2);
  });
});
