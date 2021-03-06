// @ts-nocheck
const testSwitch = (value) => {
  let temp = 0;
  switch (value) {
    case 0:
      temp = 6;
      break;
    case 1:
      temp = 5;
      break;
      temp = 2;
    case 2:
      temp = 3;
      return 4;
    case 3:
      temp += 1;
    case 4:
      temp += 1;
      break;
    case 5:
      temp += 1;
    default:
      temp += 1;
  }

  return temp;
};

it("should handle default", () => {
  expect(testSwitch(-1)).toEqual(1);
});

it("should handle break", () => {
  expect(testSwitch(0)).toEqual(6);
  expect(testSwitch(1)).toEqual(5);
});

it("should handle fallthrough", () => {
  expect(testSwitch(3)).toEqual(2);
});

it("should fallthrough to default", () => {
  expect(testSwitch(5)).toEqual(2);
});

it("should handle return", () => {
  expect(testSwitch(2)).toEqual(4);
});
