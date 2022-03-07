'use strict';

function validateCode(err, done) {
  const codeRegex = /^[A-Z0-9]+/;
  if (!this.code.match(codeRegex)) {
    err();
  }
  done();
}

function validatePhoneNumber(err, done) {
  let phoneNumber = this.phoneNumber;
  if (phoneNumber) {
    phoneNumber = phoneNumber.replace(/['’]/g, '');
    if (phoneNumber.length > 11 || phoneNumber.length < 10) {
      err();
    }

    phoneNumber = phoneNumber.replace('(+84)', '0');
    phoneNumber = phoneNumber.replace('+84', '0');
    phoneNumber = phoneNumber.replace('0084', '0');
    phoneNumber = phoneNumber.replace(/ /g, '');

    if (!phoneNumber && !phoneNumber.match(/^\d{10,11}/)) {
      err();
    }
  }
  done();
}

// function validateAddress(err, done) {
//   const address = this.address;
//   if (address) {
//     const addressRegex = /^([/0-9A-Za-z]{1,5})(?:\sđường\s)?([a-z0-9A-Z_\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼÈẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ]+)?$/;
//     const matched = addressRegex.exec(address);
//     const streetNumber = matched[1];
//     const streetName = matched[2];
//     if (!streetNumber || !streetName) {
//       err();
//     }
//   }
//   done();
// }

function validateEmail(err, done) {
  const email = this.buyerEmail;
  if (email) {
    // Check if the input follows the format of 'abc@xyz'
    const isEmailFormatted = email.indexOf('@') >= 0;

    if (!isEmailFormatted) {
      err();
    }

    // Check if the domain name contains numeric characters
    const isNumericDomain = email.slice(email.indexOf('@') + 1).match(/\d/);

    // Return the email if two said conditions are satisfied
    if (isNumericDomain) {
      err();
    }
  }
  done();
}

function validateFaxNumber(err, done) {
  let faxNumber = this.buyerFaxNumber;
  if (faxNumber) {
    faxNumber = faxNumber.replace(/['’]/g, '');
    if (faxNumber.length > 20) {
      throw new Error('Invalid phone number');
    }

    faxNumber = faxNumber.replace('(+84)', '0');
    faxNumber = faxNumber.replace('+84', '0');
    faxNumber = faxNumber.replace('0084', '0');
    faxNumber = faxNumber.replace(/ /g, '');
    faxNumber = faxNumber.replace(/\./g, '');

    if (!faxNumber && !faxNumber.match(/^\d{10,11}/)) {
      err();
    }
  }
  done();
}

function validateBankAccount(err, done) {
  const buyerBankAccount = this.buyerBankAccount;
  if (buyerBankAccount) {
    const bankAccountRegex = /^[0-9]{11}$/;
    if (!buyerBankAccount.match(bankAccountRegex)) {
      err();
    }
  }
  done();
}

module.exports = {
  // validateAddress,
  validateBankAccount,
  validateCode,
  validateEmail,
  validateFaxNumber,
  validatePhoneNumber,
};
