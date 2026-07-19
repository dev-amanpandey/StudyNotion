const courseEnrollmentEmail = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Course Enrollment Confirmation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .email-wrapper {
      width: 100%;
      padding: 20px 0;
      background-color: #f4f6f8;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }

    .email-header {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: #ffffff;
      text-align: center;
      padding: 24px;
    }

    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }

    .email-body {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }

    .email-body h2 {
      color: #4f46e5;
      font-size: 20px;
      margin-bottom: 10px;
    }

    .course-details {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
    }

    .course-details p {
      margin: 6px 0;
      font-size: 15px;
    }

    .cta-button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 15px;
    }

    .cta-button:hover {
      background-color: #4338ca;
    }

    .email-footer {
      background-color: #f9fafb;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #6b7280;
    }

    .email-footer a {
      color: #4f46e5;
      text-decoration: none;
    }
  </style>
</head>
<body>

  <div class="email-wrapper">
    <div class="email-container">

      <!-- Header -->
      <div class="email-header">
        <h1>Enrollment Successful 🎉</h1>
      </div>

      <!-- Body -->
      <div class="email-body">
        <h2>Hello {{Student_Name}},</h2>

        <p>
          Congratulations! You have been successfully enrolled in the following course on
          <strong>{{Platform_Name}}</strong>.
        </p>

        <div class="course-details">
          <p><strong>📘 Course Name:</strong> {{Course_Name}}</p>
          <p><strong>🧑‍🏫 Instructor:</strong> {{Instructor_Name}}</p>
          <p><strong>📅 Start Date:</strong> {{Start_Date}}</p>
          <p><strong>⏱ Duration:</strong> {{Course_Duration}}</p>
        </div>

        <p>
          You can now access your course dashboard and start learning right away.
        </p>

        <a href="{{Course_Dashboard_Link}}" class="cta-button">
          Go to Course Dashboard
        </a>

        <p style="margin-top: 25px;">
          If you have any questions or need support, feel free to reach out to us anytime.
        </p>

        <p>
          Happy Learning! 🚀<br>
          <strong>Team {{Platform_Name}}</strong>
        </p>
      </div>

      <!-- Footer -->
      <div class="email-footer">
        <p>
          © {{Year}} {{Platform_Name}}. All rights reserved.
        </p>
        <p>
          Need help? <a href="{{Support_Link}}">Contact Support</a>
        </p>
      </div>

    </div>
  </div>

</body>
</html>
`;

module.exports = courseEnrollmentEmail;