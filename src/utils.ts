const MAX_LEN = 6;

export const generateID = () => {
  let ans = "";
  const subsetString = "1234567890abcdefghijklmnopgrstuvwxyz";
  for (let i = 0; i < MAX_LEN; i++) {
    ans += subsetString[Math.floor(Math.random() * subsetString.length)];
  }

  return ans;
};
