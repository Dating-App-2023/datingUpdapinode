const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));


//parse through bodyparser to make readable for our api
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.status(200).send({ hello: "world" });
});

server.post("/generate_access_token/:channel/:role/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const channelName = req.params.channel;

  console.log(channelName);

  if (!channelName) {
    return res.sendStatus(400);
  }

  console.log(req.params.role);

  // get role
  let callRole = RtcRole.SUBSCRIBER;
  if (req.params.role === "publisher") {
    callRole = RtcRole.PUBLISHER;
  }
  let expireTime = 3600;
  let uid = 0;
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  const token = RtcTokenBuilder.buildTokenWithUid(
    "fdea1b8565cf4c08857a0cf73a9c81af",
    "7623f2b2f64e4e07bfbc3a86dd88ede4",
    channelName,
    uid,
    callRole,
    privilegeExpireTime
  );
  res.send({ token });
});

server.options("*", cors());

server.listen(process.env.PORT || 5500, () => {
  console.log(`listening on port ${process.env.PORT || 5500}`);
});
