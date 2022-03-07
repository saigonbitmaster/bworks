'use strict';

class Transaction {
  constructor(model) {
    this.model = model;
    this.isInTransaction = false;
  }

  start(options = {}) {
    if (!this.isInTransaction) {
      const session = this.model.getDataSource().connector.client.startSession();
      session.startTransaction(options);
      this.session = session;
      this.isInTransaction = true;
      return this.session;
    }
  }

  async commit() {
    if (this.isInTransaction) {
      await this.session.commitTransaction();
      this.session.endSession();
      this.isInTransaction = false;
    }
  }

  async rollback() {
    if (this.isInTransaction) {
      await this.session.abortTransaction();
      this.session.endSession();
      this.isInTransaction = false;
    }
  }
}

module.exports = Transaction;
