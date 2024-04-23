import { get_sts_token } from "@/api/tablelist";
export default async function (data) {
  // const data = document.getElementById("shfile").files[0];
  if (!data) return alert("选择文件先");
  const filename = getThePath(data.name);
  console.log("filename：", filename);
  const client = await getSTS();
  console.log("[上传的client]", client);
  
  const result = await client.put(filename, data).catch((err) => {
    console.log("err", err);
    console.log("接口状态后过期，需要刷新后使用");
  });
  return new Promise((resolve, reject) => {
    // console.log(result);
    // setTimeout(() => {
    //   const result = {
    //     name: "webeditor/20211202/edd7d8fdeb0.fbx",
    //     url: "http://mrstage-oss.oss-cn-shanghai.aliyuncs.com/webeditor/20211202/edd7d8fdeb0.fbx",
    //   };
      if (result?.url) {
        result.url = result.url.replace('http://', 'https://')
        resolve(result);
      } else {
        reject({msg:'上传失败'});
      }
    // }, 1000);
  });
}

function setThePath() {
  // const d = new Date("2021/08/23");
  const d = new Date();
  const path = parseTime(d, "{y}{m}{d}/");
  // const filename = "nocode/" + path + data.name;
  return "webeditor/" + path;
}

function prefix(prefix) {
  var cdate = new Date();
  var offdate = new Date(2020, 1, 1);
  var offset = cdate.getTime() - offdate.getTime();
  var hexd = parseFloat(offset).toString(16);
  if (typeof prefix === "string" || typeof prefix === "number") {
    return prefix + hexd;
  } else {
    return "sui_" + hexd;
  }
}

function getThePath(name = "") {
  let filename = "";
  filename = setThePath() + prefix("ed") + "." + name.split(".").pop();
  return filename;
}

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

///
function initClient(thedata) {
  const creds = thedata.Credentials;
  const client = new OSS({
    bucket: "mrstage-oss",
    region: "oss-cn-shanghai",

    accessKeyId: creds.AccessKeyId,
    accessKeySecret: creds.AccessKeySecret,
    stsToken: creds.SecurityToken,
    refreshSTSToken: async () => {
      console.log("refreshSTSToken 过期");
      const res = await get_sts_token();
      const refreshToken = res.data.Credentials;
      return {
        accessKeyId: refreshToken.AccessKeyId,
        accessKeySecret: refreshToken.AccessKeySecret,
        stsToken: refreshToken.SecurityToken,
      };
    },
  });
  // window.ossclient = client;
  // console.log("client", client);
  return client;
}

function getSTS() {
  return new Promise((resolve, reject) => {
    get_sts_token()
      .then((res) => {
        // console.log(res);
        const theClient = initClient(res.data);
        // console.log('getSTS 获取登录',theClient)
        resolve(theClient);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
