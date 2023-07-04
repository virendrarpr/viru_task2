const nodemailer=require('nodemailer')
exports.sendEmail=async(email,resetUser)=>{
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sahiltallnia222@gmail.com',
        pass: 'bnmvoeqssbdsxisb',
      },
    });
  // res.status(201).json({sucess:true,message:'Sign up successfully'})
  const mailOptions = {
      from:'sahiltallnia222@gmail.com',
      to: email,
      subject: 'Verify Your Account',
      // text: `Your verification code is ${verificationToken}`,
      html:`<h1>Verify Your Account</h1>
      <p>Dear User,</p>
      <p>Thank you for signing up ! To complete your registration, please click on the link given below.</p>
      <a style="background-color:#3677e1;color: white;padding: 0.5rem 1rem;font-size: 16px;text-decoration: none;" href='http://localhost:4000/api/v1/varify/${resetUser}'>Click</a>
      <p>If you did not sign up , please ignore this email.</p>
      <p>Thank you!</p>`
    };
  await transporter.sendMail(mailOptions);
}