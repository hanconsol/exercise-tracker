require('express');

const getDate = (inDate ) => {
    return new Promise ((resolve, reject) => {
      const reg = /-/g;
 if (inDate === "" || (new Date(inDate) === "Invalid Date" || !inDate || inDate == false ))
   {
      let date =  new Date().toDateString();
      resolve(date)
    }else {
      let newIn = inDate.replace(reg, ",")
      let date = new Date(newIn).toDateString();
      resolve(date);
    }
})
}
module.exports = getDate;