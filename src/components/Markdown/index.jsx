import { Component } from 'react';
import MarkdownToJSX from 'markdown-to-jsx';
import AnchorOrLink from './AnchorOrLink';

const options = {
  overrides: {
    a: AnchorOrLink,
  },
};

export default class Markdown extends Component {
  render() {
    return <MarkdownToJSX options={options} {...this.props} />;
  }
}
