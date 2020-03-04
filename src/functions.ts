
import FormData from "form-data";
import axios from "axios";
import qs from 'querystring';
import fs from "fs";
import https from 'https';
import path from "path";

const httpsAgent = new https.Agent({ keepAlive: true });

export const version = process.env.npm_package_version || 'unknown';

export const fileSizeOk = (file: string) => {
  var stats = fs.statSync(file);
  if (stats["size"] >= 52428800) {
    return false;
  } else {
    return true;
  }
};

export const setFolder = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdir(folder, { recursive: true }, err => { });
  }
}

export const getLoginCookie = () => {
  var prompt = require('prompt-sync')();

  let username = prompt('Username: ');
  let password = prompt('Password: ');

  const url = "https://www.srrdb.com/account/login"

  const data = {
    "username": username,
    "password": password,
    "login"   : 'Login',
  }

  axios({
    url: url,
    method: "post",
    httpsAgent,
    data: qs.stringify(data),
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
      "Content-Length": qs.stringify(data).length,
      //"User-Agent": `srrup.js/${version}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding": "deflate, gzip",
      "Origin": "https://www.srrdb.com",
      "Referer": "https://www.srrdb.com/",
      "Upgrade-Insecure-Requests": "1",
      "Host": "www.srrdb.com",
      //"Accept": "application/json, text/javascript, */*; q=0.01",
      //"X-Requested-With": "XMLHttpRequest",
    }
  })
    .then(function (response) {
      //handle success
      console.log(
        `${response.data}`
      );
      console.log(response.headers);
      console.log(response.headers['set-cookie']);
      console.log(response)
    })
    .catch(function (response) {
      console.log(
        `${response.status} ${response.statusText} - ${response.data}`
      );
      console.log(response.headers);
    });

}

export const srrUpload = (file: string) => {

  const cookie = process.env.COOKIE;
  const url = "https://www.srrdb.com/release/upload"

  let retries = 0;
  const fileName = path.basename(file);
  const file_data = fs.readFileSync(file);

  if (fileSizeOk(file)) {
    const form = new FormData();
    form.append("files[]", file_data, fileName);


    axios({
      url: url,
      method: "post",
      httpsAgent,
      data: form,
      headers: {
        "Content-Type": `multipart/form-data; boundary=--${form.getBoundary()}`,
        "Content-Length": form.getLengthSync(),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0",
        //"Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": cookie,
      }
    })
      .then(function (response) {
        //handle success
        console.log(
          `${response.status} ${response.statusText}: Successful uploaded file ${file}`
        );
        console.log(response);
        console.log(response.data);
      })
      .catch(function (response) {
        console.log(
          `${response.status} ${response.statusText}: Error while uploading file ${file}`
        );
        console.log(response);
      });
  }
};