import React, { useEffect } from "react";
import PropTypes from "prop-types";

//  render redirect page
function BindIDRedirect(props) {
  const { tsService } = props;
  useEffect(() => {
    window.XmBindId.processRedirectResponse().then(
      (res) => {
        console.log("AUTHORIZATION CODE:", res.code);
        sendAuthCodeToServer(res.code);
      },
      (err) => {
        handleError(err);
      }
    );
    console.log("REDIRECT PAGE RENDERED");
  });
  return (
    <div className="container">
      <div
        id="successCard"
        className="visually-hidden card mt-3 p-3 shadow border-0 d-flex align-items-center justify-content-center"
      >
        <h1>Success!</h1>
        <h3>Your token data is:</h3>
        <p>
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#userPassport"
            aria-expanded="true"
            aria-controls="userPassport"
            onClick={() => {
              userPassportCardonClick();
            }}
          >
            User Passport
          </button>
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#rawTokenData"
            aria-expanded="false"
            aria-controls="rawTokenData"
            onClick={() => {
              rawTokenDataCardonClick();
            }}
          >
            Decoded Token
          </button>
        </p>
        <div id="userPassport" className="card p-2 shadow collapse show">
          <table className="table table-dark table-hover">
            <tbody>
              <tr>
                <th scope="row"></th>
                <td>User ID</td>
                <td id="tableUserId"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>User Alias</td>
                <td id="tableUserAlias"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>User Registered On</td>
                <td id="tableUserRegistered"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>User First Seen</td>
                <td id="tableUserFirstSeen"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>User First Confirmed</td>
                <td id="tableUserFirstConfirmed"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>User Last Seen</td>
                <td id="tableUserLastSeen"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>User Last Seen by Network</td>
                <td id="tableUserLastSeenByNetwork"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>Total Providers that Confirmed User</td>
                <td id="tableTotalProvidersConfirmed"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>Authenticating Device Registered</td>
                <td id="tableRegisteredDevice"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>Authenticating Device Confirmed</td>
                <td id="tableConfirmedDevice"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>Authenticating Device Last Seen</td>
                <td id="tableAuthDeviceLastSeen"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>Authenticating Device Last Seen by Network</td>
                <td id="tableAuthDeviceLastSeenByNetwork"></td>
              </tr>
              <tr>
                <th scope="row"></th>
                <td>Total Known Devices</td>
                <td id="tableTotalDevices"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre id="rawTokenData" className="card p-2 shadow collapse"></pre>
        <h5 className="mt-5">
          For more options, like de-registering a device, go to myBindID
        </h5>
        <div id="myBindIdBtn" className="d-grid col-3 mt-5">
          <a
            className="btn btn-primary btn-lg"
            role="button"
            href="http://my.bindid-sandbox.io/"
          >
            Go to myBindID
          </a>
        </div>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
  function sendAuthCodeToServer(authCode) {
    const tokenUrl = "http://localhost:8080/token";

    // Send the authCode to the application server
    fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: authCode }),
    })
      .then((res) => res.json())
      .then((body) => {
        // If autorization code is invalid server will report an error, we check first for any error otherwise we will decode JWT:
        if (body.hasOwnProperty("error")) {
          // Display an error message to the user
          alert(
            "Server responded with error: " +
              body.error +
              ", " +
              body.error_description
          );
          // Redirect to login page
          window.location.href = "http://localhost:3000";
        } else {
          // JWT decode:
          const tokenData = JSON.parse(
            atob(body.id_token.split(".")[1], "base64")
          );
          document.getElementById("rawTokenData").textContent = JSON.stringify(
            tokenData,
            null,
            4
          );
          setPassportTableData(tokenData);
          document
            .getElementById("successCard")
            .classList.remove("visually-hidden");
        }
      })
      //  Handle Error:
      .catch((error) => {
        console.error(error);
        alert("perform error handling here");
      });
  }

  function handleError(err) {
    //  Handle Error:
    // Display an error message to the user
    console.error(err);
  }

  function setPassportTableData(tokenData) {
    const tableData = [
      {
        tableRowId: "tableUserId",
        tableRowData: tokenData.sub,
      },
      {
        tableRowId: "tableUserAlias",
        tableRowData: tokenData.bindid_alias || "Not set",
      },
      {
        tableRowId: "tableUserRegistered",
        tableRowData: Date(
          tokenData.bindid_network_info?.user_registration_time
        ),
      },
      {
        tableRowId: "tableUserFirstSeen",
        tableRowData: Date(tokenData.bindid_info.capp_first_login),
      },
      {
        tableRowId: "tableUserFirstConfirmed",
        tableRowData:
          Date(tokenData.bindid_info.capp_first_confirmed_login) || "Never",
      },
      {
        tableRowId: "tableUserLastSeen",
        tableRowData: Date(tokenData.bindid_info?.capp_last_login) || "Never",
      },
      {
        tableRowId: "tableUserLastSeenByNetwork",
        tableRowData:
          Date(tokenData.bindid_network_info?.user_last_seen) || "Never",
      },
      {
        tableRowId: "tableTotalProvidersConfirmed",
        tableRowData:
          tokenData.bindid_network_info?.confirmed_capp_count || "0",
      },
      {
        tableRowId: "tableRegisteredDevice",
        tableRowData:
          Date(
            tokenData.bindid_info?.capp_last_login_from_authenticating_device
          ) || "Never",
      },
      {
        tableRowId: "tableConfirmedDevice",
        tableRowData: tokenData.acr?.includes("ts.bindid.app_bound_cred")
          ? "Yes"
          : "No",
      },
      {
        tableRowId: "tableAuthDeviceLastSeen",
        tableRowData:
          Date(
            tokenData.bindid_info?.capp_last_login_from_authenticating_device
          ) || "Never",
      },
      {
        tableRowId: "tableAuthDeviceLastSeenByNetwork",
        tableRowData:
          Date(
            tokenData.bindid_network_info?.authenticating_device_last_seen
          ) || "Never",
      },
      {
        tableRowId: "tableTotalDevices",
        tableRowData: tokenData.bindid_network_info?.device_count || 0,
      },
    ];

    for (const elem of tableData) {
      document.getElementById(elem.tableRowId).textContent = elem.tableRowData;
    }
  }

  function userPassportCardonClick() {
    let rawTokenDataCard = document.getElementById("rawTokenData");
    let userPassportCard = document.getElementById("userPassport");
    rawTokenDataCard.classList.remove("show");
    userPassportCard.classList.add("show");
  }

  function rawTokenDataCardonClick() {
    let userPassportCard = document.getElementById("userPassport");
    let rawTokenDataCard = document.getElementById("rawTokenData");
    userPassportCard.classList.remove("show");
    rawTokenDataCard.classList.add("show");
  }
}

BindIDRedirect.propTypes = {
  tsService: PropTypes.object,
};

export default BindIDRedirect;
