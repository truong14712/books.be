function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
export function generateRandomCode(length) {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const randomString = generateRandomString(length - randomNumber.toString().length);
  return randomNumber.toString().padStart(6, '0') + randomString;
}
