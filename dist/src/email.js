"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const resend = new resend_1.Resend('re_9ryZygbn_Dti7ysQseNjcxXGxpQUPm4FJ');
const sendEmail = async () => {
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['victoramomodu@gmail.com'],
        subject: 'hello world',
        html: '<p>it works!</p>',
    });
};
sendEmail();
//# sourceMappingURL=email.js.map