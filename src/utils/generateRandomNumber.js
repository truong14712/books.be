function generateRandomNumber() {
  const min = 1e12;
  const max = 1e13 - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default generateRandomNumber;
