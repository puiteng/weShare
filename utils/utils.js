const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);
const colorsArr = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange",
  "brown",
  "grey",
  "blueGrey"
];
const numberArr = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const generateRandomColor = () =>
  colorsArr[Math.floor(Math.random() * colorsArr.length)];
const generateRandomNumber = () =>
  numberArr[Math.floor(Math.random() * numberArr.length)];
const generateAvatarDisplayText = name => {
  if (!isEmpty(name)) {
    return name
      .charAt(0)
      .toString()
      .toUpperCase();
  } else {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
      .toString()
      .toUpperCase();
  }
};

module.exports = {
  isEmpty,
  colorsArr,
  numberArr,
  generateRandomColor,
  generateRandomNumber,
  generateAvatarDisplayText
};
