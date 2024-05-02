import moment from "moment";

export function calculateDate(amount, unit) {
  const date = new Date();

  if (unit === 'days') {
    date.setDate(date.getDate() + amount);
  } else if (unit === 'weeks') {
    date.setDate(date.getDate() + amount * 7);
  } else if (unit === 'months') {
    date.setMonth(date.getMonth() + amount);
  } else if (unit === 'years') {
    date.setFullYear(date.getFullYear() + amount);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDuration(startDate, endDate) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const daysDifference = Math.round((endDate - startDate) / MS_PER_DAY);

  if (daysDifference === 0) {
    return 'Today';
  } else if (daysDifference === 1) {
    return 'Yesterday';
  } else if (daysDifference <= 7) {
    return 'Last 7 days';
  } else if (daysDifference <= 30) {
    return 'Last 30 days';
  } else if (daysDifference <= 28) {
    return 'Last 28 days';
  } else if (daysDifference <= 90) {
    return 'Last 90 days';
  } else if (daysDifference <= 120) {
    return 'Last 4 months';
  } else if (daysDifference <= 180) {
    return 'Last 6 months';
  } else if (daysDifference <= 270) {
    return 'Last 9 months';
  } else if (daysDifference <= 365) {
    return 'Last year';
  } else if (daysDifference <= 730) {
    return 'Last 2 years';
  } else {
    // Modify or add more conditions as needed for longer durations
    return 'Longer than 2 years';
  }
}

export function getPrevious3Months() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get the current date
  const currentDate = new Date();

  // Initialize an array to store the results
  const result = [];

  // Loop through the previous 3 months
  for (let i = 2; i >= 0; i--) {
    // Calculate the month index for the previous months
    const monthIndex = (currentDate.getMonth() - i + 12) % 12;

    // Get the month name, month number, and year
    const monthName = months[monthIndex];
    const monthNumber = monthIndex + 1; // Months are zero-based in JavaScript
    let year = currentDate.getFullYear();

    // Adjust the year if the calculated month is greater than the current month
    if (monthNumber > currentDate.getMonth() + 1) {
      year -= 1;
    }

    // Push the result to the array
    result.push({
      monthName: monthName,
      monthNumber: monthNumber,
      year: year,
    });
  }

  return result;
}

export function FormatDate(date){
  let d_format = "YYYY-MM-DD";
  if (date) {
    try {
      let converted = moment(date).format(d_format);
      return converted !== "Invalid date"?converted:null;
    } catch (error) {
      
    }
  }
  return null;
}

export function DateTimeNow(){
  let now = new Date();
  let dateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), 0);
  return {
    dateTime: dateTime,
    iso: dateTime.toISOString(),
    date: moment(dateTime).format("YYYY-MM-DD"),
    time: moment(dateTime).format("hh:mm:ss"),
  };
}