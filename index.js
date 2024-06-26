const { userRepo } = require("./repo/user.js");
const express = require("express");
const app = express();
const port = 3000;
const md5 = require("md5");
const axios = require("axios");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/users", async (req, res) => {
  const { id } = req.query;
  if (id) {
    try {
      const data = await userRepo.find_userById(id);
      return res.status(200).json(data);
    } catch (error) {
      if (error.code === 100) {
        return res.status(404).json(error);
      }
      return res.status(500).json(error.msg);
    }
  }

  try {
    const data = await userRepo.all_user();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.msg);
  }
});

app.post("/users", async (req, res) => {
  try {
    const bodyData = {
      userId: req.body.userId,
      checksum: req.body.checksum,
    };

    const key = "123454";
    const keyRequest = req.headers.key;
    //create server checksum
    const dataKey = "12345ABC@#";
    const serverChecksum = md5(`${dataKey}${bodyData.userId}`);

    // validate request body userId field
    if (!bodyData.userId) {
      return res.status(400).json({ error: "missing userId field" });
    }

    // validate request body checksum field
    if (!bodyData.checksum) {
      return res.status(400).json({ error: "missing checksum field" });
    }

    // checksum validation
    if (bodyData.checksum !== serverChecksum) {
      return res.status(400).json({ error: "checksum is not match!" });
    }

    // check header key is set
    if (keyRequest == undefined) {
      return res.status(400).json({ error: "missing header key " });
    }
    // validate header key
    if (keyRequest != key || keyRequest == "") {
      return res.status(400).json({ error: "wrong header key value" });
    }

    // post user
    const data = await userRepo.post_user(bodyData);
    return res.status(201).json(data);
  } catch (error) {
    if (error.code === 100) {
      return res.status(404).json(error);
    }
    return res.status(500).json(error.msg);
  }
});

app.get("/usersphp", async (req, res) => {
  const { userid } = req.query;
  if (userid == "") {
    return res.status(400).json({ error: "query userid missing value" });
  }
  if (userid) {
    axios
      .get("http://localhost:8080/index.php/service/getusers?userid=" + userid)
      .then(function (response) {
        // handle success
        console.log(response.data);
        if (response.data.error) {
          return res.status(404).json({ error: response.data.error });
        }
        return res.status(200).json(response.data);
      })
      .catch(function (error) {
        // handle error
        console.error(error);
        return res.status(500).json({ error: "internal server error" });
      });
    return;
  }
  axios
    .get("http://localhost:8080/index.php/service/getusers")
    .then(function (response) {
      // handle success
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.error(error);
      return res.status(500).json({ error: "internal server error" });
    });
});

app.post("/usersphp", async (req, res) => {
  const { userid } = req.body;
  const testHeader = req.get("test");

  if (!testHeader) {
    return res.status(400).json({ error: "Missing header value" });
  }
  axios
    .post(
      "http://localhost:8080/index.php/service/postuser",
      {
        userId: userid,
      },
      {
        headers: {
          "Content-Type": "application/json",
          test: testHeader,
        },
      }
    )
    .then(function (response) {
      // handle success
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.error(error);
      return res.status(500).json({ error: "internal server error" });
    });
});

app.post("/test", async (req, res) => {
  const userid = "161,bright";
  const key_api = "T4VCU17RIB@_2024";
  const checksum = md5("fullss4" + "161" + key_api + "apiphp" + "bright");
  console.log("checksum >>>>",checksum);
  try {
    const resultv1 = await axios.post(
      "https://snap-england-cambridge-societies.trycloudflare.com/test/api_v1",
      {
        userid: userid,
        chksum: checksum,
        key_api: key_api,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("V1 >>>>>", resultv1.data);

    const code = resultv1.data.code;
    const name = resultv1.data.name;
    const resData = resultv1.data.data;

    const resultv2 = await axios.post(
      "https://snap-england-cambridge-societies.trycloudflare.com/test/api_v2",
      {
        md5_userid: resData,
        code: code,
        name: name,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const dataObj = JSON.parse(resultv2.data);
    dataObj.sort(function (a, b) {
      return b.value - a.value;
    });
    console.log("dataObj >>>>", dataObj);
    let counter = 1;
    for (i = 0; i < dataObj.length; i++) {
      const data = {
        no: counter,
        event_id: dataObj[i].evnetid,
        user_id: dataObj[i].userid,
        value: dataObj[i].value,
      };
      console.log("data >>>>", data);

      await userRepo.insert_event(data);
      counter++;
    }

    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1", (req, res) => {
  const { userid, chksum, key_api } = req.body;

  const keys = {
    bright: "T4VCU17RIB@_2024",
    fluke: "3E1SOVUNQX@_2024",
    fu: "I5CUHODY2S@_2024",
    pruke: "EJPWLJQ9BV@_2024",
  };

  const useridArr = userid.split(",")
  const id = useridArr[0];
  const name = useridArr[1];
  if(!(name in keys)){
    console.log("name >>>",name);
    return res.status(400).json({ error: "name not in keys data" });
  }

  if(key_api !== keys[name]){
    console.log("key_api >>>",key_api);
    console.log("key >>>",keys[name]);
    return res.status(400).json({ error: "key_api not match"});
  }

  const checksum = md5("fullss4" + id + keys[name] + "apiphp" + name);
  if(chksum !== checksum){
    console.log("checksum >>>",checksum);
    console.log("chksum >>>", chksum);
    return res.status(400).json({ error: "checksum not match"});
  }
  const data = md5(name)

  return res.status(200).json({code:300,msg:"OK",name:name,data:data})
});
app.listen(port, () => {
  console.log("server is listening on port ", port);
});
