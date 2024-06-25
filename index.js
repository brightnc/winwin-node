const { userRepo } = require("./repo/user.js");
const express = require("express");
const app = express();
const port = 3000;
const md5 = require('md5');

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
      return res.status(404).json(error);
    }
  }

  try {
    const data = await userRepo.all_user();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error);
  }
});

app.post("/users", async (req, res) => {
  try {
    const bodyData = {
      userId: req.body.userId,
      checksum:req.body.checksum
    };
    const dataKey = "12345ABC@#";
    const key = "123454";
    const keyRequest = req.headers.key;
    console.log("user id : ", bodyData.userId);
    console.log("key header : ",keyRequest);

    // validate request body userId field
    if (!bodyData.userId) {
      return res.status(400).json({ error: "missing userId field" });
    }

     // validate request body checksum field
     if (!bodyData.checksum) {
        return res.status(400).json({ error: "missing userId field" });
      }

      if(bodyData.checksum !== ){

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
    return res.status(404).json(error);
  }
});
app.listen(port, () => {
  console.log("server is listening on port ", port);
});
