const express = require("express");
const app = express();
// const port = 3000;
// const bodyParser = require("body-parser");
const functions = require("firebase-functions");

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const Handlebars = require("handlebars");

const mapping = require("./mapping.json");

function transformVars(varsIn) {
  const output = {};

  varsIn = { ...varsIn.form, student: varsIn.student.value[0] };

  // console.log(mapping);

  for (let key of Object.keys(mapping)) {
    // console.log(key);
    try {
      let data = varsIn[key];
      try {
        data = JSON.parse(varsIn[key]);
      } catch {
        //error
      }
      output[mapping[key].name] = data;
    } catch {
      output[key] = varsIn[key];
    }
  }
  output.afiles = [];
  try {
    let ff = JSON.parse(output.additional_files);
    // output.add_files = [];

    for (let f of ff) {
      afiles.push({
        name: f.name,
        link: f.link,
      });
    }
  } catch {
    //no files
  }

  output.rfiles = [];
  try {
    let fd = JSON.parse(output.risk_files);
    // output.add_files = [];

    for (let f of fd) {
      rfiles.push({
        name: f.name,
        link: f.link,
      });
    }
  } catch {
    //no files
  }

  if (_.some(output.collection_methods, (r) => _.includes(r, "video"))) {
    output.video = true;
  }

  if (_.some(output.collection_methods, (r) => _.includes(r, "audio"))) {
    output.audio = true;
  }

  if (
    _.some(output.collection_methods, (r) =>
      _.includes(r, "assisted transcription")
    )
  ) {
    output.thirdparty = true;
  }

  if (
    _.includes(
      output.no_data,
      "I am not using any data that has come from a person at any point"
    )
  ) {
    output.no_humans = true;
  }

  if (_.includes(output.no_data, "secondary")) {
    output.is_secondary = true;
  }

  if (output.full_ethics == "Yes") {
    output.needs_full_ethics = true;
  }

  if (_.includes(output.storage_procedure, "standard university procedure")) {
    output.default_storage = true;
  } else output.default_storage = false;

  return {
    ...output,
    student_name: output.student.DisplayName,
  };
}

// app.use(bodyParser.json());

app.post("/dump", (req, res) => {
  fs.writeFileSync("projects.json", JSON.stringify(req.body));
  return res.send();
});

app.post("/markdown", (req, res) => {
  //render PDF based on the information sent:

  console.log(req.body);
  console.log(transformVars(req.body));

  if (process.env.FUNCTIONS_EMULATOR === "true")
    fs.writeFileSync(
      path.resolve(__dirname, "test_data.json"),
      JSON.stringify(req.body)
    );

  // const result = renderDoc("consent.docx", req.body);
  // let output = "";

  const approval = fs.readFileSync(
    path.resolve(__dirname, "templates", "approval.hbs")
  );
  const template = Handlebars.compile(approval.toString());

  // for (let q in req.body) {
  //   output += `***${q}***\n${req.body[q]}\n\n`;
  // }

  return res.send(template(transformVars(req.body)));
});

app.post("/summary", (req, res) => {
  //render PDF based on the information sent:

  console.log(req.body);
  console.log(transformVars(req.body));

  const result = renderDoc("summary.docx", transformVars(req.body));

  //DEBUG:
  if (process.env.FUNCTIONS_EMULATOR === "true")
    fs.writeFileSync(path.resolve(__dirname, "summary_test.docx"), result);

  return res.send(result);
});

app.post("/consent", (req, res) => {
  //render PDF based on the information sent:

  // console.log(req.body);
  console.log(req.body);
  console.log(transformVars(req.body));

  // console.log(transformVars(req.body));

  const result = renderDoc("consent.docx", transformVars(req.body));

  //DEBUG:
  if (process.env.FUNCTIONS_EMULATOR === "true")
    fs.writeFileSync(path.resolve(__dirname, "consent_test.docx"), result);

  return res.send(result);
});

app.post("/info", (req, res) => {
  //render PDF based on the information sent:

  console.log(process.env.FUNCTIONS_EMULATOR);

  console.log(req.body);
  console.log(transformVars(req.body));

  const result = renderDoc("info.docx", transformVars(req.body));

  //DEBUG:
  if (process.env.FUNCTIONS_EMULATOR === "true")
    fs.writeFileSync(path.resolve(__dirname, "info_test.docx"), result);

  return res.send(result);
});

// app.listen(port, () => {
//   console.log(`PDF Renderer running on ${port}`);
// });

function renderDoc(name, data) {
  // PizZip is required because docx/pptx/xlsx files are all zipped files, and
  // the PizZip library allows us to load the file in memory

  // Load the docx file as binary content
  const content = fs.readFileSync(
    path.resolve(__dirname, "templates", name),
    "binary"
  );

  // Unzip the content of the file
  const zip = new PizZip(content);

  // This will parse the template, and will throw an error if the template is
  // invalid, for example, if the template is "{user" (no closing tag)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
  doc.render(data);

  // Get the zip document and generate it as a nodebuffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  // buf is a nodejs Buffer, you can either write it to a
  // file or res.send it with express for example.
  //   fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
  return buf;
}

exports.app = functions.region("europe-west2").https.onRequest(app);
