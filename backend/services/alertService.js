const User = require('../models/User');
const AreaAlert = require('../models/AreaAlert');
const emailService = require('./emailService');

class AlertService {
  static async sendAreaAlert({ country, state, title, message, ctaUrl, subject }) {
    if (!country || !state) {
      throw new Error('country and state are required');
    }

    // Find users matching location
    const users = await User.find({ country, state }).select('email name country state');
    const recipientEmails = users.map(u => u.email).filter(Boolean);

    if (recipientEmails.length === 0) {
      // Save alert anyway
      const alert = new AreaAlert({
        country,
        state,
        title: title || 'Area Alert',
        message,
        ctaUrl: ctaUrl || '',
        subject: subject || `Alert for ${state}, ${country}`,
        recipients: [],
        sentCount: 0,
        skippedCount: 0
      });
      await alert.save();

      return { sent: 0, skipped: 0, message: 'No recipients found for specified location' };
    }

    const html = emailService.getAlertTemplate({
      title: title || 'Area Alert',
      message,
      location: `${state}, ${country}`,
      ctaUrl
    });

    let sentEmails = [];
    let skippedEmails = [];

    // Send emails individually
    for (const email of recipientEmails) {
      try {
        await emailService.sendAlertToRecipients([email], subject || `Alert for ${state}, ${country}`, html);
        sentEmails.push(email);
      } catch (error) {
        console.error(`Failed to send alert to ${email}:`, error);
        skippedEmails.push(email);
      }
    }

    // Save alert in DB
    const alert = new AreaAlert({
      country,
      state,
      title: title || 'Area Alert',
      message,
      ctaUrl: ctaUrl || '',
      subject: subject || `Alert for ${state}, ${country}`,
      recipients: recipientEmails,
      sentCount: sentEmails.length,
      skippedCount: skippedEmails.length
    });

    await alert.save();

    return {
      sent: sentEmails.length,
      skipped: skippedEmails.length,
      message: 'Alert processed and saved',
      failedRecipients: skippedEmails
    };
  }
 static async getAllAlerts() {
  const alerts = await AreaAlert.find().sort({ createdAt: -1 }); // <- use AreaAlert
  return {
    active: alerts.filter(a => a.status === 'active'),
    past: alerts.filter(a => a.status !== 'active'),
  };
}

static async createAlert(data) {
  const alert = await AreaAlert.create(data); // <- use AreaAlert
  return alert;
}

}

module.exports = AlertService;
