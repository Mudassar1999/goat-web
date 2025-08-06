let config: any = {};
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development"
) {
  config = {
    // SERVER_URL: window.location.protocol + "//" + window.location.hostname + ":8989"
    // SERVER_URL: "http://165.232.187.214:2323"
    // SERVER_URL: 'http://54.176.250.244:8989'
    // URL: "http://172.174.245.80:3000/v1",
    URL: "http://46.101.118.176:3000/v1",
    // URL: "https://social-app-wine.vercel.app/v1",
    //URL: 'https://social-app-wine.vercel.app/v1',
    // baseUrl: "https://goatbolbstorage.blob.core.windows.net",
    baseUrl: "https://goatstorage.blob.core.windows.net",
    facebookAppId: "359520149993976",
    // token: localStorage.getItem("accessToken")
  };
}
export default config;
