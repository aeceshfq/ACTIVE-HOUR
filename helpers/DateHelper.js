const nextDate = (minutesToAdd = 5, secondsToAdd = 0) => {
    // Current date and time
    const currentDate = new Date();
    // Calculate the next date by adding minutes and seconds
    const nextDate = new Date(currentDate.getTime() + (minutesToAdd * 60 * 1000) + (secondsToAdd * 1000));
    return nextDate;
}

const NextDueDate = (daysToAdd = 1) => {
    // Current date and time
    const currentDate = new Date();
    // Calculate the next date by adding days
    const nextDate = new Date(currentDate.getTime() + (daysToAdd * 1440 * 60 * 1000));
    return nextDate;
}

const minDiff = (startDate, endDate) => {
    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;
    // Convert milliseconds to minutes
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return minutesDifference;
}

const DiffMinutes = (startDate, endDate = new Date()) => {
    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;
    // Convert milliseconds to minutes
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return minutesDifference;
}


const DiffSeconds = (startDate, endDate = new Date()) => {
    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;
    // Convert milliseconds to minutes
    const minutesDifference = Math.floor(timeDifference / (1000));
    return minutesDifference;
}

const isExpired = (endDate) => {
    const startDate = new Date();
    if (minDiff(startDate, endDate) > 0) {
        return false
    }
    return true;
}

function UnixTimeToDateTime(unixTimestamp) {
  // Create a new Date object with the Unix timestamp in milliseconds
  const date = new Date(unixTimestamp * 1000);
  return date;
}

function UnixTimestamp(duration = 15, durationType = "MIN") {
  // durationType > DAYS, HRS, MIN, SEC
  const now = Date.now(); // Current timestamp in milliseconds
  // Define conversion factors for different duration types
  const conversionFactors = {
    "DAYS": 24 * 60 * 60 * 1000, // Convert days to milliseconds
    "HRS": 60 * 60 * 1000,        // Convert hours to milliseconds
    "MIN": 60 * 1000,             // Convert minutes to milliseconds
    "SEC": 1000                   // Convert seconds to milliseconds
  };

  // Convert duration to milliseconds based on the specified unit
  const durationInMilliseconds = duration * (conversionFactors[durationType.toUpperCase()] || conversionFactors["MIN"]);

  // Calculate the future timestamp
  const futureTimestamp = now + durationInMilliseconds;

  const timeNow = Math.floor(futureTimestamp / 1000); // Convert to seconds

  return timeNow;
}

function Timestamps(duration = 15, durationType = "MIN") {
  // Define conversion factors for different duration types
  const conversionFactors = {
    "DAYS": 24 * 60 * 60 * 1000, // Convert days to milliseconds
    "HRS": 60 * 60 * 1000,        // Convert hours to milliseconds
    "MIN": 60 * 1000,             // Convert minutes to milliseconds
    "SEC": 1000                   // Convert seconds to milliseconds
  };

  // Convert duration to milliseconds based on the specified unit
  const durationInMilliseconds = duration * (conversionFactors[durationType.toUpperCase()] || conversionFactors["MIN"]);

  // Calculate different time units
  const milliseconds = durationInMilliseconds;
  const seconds = durationInMilliseconds / 1000; // Convert milliseconds to seconds
  const minutes = durationInMilliseconds / (1000 * 60); // Convert milliseconds to minutes
  const hours = durationInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
  const days = durationInMilliseconds / (1000 * 60 * 60 * 24); // Convert milliseconds to days

  return {
    milliseconds, seconds, minutes, hours, days
  };
}

function previousDate({
  days = 0,
  months = 0,
  years = 0,
  minutes = 0,
  hours = 0,
  seconds = 0,
} = {}) {
  const currentDate = new Date();
  return new Date(
    currentDate.getFullYear() - years,
    currentDate.getMonth() - months,
    currentDate.getDate() - days,
    currentDate.getHours() - hours,
    currentDate.getMinutes() - minutes,
    currentDate.getSeconds() - seconds
  );
}

function today(){
  return new Date();
}

function ISOStringDate(date){
  return new Date(new Date(new Date(date || today()).toISOString().split('T')[0]).toISOString());
}

function timestampNow(){
  return new Date().toISOString().replace(/[-T.:]/g, '').slice(0, -5);
}

function generateTimestamp() {
    const maxDifference = 7200 * 1000; // Maximum difference allowed is 7200 seconds, converted to milliseconds

    // Get current UTC time in milliseconds
    const currentUTCTime = new Date().getTime();

    // Generate a random value within the range of 0 to maxDifference
    const randomDifference = Math.floor(Math.random() * maxDifference);

    // Generate a random boolean to decide whether to add or subtract the randomDifference
    const addDifference = Math.random() < 0.5;

    // Apply the random difference
    const adjustedTime = addDifference ? currentUTCTime + randomDifference : currentUTCTime - randomDifference;

    return adjustedTime.toString(); // Convert adjusted time to string
}


const DateHelper = {
    nextDate, minDiff, isExpired, NextDueDate, DiffMinutes, UnixTimestamp, previousDate, today, ISOStringDate, DiffSeconds, timestampNow, generateTimestamp, Timestamps
}


module.exports = DateHelper;