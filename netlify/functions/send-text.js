const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  console.log(' Function started...');
  try {
    const data = JSON.parse(event.body);
    const { task, urgency } = data;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'jesse@housewellservices.com', // Verified email address
      from: 'noreply@housewellservices.com', // Must match verified sender in SendGrid
      replyTo: 'jesse@housewellservices.com',
      subject: `New Housewell Request: ${urgency} Urgency`,
      text: `Task: ${task}\nUrgency: ${urgency}`,
    };

console.log(' About to send email...');
  try {
    const response = await sgMail.send(msg);
        console.log('✅ Email sent:', response[0].statusCode);
        console.log('✅ Headers:', response[0].headers);
      } catch(error) {
        console.log('Email failed or threw something, moving to Google Sheets...');
        console.error('❌ SendGrid error:', error.response ? error.response.body : error.message);
      }

      console.log('✅ Made it past email, preparing to log to Google Sheets...');

  try {
      console.log('Sending to Google Sheets...');

      const sheetResponse = await fetch('https://script.google.com/macros/s/AKfycbwiDXJl4ddMR3TJuhSnMPS8OLSGf7caX4Br4xg2WiwjbHzrOKLc6bMRxbj_dD1JFjLz/exec', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ task, urgency })
      });

      const text = await sheetResponse.text();
      console.log("Google Sheet response:", text);
    } catch (error) {
      console.error("Google Sheets logging failed:", error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('SendGrid Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
