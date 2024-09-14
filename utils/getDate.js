require('express');

const getDate = (inDate) => {
  return new Promise((resolve, reject) => {
    const reg = /-/g;
    if (inDate === "" || (new Date(inDate) === "Invalid Date" || !inDate || inDate == false)) {
      let date = new Date().toDateString();
      resolve(date)
    } else {
      inDate = new Date(inDate);
      console.log("inDate provided", inDate);
      const year = inDate.getFullYear();
      const month = inDate.getMonth();
      const day = inDate.getDate() + 1;
      const date = new Date(year, month, day).toDateString()
      resolve(date);
    }
  })
};

const getDateDb = (inDate) => {
  return new Promise((resolve, reject) => {
    if (inDate === "" || (new Date(inDate) === "Invalid Date" || !inDate || inDate == false)) {
      let date = new Date();
      resolve(date)
    } else {
      let date = new Date(inDate);

      console.log("date provided", date);
      resolve(date);
    }
  })
};

module.exports = {
  getDate,
  getDateDb
};