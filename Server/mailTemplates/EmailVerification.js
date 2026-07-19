const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#4f46e5" style="padding: 30px; color:#ffffff;">
              <h1 style="margin:0; font-size:24px;">Verify Your Email Address</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color:#333333; line-height:1.6;">
              
              <h2 style="margin-top:0; color:#4f46e5;">Hello {{Student_Name}},</h2>

              <p>
                Thank you for registering at <strong>{{Platform_Name}}</strong>.
                To complete your signup and start learning, please verify your email address.
              </p>

              <!-- Verification Button -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 30px auto;">
                <tr>
                  <td align="center" bgcolor="#4f46e5" style="border-radius:6px;">
                    <a href="{{Verification_Link}}" 
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; font-size:16px; color:#ffffff; text-decoration:none; font-weight:bold;">
                       Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p>
                If the button above doesn’t work, copy and paste the link below into your browser:
              </p>

              <p style="word-break: break-all; font-size:14px; color:#4f46e5;">
                {{Verification_Link}}
              </p>

              <p>
                This verification link will expire in <strong>{{Expiry_Time}}</strong>.
              </p>

              <p>
                If you did not create an account, please ignore this email.
              </p>

              <p style="margin-top:25px;">
                Happy Learning! 🚀<br>
                <strong>Team {{Platform_Name}}</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#f9fafb" style="padding:20px; font-size:13px; color:#6b7280;">
              © {{Year}} {{Platform_Name}}. All rights reserved.<br>
              Need help? <a href="{{Support_Link}}" style="color:#4f46e5; text-decoration:none;">Contact Support</a>
            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>

</body>
</html>
`;

module.exports = emailTemplate;