const WaterSourceNotifications = {
  emailAndSms: async function({ app }) {
    let WaterSource = app.models.WaterSource;
    WaterSource.smsNotification('email');
  },
};

module.exports = WaterSourceNotifications;
