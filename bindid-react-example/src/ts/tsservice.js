export default class TransmitService {
  constructor() {
    this.XmBindId = window.XmBindId;
    // Always use the API behavior of the latest version - UseLatest
    this.apiCompat = window.XmBindId.XmBindIdApiCompatibilityLevel.UseLatest;
    // Configure the BindID SDK with your client ID, and to work with the BindID sandbox environment
    this.clientId = "";
    this.redirectUri = "";
  }

  // SDK Initialization:
  async initializeBindIdSDK() {
    this.XmBindId.initialize({
      clientId: this.clientId,
      apiCompat: this.apiCompat,
    }).then((res) => {
      console.log("BID SDK INITIALIZED");
    });
  }

  // Authenticate the user
  authenticateBindId() {
    try {
      console.log("AUTHENTICATE WITH BIND SDK", this.redirectUri);
      this.XmBindId.authenticate({
        redirectUri: this.redirectUri,
        nonce: this.getRandomInt(),
        state: String(this.getRandomInt()),
      });
      //  Handle Error:
      // Display an error message to the user
    } catch (error) {
      console.log("BIND AUTHENTICATION FAILED", error);
      alert("BIND AUTHENTICATION FAILED");
    }
  }

  getRandomInt() {
    return Math.floor(Math.random() * (Math.pow(2, 31) - 1));
  }
}
