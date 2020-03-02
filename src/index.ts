
import { config } from "dotenv"
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import path from "path";
import program from 'commander';

// Load .env file
config
const version = process.env.npm_package_version || 'unknown';


// define CLI parameters
program
  .version(version)

program
  .command('upload <file>')
  .description('Upload an srr file to srrdb.')
  .action(function (files) {
    console.log("Uploading file...");
  });

program
  .command('get-login')
  .description('Logging in to srrdb and getting the login cookie.')
  .action(function () {
    console.log("Executing get-login...");
  });

program.parse(process.argv);

console.log("end of script")
process.exit(1)

const files = process.argv.slice(2);
const cookie = process.env.COOKIE;

const backfillFolder = "backfill";

const url = "https://www.srrdb.com/release/upload"

if (!fs.existsSync(backfillFolder)) {
  fs.mkdir(backfillFolder, { recursive: true }, err => { });
}

const fileSizeOk = (file: string) => {
  var stats = fs.statSync(file);
  if (stats["size"] >= 52428800) {
    return false;
  } else {
    return true;
  }
};

const srrUpload = (file: string) => {
  let retries = 0;
  const fileName = path.basename(file);
  const file_data = fs.readFileSync(file);

  if (fileSizeOk(file)) {
    const form = new FormData();
    form.append("files[]", file_data, fileName);

    axios({
      url: url,
      method: "post",
      data: form,
      headers: {
        "Content-Type": `multipart/form-data; boundary=--${form.getBoundary()}`,
        "Content-Length": form.getLengthSync(),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0",
        //"Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        //"Accept-Encoding": "plain",
        //"Connection": "keep-alive",
        "Cookie": cookie,
      }
    })
      .then(function (response) {
        //handle success
        console.log(
          `${response.status} ${response.statusText} Success uploading file ${file}`
        );
        console.log(response);
        console.log(response.data);
      })
      .catch(function (response) {
        console.log(
          `${response.status} ${response.statusText} Error uploading file ${file}`
        );
        console.log(response);
      });
  }
};

files.forEach(file => {
  srrUpload(file);
});
