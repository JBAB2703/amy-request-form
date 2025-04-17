const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { task, urgency } = data;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'jkylecarpentry@gmail.com', // Replace with your receiving address
      from: 'jkylecarpentry@gmail.com', // Must match verified sender in SendGrid
      subject: `New Housewell Request: ${urgency} Urgency`,
      text: `Task: ${task}\nUrgency: ${urgency}`,
    };

    await sgMail.send(msg);

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
