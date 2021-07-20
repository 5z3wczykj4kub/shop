const { pageNumberIsValid } = require('./product');

test("should return true if the argument is an integer and it's value is more than 1", () => {
  expect(pageNumberIsValid(3.14)).toBeFalsy();
  expect(pageNumberIsValid('3')).toBeFalsy();
  expect(pageNumberIsValid(3)).toBeTruthy();
});
