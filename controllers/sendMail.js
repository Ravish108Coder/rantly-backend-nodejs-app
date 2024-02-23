import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {

    let testAccount = await nodemailer.createTestAccount();

    const transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // Use secure: false for STARTTLS
        auth: {
            user: 'rubye.hahn@ethereal.email',
            pass: 'Jnf7PezcrkN3Tgxbzr'
        },
        tls: {
            rejectUnauthorized: false  // Important for sendimg mail from localhost
        }
    });

    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <kravish1999@gmail.com>', // sender address
        to: "211128@iiitt.ac.in", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    res.send("Email sent")
}