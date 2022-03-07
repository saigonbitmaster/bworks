module.exports = function(Meternumbersubmit) {
  Meternumbersubmit.approveSubmit = async submitData => {
    const { currentNumber, meterImage, fromDate, toDate, id, clientId, previousNumber } = submitData;
    try {
      const ClientMeterNumber = Meternumbersubmit.app.models.ClientMeterNumber;
      const currentMeterNumberSubmit = await Meternumbersubmit.findById(id);
      const checkIfClientNumberExist = await ClientMeterNumber.findById(id);
      if (!checkIfClientNumberExist) {
        const newClientMeterNumber = await Meternumbersubmit.app.models.ClientMeterNumber.writeNewMonth({
          currentNumber,
          images: meterImage,
          fromDate,
          toDate,
          id,
          clientId,
          previousNumber,
        });
        const {
          changedClientMeter: histories,
        } = await Meternumbersubmit.app.models.ClientMeterHistory.checkClientMeterHaveChange(
          clientId,
          fromDate,
          toDate,
        );
        const { formulaId, memberCount } = await Meternumbersubmit.app.models.Client.findById(clientId);
        const formula = await Meternumbersubmit.app.models.Formula.findById(formulaId);
        const totalWaterUse = calculateTotalUse({ clientMeterNumber: newClientMeterNumber, histories });
        const totalMoney = calculatePrice({ formula, memberCount }, totalWaterUse);
        currentMeterNumberSubmit.updateAttributes({ totalWaterUse, totalMoney, submitStatus: 'PASSED' });
      } else {
        currentMeterNumberSubmit.updateAttribute('submitStatus', 'EXISTED');
      }
    } catch (error) {
      throw error;
    }
  };

  const calculateTotalUse = item => {
    let waterOffset = 0;
    if (item.histories) {
      item.histories.map(history => {
        if (history.lastMeterNumber) {
          waterOffset += history.oldMeterNumber - history.lastMeterNumber;
        } else {
          waterOffset += history.oldMeterNumber - history.newMeterNumber;
        }
      });
    }
    return parseInt(item.clientMeterNumber.currentNumber - item.clientMeterNumber.previousNumber + waterOffset);
  };

  const calculatePrice = (item, total) => {
    let details = [];
    let from = 0;
    // factor value for every step in fomulas
    if (!item.formula || !item.formula.normGroups || item.formula.normGroups.length <= 0)
      throw new Error('Wrong formula for client');
    const factor = item.formula.unit === 'PERSON' ? item.memberCount || 1 : 1;
    let normGroupsIndex = 0;
    let waterFee = 0;
    while (total > from) {
      const formulaStep = item.formula.normGroups[normGroupsIndex];
      let stepTo = formulaStep.to > 0 ? formulaStep.to : Number.MAX_SAFE_INTEGER;
      let maxWaterStep = (stepTo - formulaStep.from) * factor;

      let to = Math.min(total, from + maxWaterStep);
      let waterUsed = to - from;
      let detailStep = {
        waterUsed,
        from,
        to,
        factor,
        name: `${item.formula.name}-${(normGroupsIndex + 1).toString()}`,
        rank: (normGroupsIndex + 1).toString(),
        price: formulaStep.price,
        toFee: waterUsed * formulaStep.price,
      };
      waterFee += detailStep.toFee;
      details.push(detailStep);
      normGroupsIndex++;
      from = to;
    }
    let sewageFee = parseInt((item.formula.sewageFee * waterFee) / 100);
    let taxFee = parseInt(parseFloat((item.formula.tax * waterFee) / 100).toFixed());
    let totalFee = waterFee + sewageFee + taxFee;
    return {
      details,
      sewagePercent: item.formula.sewageFee,
      sewageFee,
      taxPercent: item.formula.tax,
      taxFee,
      waterFee,
      totalFee,
      totalWaterUsed: total,
      factor: item.formula.unit,
    };
  };

  Meternumbersubmit.remoteMethod('approveSubmit', {
    accepts: [{ arg: 'submitData', type: 'object' }],
    http: { verb: 'post' },
  });
};
