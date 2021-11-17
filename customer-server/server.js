require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const { createRemoteJWKSet } = require("jose/jwks/remote");
const { jwtVerify } = require("jose/jwt/verify");

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

/**
 *  validates the user token id
 */
app.post("/validate", async (req, res) => {
  const { idToken, jwksUrl, nonce } = req.body;

  const JWKS = createRemoteJWKSet(new URL(jwksUrl));

  const furtherValidations = (payload) => {
    let errors = {};

    const currentSeconds = Math.floor(new Date().valueOf() / 1000);

    //Validate that the audience of the ID token (aud) is equal to the client ID issued during BindID enrollment.
    if (payload.aud !== process.env.BINDID_CLIENT_ID)
      errors.aud =
        "The audience of the ID token is not equal to the client ID issued during BindID enrollment";

    //Validate that the issuer of the ID token (iss) is equal to one of the following, according to environment: sandbox is https://signin.bindid-sandbox.io and production is https://signin.bindid.io
    if (payload.iss !== "https://signin.bindid-sandbox.io")
      errors.iss =
        "The issuer of the ID token is not equal to the environment used while issued";

    // Validate that the expiry time (exp) of the ID token has not passed.
    if (currentSeconds > payload.exp || currentSeconds < payload.auth_time)
      errors.exp = "ID token has expired";

    // Validate that the nonce value of the ID token is equal to the one provided to the authentication request.
    if (String(nonce) !== payload.nonce)
      errors.nonce =
        "The nonce is different than the one used on the authentication request";

    return errors;
  };

  try {
    const { payload } = await jwtVerify(idToken, JWKS);
    const errors = furtherValidations(payload);

    if (Object.keys(errors).length > 0)
      throw new Error(
        `Validation error please refer to the following errors found on your ID token: ${JSON.stringify(
          errors
        )}`
      );

    res.status(200).json({
      ok: true,
      msg: "Your ID token has passed all of the validations described in the following guide: https://developer.bindid.io/docs/guides/integration_guide/topics/validateToken/validate_token",
    });
  } catch (err) {
    res.status(401).json({
      ok: false,
      errors: String(err),
    });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Customer Server listening port ${port}`);
});
