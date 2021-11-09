require("colors");
const moment = require("moment");

const EventEmitter = require("events");
const emitter = new EventEmitter();

const validateInput = (input) => {
  let result = true;
  for (let i = 0; i < input.length; i++) {
    const regex = /^[0-5][0-9]-[0-5][0-9]-[0-3][0-9]-[0-1][0-9]-[2-9][0-9]{3}$/;
    result *= regex.test(input[i]);
  }
  return !!result;
};

const splitInput = (input) => {
  let splittedTimers = [];
  for (let i = 0; i < input.length; i++) {
    splittedTimers.push(input[i].split("-"));
  }
  return splittedTimers;
};

const validateDate = (yyyy, mm, dd) => {
  const checkDate = new Date(yyyy + "-" + mm + "-" + dd);
  const realDate =
    checkDate.getFullYear() +
    ("0" + (checkDate.getMonth() + 1)).slice(-2) +
    ("0" + checkDate.getDate()).slice(-2);
  return !!(yyyy + mm + dd === realDate);
};

const validateTimersArry = (splitedTimersArray) => {
  let result = true;
  for (let i = 0; i < splitedTimersArray.length; i++) {
    result *= validateDate(
      splitedTimersArray[i][4],
      splitedTimersArray[i][3],
      splitedTimersArray[i][2]
    );
  }
  return !!result;
};

const getTimestamp = ([minutes, hours, date, month, year]) => {
  const timerdate = new Date(year, month - 1, date, hours, minutes, 0);
  return timerdate.getTime();
};

const validateNow = (splitedTimersArray) => {
  let result = true;
  for (let i = 0; i < splitedTimersArray.length; i++) {
    const isTrue =
      Date.now() < getTimestamp(splitedTimersArray[i]) ? true : false;
    result *= isTrue;
  }
  return !!result;
};

const fillTimersArr = (splitedTimersArray) => {
  let result = [];
  splitedTimersArray.forEach((element) => {
    result.push(getTimestamp(element) - Date.now());
  });
  return result;
};

const renderTimers = () => {
  console.clear();
  for (let i = 0; i < timers.length; i++) {
    if (Math.floor(timers[i] / 1000) === 0)
      console.log(` Timer#${i}: `.black.bgMagenta, "\nFinished");
    else
      console.log(
        ` Timer#${i}: `.black.bgCyan,
        `\n${moment.duration(timers[i]).years()} years,`,
        `${moment.duration(timers[i]).months()} months,`,
        `${moment.duration(timers[i]).days()} days,`,
        `${moment.duration(timers[i]).hours()} hours,`,
        `${moment.duration(timers[i]).minutes()} minutes,`,
        `${moment.duration(timers[i]).seconds()} seconds left`
      );
  }
};

const aSecondGone = async () => {
  let workingTimers = timers.length;
  for (let i = 0; i < timers.length; i++) {
    if (Math.floor(timers[i] / 1000) !== 0) timers[i] -= 1000;
    else workingTimers--;
  }

  emitter.emit("secondGone");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (workingTimers !== 0) await aSecondGone();
};

emitter.on("secondGone", renderTimers);

const timersArray = process.argv.slice(2);
const splitedTimersArray = splitInput(timersArray);
const timers = fillTimersArr(splitedTimersArray);

if (!validateInput(timersArray)) {
  console.log(
    " Please, enter timer date in mm-hh-dd-mm-yyyy format. You can enter several timers divided by space. "
      .black.bgRed
  );
} else if (!validateTimersArry(splitedTimersArray)) {
  console.log(" Please, enter the correct date. ".black.bgBlue);
} else if (!validateNow(splitedTimersArray)) {
  console.log(" Timers are not supposed to be in the past. ".black.bgMagenta);
} else {
  aSecondGone();
}
