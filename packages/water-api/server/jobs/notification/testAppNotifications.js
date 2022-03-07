// import Expo from 'expo-server-sdk';
const { Expo } = require('expo-server-sdk');
// Create a new Expo SDK client
let expo = new Expo();

const testAppMotification = async ({ app }) => {
  console.log('testAppMotification is fired!');
  try {
    const messages = await generateMessage({ app });
    const tickets = await chunkMessage(messages);
    const receipt = await pushChunk(tickets);
    return { receipt };
  } catch (e) {
    console.log(e);
  }
};

const generateMessage = async ({ app }) => {
  let messages = [];
  const somePushTokens = await app.models.AppUser.find({ where: { username: 'taipt' } });
  somePushTokens.forEach(user => {
    const { userdevices } = user;
    const temp = userdevices.map(device => {
      if (!Expo.isExpoPushToken(device.token)) {
        console.error(`Push token ${device.token} is not a valid Expo push token`);
        return null;
      }
      // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
      return {
        to: device.token,
        sound: 'default',
        body: 'This is a test notification',
        data: { withSome: 'data' },
      };
    });
    messages = messages.concat(temp);
  });
  return messages;
};

const chunkMessage = async messages => {
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
    // NOTE: If a ticket contains an error code in ticket.details.error, you
    // must handle it appropriately. The error codes are listed in the Expo
    // documentation:
    // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
  }
  return tickets;
};

const pushChunk = async tickets => {
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }
  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (let chunk of receiptIdChunks) {
    let result = [];
    let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
    if (Array.isArray(receipts)) {
      result = result.concat(receipts);
    } else {
      result.push(receipts);
    }
    // The receipts specify whether Apple or Google successfully received the
    // notification and information about an error, if one occurred.
    for (let receipt of result) {
      if (receipt.status === 'ok') {
        continue;
      } else if (receipt.status === 'error') {
        console.error(`There was an error sending a notification: ${receipt.message}`);
        if (receipt.details && receipt.details.error) {
          // The error codes are listed in the Expo documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
          // You must handle the errors appropriately.
          console.error(`The error code is ${receipt.details.error}`);
        }
      }
    }
  }
  return receiptIds;
};

module.exports = testAppMotification;
