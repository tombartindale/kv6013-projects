// const preferences = require("./preferences.json");
const fs = require("fs").promises;
const _ = require("lodash");
const xlsx = require("xlsx");

async function go() {
  const spreadSheet = xlsx.read(await fs.readFile("./allocation.xlsx"), {
    raw: true,
  });

  //   console.log(spreadSheet.SheetNames);

  let preferences = xlsx.utils.sheet_to_json(spreadSheet.Sheets["Preferences"]);

  let allocation = {};

  const projects = xlsx.utils.sheet_to_json(spreadSheet.Sheets["Projects"]);

  //allocate all targeted projects
  for (let pro of projects) {
    // console.log(pro);
    if (pro.TargetedStudents) {
      allocation[pro.ID] = {
        TargetedStudent: pro.TargetedStudents,
      };
      //lookup student and remove them from preference list:
      preferences = _.reject(
        preferences,
        (f) => f.DisplayName == pro.TargetedStudents
      );
    }
  }

  console.log(projects);

  //allocated all first preferences (until full)

  //allocated

  let firstPro = _.groupBy(preferences, "FirstPreference");

  //   for (let first of firstPro) {
  //     console.log(first);
  //   }

  for (let pro of projects) {
    //normal project:
    if (!pro.TargetedStudents) {
      try {
        let prefs = _.map(firstPro[pro.ID], "studentid");
        // console.log(firstPro[pro.ID]);
        allocation[pro.ID] = firstPro[pro.ID];
      } catch {}
    }
  }

  let supervisors = _.groupBy(projects, "Supervisor");

  //   console.log(supervisors);

  //for each project, get title and name of supervisor:
  let output = "";

  output += `"Project","Max. Students","Targeted Student","Possible Student","Possible Student","Possible Student","Possible Student","Possible Student","Possible Student"`;

  for (let supervisor of Object.keys(supervisors)) {
    output += `\r\n\r\n${supervisor}\r\n\r\n`;
    for (let project of supervisors[supervisor]) {
      output += `"${project.Title}","${project["Max. Number of students who could work on this project"]}",`;

      //   console.log(project);

      //   console.log(allocation[project.ID]);
      if (allocation[project.ID]?.TargetedStudent)
        output += `"${allocation[project.ID].TargetedStudent}",`;
      else {
        output += `"",`;
        if (allocation[project.ID])
          for (let student of allocation[project.ID]) {
            // console.log(student);
            output += `"${student.DisplayName} (${student.course})",`;
          }
      }

      //for each student as first choice:
      //   console.log(project);
      // if ()
      output += `\r\n`;
    }
  }

  //   console.log(output);

  await fs.writeFile("./allocation.csv", output);
}

go();
