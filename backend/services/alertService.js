const User = require('../models/User');
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
      return { sent: 0, skipped: 0, message: 'No recipients found for specified location' };
    }

    const html = emailService.getAlertTemplate({
      title: title || 'Area Alert',
      message,
      location: `${state}, ${country}`,
      ctaUrl
    });

    await emailService.sendAlertToRecipients(
      recipientEmails,
      subject || `Alert for ${state}, ${country}`,
      html
    );

    return { sent: recipientEmails.length, skipped: 0 };
  }
}

module.exports = AlertService;


