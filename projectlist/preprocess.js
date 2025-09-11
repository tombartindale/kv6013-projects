const data = require("./data/projects.json");
const fs = require("fs");
const _ = require("lodash");

let newdata = [];

//strip out fields from data:

newdata = _.filter(data, (f) => f.TargetedStudents.length == 0);

for (let d of newdata) {
  newdata.push(_.omit(d, ["TargetedStudents", "TargetedStudents#Claims"]));
}

newdata = _.filter(newdata, "Approved");

//save back data:
fs.writeFileSync("./data/projects.json", JSON.stringify(newdata));
