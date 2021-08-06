import React, { useEffect } from "react";
import PropTypes from "prop-types";

//  render initial login page
function Login(props) {
  const { tsService } = props;
  useEffect(() => {
    /**
     * This piece of code simply detects if the app runs in an iframe or not and apply some logic accordingly
     */
    if (window.top !== window.self) {
      // we are in the iframe
      if (document.getElementById("loginBttonContainer"))
        document.getElementById("loginBttonContainer").remove();
    } else {
      // not an iframe
      if (document.getElementById("iframeAlert"))
        document.getElementById("iframeAlert").remove();
    }
    console.log("LOGIN PAGE RENDERED");
  });

  return (
    <div className="container">
      <div
        id="exampleCard"
        className="card mt-3 p-3 shadow border-0 d-flex align-items-center justify-content-center"
      >
        <img
          src="media/app-logo.svg"
          className="col-6 img-fluid p-2 m-3"
          alt=""
        />
        <div id="loginBttonContainer" className="d-grid col-3">
          <button
            className=" btn btn-primary btn-lg"
            onClick={() => {
              // Calling Authenticate:
              tsService.authenticateBindId();
            }}
          >
            Biometric Login
          </button>
        </div>
        <div id="iframeAlert" className="alert alert-info" role="alert">
          Please open this demo in a new window/tab by clicking the preview
          button at the top right of this frame. It should have one of these
          icons:
          <svg
            width="15"
            height="12"
            viewBox="0 0 15 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z"
              fill="currentcolor"
            ></path>
          </svg>
          or
          <svg
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            height="1em"
            width="1em"
            viewBox="0 0 24 24"
            style={{ verticalAlign: "middle" }}
          >
            <path
              fill="#777"
              fillRule="evenodd"
              d="M8 6a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1H8zM5 9h1v5a2 2 0 002 2h7v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-7a1 1 0 011-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <br />
          <br />
          Or you can visit
          <a
            href="https://m0je1.sse.codesandbox.io/"
            target="_blank"
            rel="noreferrer"
          >
            https://m0je1.sse.codesandbox.io/
          </a>
          in a new window or tab.
          <br />
          <br />
          Passwordless authentication will not work in an embedded iframe due to
          security concerns.
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  tsService: PropTypes.object,
};

export default Login;
