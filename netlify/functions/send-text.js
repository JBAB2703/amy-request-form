const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
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

    await sgMail.send(msg)
      .then(response => {
        console.log('✅ Email sent:', response[0].statusCode);
        console.log('✅ Headers:', response[0].headers);
      })
      .catch(error => {
        console.error('❌ SendGrid error:', error.response ? error.response.body : error.message);
      });

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
