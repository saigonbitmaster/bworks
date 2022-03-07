/* eslint-disable react/prop-types */
import React, { PureComponent, createRef } from 'react';
import { debounce } from 'lodash';

class PaymentConfirmation extends PureComponent {
  finish = false;
  iframeRef = createRef(null);

  constructor(props) {
    super(props);
    this.state = { fixId: `print-${props.id || Math.random().toFixed(10)}` };
  }

  printIframe = () => {
    const { fixId } = this.state;
    const iframe = document.frames ? document.frames[fixId] : document.getElementById(fixId);
    // const iframeWindow = iframe.contentWindow || iframe;

    iframe.focus();
    iframe.contentWindow.print();
    this.iframeRef.current = iframe;
    this.iframeRef.current.contentWindow.addEventListener('afterprint', this.handleAfterPrint);
    return false;
  };

  debounceFinish = debounce(() => {
    const { onFinish } = this.props;
    if (onFinish) {
      onFinish();
    }
  }, 100);

  handleAfterPrint = () => {
    this.finish = true;
    const frame = this.iframeRef.current;
    if (frame && frame.contentWindow) {
      // debugger;
      frame.contentWindow.removeEventListener('afterprint', this.handleAfterPrint);
      // frame.parentNode.removeChild(this.iframeRef.current);
      this.debounceFinish();
    }
  };

  render() {
    const { content, title = 'Print' } = this.props;
    const { fixId } = this.state;
    if (!content || this.finish) {
      return null;
    }
    return (
      <iframe
        id={fixId}
        name={fixId}
        src={content}
        style={{ display: 'none' }}
        onLoad={this.printIframe}
        title={title}
      />
    );
  }
}

export default PaymentConfirmation;
