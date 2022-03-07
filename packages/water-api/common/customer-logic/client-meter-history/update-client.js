module.exports = ClientMeterHistory => {
  ClientMeterHistory.observe('before save', async ctx => {
    if (ctx.isNewInstance) {
      let Client = ClientMeterHistory.app.models.Client;
      let record = await ClientMeterHistory.app.models.ClientMeterHistory.findOne({
        where: { clientId: ctx.instance.clientId.toString() },
      });
      if (!record) {
        let client = await Client.findById(ctx.instance.clientId.toString());
        const data = {
          lastMeterNumber: ctx.instance.newMeterNumber,
          lastTimeMeterNumberUpdate: ctx.instance.setupDate,
          termInvoice: new Date(ctx.instance.setupDate.getFullYear(), ctx.instance.setupDate.getMonth()),
          termMeterNumber: new Date(ctx.instance.setupDate.getFullYear(), ctx.instance.setupDate.getMonth()),
        };
        await client.updateAttributes(data);
      }
    }
    return;
  });
};
