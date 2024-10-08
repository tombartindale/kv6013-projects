const preferences = require("./preferences.json");
const fs = require("fs");
const _ = require("lodash");
const XLSX = require("xlsx");
const moment = require("moment");

let output = [];

// let sorted = preferences

for (let row of preferences) {
  let trans = _.pick(row, [
    "Author.Email",
    "FirstPreference",
    "Second_x0020_Preference",
    "Third_x0020_Preference",
    "Created",
    "Author.Claims",
    "Author.JobTitle",
    "Author.DisplayName",
  ]);

  pp = {
    email: trans.Author.Email,
    course: trans.Author.JobTitle,
    studentid: trans.Author.Claims.split("|")[2].split("@")[0],
    FirstPreference: trans.FirstPreference,
    SecondPreference: trans["Second_x0020_Preference"],
    ThirdPrefernece: trans["Third_x0020_Preference"],
    submitted: trans.Created,
    DisplayName: trans.Author.DisplayName,
  };

  output.push(pp);
}

// console.log(output);

const sheet = XLSX.utils.json_to_sheet(output);
const book = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(book, sheet, "Preferences");
var wopts = { bookType: "xlsx", bookSST: false, type: "buffer" };
const xlsxcontent = XLSX.write(book, wopts);
fs.writeFileSync("./scripts/preferences.xlsx", xlsxcontent);
