require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/src/"));

/**
 * Making sure that the required environment variables are filled out
 */
const requiredEnvParams = [
  "BINDID_CLIENT_ID",
  "BINDID_CLIENT_SECRET",
  "REDIRECT_URI",
  "PORT",
];

for (const param of requiredEnvParams) {
  if (!process.env[param] || process.env[param].length === 0) {
    console.warn(
      `WARNING: Parameter ${param} is undefined, unexpected behaviour may occur, check your environment file`
    );
  }
}

/**
 * Exchange Token:
 *
 * Exchange the authentication response for the ID and access token using a PKCE token exchange
 */
app.post("/token", async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", req.body.code);
    params.append("redirect_uri", process.env.REDIRECT_URI);
    params.append("client_id", process.env.BINDID_CLIENT_ID);
    params.append("client_secret", process.env.BINDID_CLIENT_SECRET);

    const tokenResponse = await axios({
      method: "post",
      url: "https://signin.bindid-sandbox.io/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: params,
    });
    console.log(tokenResponse.data);
    res.status(200).json(tokenResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Customer Server listening port ${port}`);
});
