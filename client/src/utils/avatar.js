import isEmpty from "../validation/is_empty";
import isEqual from "../validation/is_equa";
export const colorsArr = [
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

export const numberArr = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const generateRandomColor = friends => {
  if (!isEmpty(friends)) {
    let newColorArr = [...colorsArr];
    friends.forEach(friend => {
      const index = newColorArr.indexOf(friend.avatar.backgroundColor);
      newColorArr.splice(index, 1);
    });
    return newColorArr[Math.floor(Math.random() * colorsArr.length)];
  }
  return colorsArr[Math.floor(Math.random() * colorsArr.length)];
};

export const generateRandomNumber = () => {
  return numberArr[Math.floor(Math.random() * numberArr.length)];
};

export const generateAvatarDisplayText = (name, existingTexts) => {
  if (!isEmpty(name)) {
    const firstLetter = name
      .charAt(0)
      .toString()
      .toUpperCase();
    if (existingTexts && existingTexts.indexOf(firstLetter) >= 0) {
      return name.substring(0, 2).toUpperCase();
    }
    return firstLetter;
  } else {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
      .toString()
      .toUpperCase();
  }
};

export const checkDuplicateAvatar = (avatars, newAvatar) => {
  let isDuplicated = false;
  avatars.forEach(avatar => {
    isDuplicated = isEqual(avatar, newAvatar) || isDuplicated;
  });
  return isDuplicated;
};
