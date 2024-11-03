// components/DoctorEmailTemplate.js
import React from 'react';

const DoctorEmailTemplate = ({
  doctorName = 'Smith',
  message = "Your medical assistant's message.",
}) =>
  `<html>
    <head>
      <title>Message from Your Medical Assistant</title>
      <style>
        body { background-color: #f6f9fc; font-family: Arial, sans-serif; }
        .container { padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .heading { font-size: 24px; color: #333; }
        .message { font-size: 16px; color: #555; }
        .footer { font-size: 14px; color: #999; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="heading">Hello Dr. ${doctorName},</h1>
        <p class="message">${message}</p>
        <p class="footer">Sent by your medical assistant.</p>
      </div>
    </body>
  </html>`;

export default DoctorEmailTemplate;
