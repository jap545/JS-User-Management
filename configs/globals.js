// short for "global configurations"
// JSON object which contains app-wide configuration values
const configurations = {
    // key : value
    "db": "mongodb+srv://webadmin:password-summer2023@cluster0.8csx83m.mongodb.net/comp2068a",
    "github": {
        "clientId": "f967b01290bbd43edeaf",
        "clientSecret": "9d58036e737333c0fdc696e2f81959e51e7cb039",
        "callbackUrl": "http://localhost:3000/github/callback",
    },
    // Google OAuth configuration
  google: {
    clientId: "946733545729-9n9qlienr0vsgjcc6tgnpv9s035t44cv.apps.googleusercontent.com",
    clientSecret: "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",
    callbackUrl: "http://localhost:3000/auth/google/callback",
  },
}
// export to make it available to the other files
module.exports = configurations;