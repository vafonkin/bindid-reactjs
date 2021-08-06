# Login

Build app-less, passwordless login experiences with BindID for customers that want to access your web application. This sample web app uses ReactJS to initiate strong authentication flows with the BindID service to sign in your users.

## Prerequisites

Before you begin, you'll need to have an application configured in the [BindID Admin Portal](https://admin.bindid-sandbox.io/console/#/applications). From the application settings, obtain the client credentials and configure `http://localhost:3000/redirect` as a redirect URI for this client so that you can run the sample app on your local machine. For more, see [BindID Admin Portal: Get Started](https://developer.bindid.io/docs/guides/admin_portal/topics/getStarted/get_started_admin_portal).

## Instructions

To run the sample on your local machine you will need to run 2 applications locally - React(to obtain authorization code) and Customer Server(to exchange authorization code for token):

## Start React App

1 - Navigate to bindid-react-example folder and install all the needed dependencies:

```bash
npm install
```

2 - Configure your client credentials in the `src/ts/tsservice.js` file:

```bash
    this.clientId = # Client ID obtained from the BindID Admin Portal
    this.redirectUri = # Client redirect obtained from the BindID Admin Portal
```

3 - Start React App:

```bash
    npm start
```

## Start Customer Server

1 - Navigate to customer-server folder and install all the needed dependencies:

```bash
npm install
```

2 - Configure your client credentials in the `.env` file:

```bash
    BINDID_CLIENT_ID = # Client ID obtained from the BindID Admin Portal
    BINDID_CLIENT_SECRET = # Client secret obtained from the BindID Admin Portal
    REDIRECT_URI = # Client redirect obtained from the BindID Admin Portal
```

3 - Start server:

```bash
    npm start
```

App:

Open [this page](http://localhost:3000) to try out the sample React app.

## What is BindID?

The BindID service is an app-less, strong portable authenticator offered by Transmit Security. BindID uses FIDO-based biometrics for secure, frictionless, and consistent customer authentication. With one click to create new accounts or sign into existing ones, BindID eliminates passwords and the inconveniences of traditional credential-based logins.<br><br>
[Learn more about how you can boost your experiences with BindID.](https://www.transmitsecurity.com/developer)

## Author

Transmit Security, https://github.com/TransmitSecurity

## License

This project is licensed under the MIT license. See the LICENSE file for more info.
