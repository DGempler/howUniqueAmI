var utils = {
  calculateAge: calculateAge,
  getDateObject: getDateObject,
  returnAPI: returnAPI
};

function calculateAge(birthday) {
  var ageDifferenceMilliseconds = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifferenceMilliseconds);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getDateObject(bDay) {
  var jsBDay = new Date(bDay.slice(0,4), Number(bDay.slice(5, 7)) -1, bDay.slice(8,10));
  var today = new Date();
  var dateObj = {};
  dateObj.year = today.getFullYear();
  dateObj.dd = today.getDate();
  dateObj.mm = today.getMonth()+1;
  dateObj.age = calculateAge(jsBDay);
  return dateObj;
}

function returnAPI(qId, answer) {
  if (qId === 1) {
    var url = library[qId].url;
    return [url[0] + answer.year + url[1] + answer.age + url[2],
            url[3] + answer.year + url[4] + answer.mm + url[5] + answer.dd + url[6]];
  } else {
    return library[qId].url;
  }
}

module.exports = utils;