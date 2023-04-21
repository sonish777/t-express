(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{"0uWS":function(e,t,a){"use strict";a.r(t),a.d(t,"_frontmatter",(function(){return o})),a.d(t,"default",(function(){return p}));var n=a("IKa1"),i=a("Yh9w"),l=(a("r0ML"),a("V0Ug")),r=a("sN0p");a("xH0s");const s=["components"],o={};void 0!==o&&o&&o===Object(o)&&Object.isExtensible(o)&&!Object.prototype.hasOwnProperty.call(o,"__filemeta")&&Object.defineProperty(o,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/extras/mail.mdx"}});const d={_frontmatter:o},m=r.a;function p(e){let{components:t}=e,r=Object(i.a)(e,s);return Object(l.b)(m,Object(n.a)({},d,r,{components:t,mdxType:"MDXLayout"}),Object(l.b)("h1",{id:"mail"},"Mail"),Object(l.b)("p",null,"Texpress provides a ",Object(l.b)("inlineCode",{parentName:"p"},"Mailer")," utility shared class that simplifies sending email messages using the ",Object(l.b)("inlineCode",{parentName:"p"},"nodemailer")," library.\nYou'll need to create email templates before sending emails.",Object(l.b)("br",{parentName:"p"}),"\n","Email templates are stored in the database and identified by a unique ",Object(l.b)("inlineCode",{parentName:"p"},"code"),". When sending an email, the Mailer instance retrieves the email template from the database , and then parses the email template using the parseTemplate method with the dynamic data."),Object(l.b)("h2",{id:"mailer-credential-prerequisites"},"Mailer Credential Prerequisites"),Object(l.b)("p",null,"Since the ",Object(l.b)("inlineCode",{parentName:"p"},"Mailer")," utility uses STMP, you'll need to create STMP credentials to be used for sending email. These credentials are set in the configuration json files under the following names,"),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-javascript"},'{\n    // other configs,\n    "mail": {\n        "host": // host of the mail server,\n        "port": // port of the mail server,\n        "username": // smtp username\n        "password": // smtp password\n        "secure": // stmp secure (true/false)\n        "from": // default from email address\n    }\n}\n')),Object(l.b)("h2",{id:"creating-mailers-and-sending-mails"},"Creating Mailers and Sending Mails"),Object(l.b)("p",null,"To send emails using the ",Object(l.b)("inlineCode",{parentName:"p"},"Mailer")," utility, create your mailer class extending the ",Object(l.b)("inlineCode",{parentName:"p"},"Mailer")," and create a method say ",Object(l.b)("inlineCode",{parentName:"p"},"send()")," to send the email. To send the email, call the ",Object(l.b)("inlineCode",{parentName:"p"},"parseTemplate()")," method to get the email template from the database (uses ",Object(l.b)("inlineCode",{parentName:"p"},"email_templates")," table in the database) with matching ",Object(l.b)("inlineCode",{parentName:"p"},"code"),", and pass the data as the second argument that needs to be replaced in placeholders in that email template. Also, set the ",Object(l.b)("inlineCode",{parentName:"p"},"'to'")," property to receiver's email address and finally call the ",Object(l.b)("inlineCode",{parentName:"p"},"sendEmail()")," to send the email."),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-javascript"},"\nclass SendOTPMailer extends Mailer {\n    private readonly code = 'SEND_OTP';\n    async send(data: Record<string, string>) {\n        (await this.parseTemplate(this.code, data))\n            .to(data.to_email)\n            .sendEmail();\n    }\n}\n\n")),Object(l.b)("p",null,"Above example creates a OTP mailer that sends an email with template matching the code ",Object(l.b)("inlineCode",{parentName:"p"},"'SEND_OTP'")," in the database.",Object(l.b)("br",{parentName:"p"}),"\n","Now, to send the email."),Object(l.b)("pre",null,Object(l.b)("code",{parentName:"pre",className:"language-javascript"},"\nclass AuthService {\n    constructor(\n        // Inject the mailer instance\n        // Make sure to decorate your mailer by typedi's @Service decorator to make them injectable\n        private readonly sendOtpMailer: SendOTPMailer\n    ) {}\n\n    doSomethingAndSendEmail() {\n        // do `something`\n        this.sendOtpMailer.send({\n            to_email: 'receiver@email.goes.here',\n            // other data needed in the email template.\n        });\n    }\n}\n\n")),Object(l.b)("h2",{id:"mail-preview"},"Mail Preview"),Object(l.b)("p",null,"During development, it may be useful to only preview the email instead of actually sending it. For this purpose, the ",Object(l.b)("inlineCode",{parentName:"p"},"sendEmail")," method has a ",Object(l.b)("inlineCode",{parentName:"p"},"previewOnly")," option that is true by default when the ",Object(l.b)("inlineCode",{parentName:"p"},"NODE_ENV")," environment variable is not set to ",Object(l.b)("inlineCode",{parentName:"p"},"production"),". The local email preview shows how the email will look when it is sent, and can be useful for testing and debugging email templates."),Object(l.b)("p",null,"However, if you wish to send the email even in a non-production environment, you can pass the ",Object(l.b)("inlineCode",{parentName:"p"},"previewOnly")," option as false to force the sendEmail method to send the email using the configured transporter."),Object(l.b)("p",null,"The mail preview may look something like this:"),Object(l.b)("img",{src:a("6Cxz"),style:{width:"70%"}}))}void 0!==p&&p&&p===Object(p)&&Object.isExtensible(p)&&!Object.prototype.hasOwnProperty.call(p,"__filemeta")&&Object.defineProperty(p,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/extras/mail.mdx"}}),p.isMDXComponent=!0},"6Cxz":function(e,t,a){e.exports=a.p+"static/mail-preview-c4b637038ffd530202106103084fd1f2.png"}}]);
//# sourceMappingURL=component---src-extras-mail-mdx-fb84133c2ddb992e9a83.js.map