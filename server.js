const express = require("express");
const multer = require("multer");
const proxy = require("express-http-proxy");

const upload = multer({ dest: "images/" });
const app = express();
app.use("/images", express.static("images"));

app.post("/image", upload.single("image"), function(req, res) {
  const { body, file } = req;

  // if you have a websocket connection you can broadcast the image,
  // for simplicity I just return the data to the demo client.
  res.json({
    url: `/images/${file.filename}`,
    user: body.user,
  });
});

// to avoid dealing with cors I just proxy every other request to parcel
// if create-react-app has been used the easy option is to enable the proxy option.
// https://create-react-app.dev/docs/proxying-api-requests-in-development
app.use(
  proxy("localhost:1234", {
    proxyReqPathResolver: req => {
      return req.url;
    },
  })
);

app.listen(3000);
