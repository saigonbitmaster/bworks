// const http = require('http');
const https = require('https');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const SMS_ACCESS_TOKEN = 'dsOL6J0RkL7A9dKpw6Ft0E31GUolVcPa';

//send sms
function sendSms(phoneList, message) {
  //let phones = ["0909618609"];
  //let content = "Water source notification";
  let phones = phoneList;
  let content = message.content;
  let type = 3;

  let sender = '901800836';
  try {
    let url = 'api.speedsms.vn';
    let params = JSON.stringify({
      to: phones,
      content: content,
      sms_type: type,
      sender: sender,
    });

    let buf = new Buffer(SMS_ACCESS_TOKEN + ':x');
    let auth = 'Basic ' + buf.toString('base64');
    const options = {
      hostname: url,
      port: 443,
      path: '/index.php/sms/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    };

    const req = https.request(options, function(res) {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', function(d) {
        body += d;
      });
      res.on('end', function() {
        let json = JSON.parse(body);
        if (json.status == 'success') {
          console.log('send sms success'); // eslint-disable-line no-console
        } else {
          console.log('send sms failed ' + body); // eslint-disable-line no-console
        }
      });
    });

    req.on('error', function(e) {
      console.log('send sms failed: ' + e); // eslint-disable-line no-console
    });

    req.write(params);
    req.end();
  } catch (e) {
    throw e;
  }
}

//send mail
function sendEmail(emailList, message) {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'watersupport@Bworks.online',
        pass: 'Bworks@2017',
      },
    }),
  );

  let mailOptions = {
    from: 'watersupport@Bworks.online',
    to: emailList,
    subject: message.subject,
    text: message.content,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error); // eslint-disable-line no-console
    } else {
      console.log('Email sent: ' + info.response); // eslint-disable-line no-console
    }
  });
}

module.exports = function(WaterSource) {
  //main function
  WaterSource.smsNotification = async function(mode) {
    let notificationContacts = await WaterSource.app.models.SrcConfig.find({
      where: { id: { inq: ['Sms', 'Email'] } },
    });
    if (!notificationContacts || notificationContacts.length < 1) {
      return null;
    }
    let phoneList = notificationContacts.filter(item => item.id == 'Sms');
    let emailList = notificationContacts.filter(item => item.id == 'Email');
    let message = {
      subject: 'Water source notification',
      content: 'There is some alert on water source system',
    };
    switch (mode) {
      case 'sms': {
        if (phoneList.length > 0 && phoneList[0].value.isNotifySms) {
          sendSms(phoneList[0].value.phoneList, message);
        }
        break;
      }
      case 'email': {
        if (emailList.length > 0 && emailList[0].value.isNotifyEmail) {
          sendEmail(emailList[0].value.emailList, message);
        }
        break;
      }
      case 'all': {
        if (phoneList.length > 0 && phoneList[0].value.isNotifySms) {
          sendSms(phoneList[0].value.phoneList, message);
        }
        if (emailList.length > 0 && emailList[0].value.isNotifyEmail) {
          sendEmail(emailList[0].value.emailList, message);
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  WaterSource.remoteMethod('smsNotification', {
    accepts: [{ arg: 'mode', type: 'string', default: 'email' }], //mode = 'email' or 'sms'
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
