const color = require("colors");

const [from, to] = process.argv.slice(2);
const resultColors = ["red", "yellow", "green"];

const findPrimeNum = (from, to) => {
  const result = [];
  nextPrime: for (let i = +from; i <= +to; i++) {
    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }
    result.push(i);
  }
  return result;
};

const showResult = (result) => {
  let colorNumber = 0;
  result.forEach((element) => {
    console.log(color[resultColors[colorNumber]](element));
    colorNumber++;
    if (colorNumber === resultColors.length) colorNumber = 0;
  });
};

if ((!!!from && !!!to) || Number.isNaN(+from) || Number.isNaN(+to)) {
  console.log(
    "Please, enter 2 numbers to define the diapason. Example: ".red,
    "npm run prime 2 10!".red.bgWhite
  );
} else if (+to <= +from) {
  console.log("The second number must be bigger then first".red);
} else {
  const primeNums = findPrimeNum(+from, +to);
  console.log("--- The diapason has these prime numbers: ---".black.bgWhite);
  showResult(primeNums);
}
