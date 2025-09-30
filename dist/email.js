"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const smtpexpress_1 = require("smtpexpress");
require("dotenv/config");
const emailClient = (0, smtpexpress_1.createClient)({
    projectId: process.env.SMTPEXPRESS_PROJECT_ID,
    projectSecret: process.env.SMTPEXPRESS_PROJECT_SECRET,
});
emailClient.sendApi
    .sendMail({
    subject: 'Subject',
    message: 'Hello, world!',
    sender: {
        name: 'Obafemi Awolowo University - College of Health Sciences',
        email: process.env.SMTPEXPRESS_SENDER_EMAIL,
    },
    recipients: 'victoramomodu@gmail.com',
})
    .then((data) => {
    console.log(data);
})
    .catch((err) => {
    console.error(err);
});
//# sourceMappingURL=email.js.map