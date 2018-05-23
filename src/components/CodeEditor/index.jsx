import { Component } from 'react';
import { object, string, func, number } from 'prop-types';
import CodeMirror from '@skidding/react-codemirror';
import { withStyles } from 'material-ui/styles';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/display/placeholder';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/theme/material.css';
import './yaml-lint';
import './styles.css';

@withStyles({
  codeMirror: {
    width: '100%',
  },
})
/** Render an editor */
export default class CodeEditor extends Component {
  static propTypes = {
    /** Callback function fired when the editor is changed. */
    onChange: func.isRequired,
    /** The value of the editor. */
    value: string.isRequired,
    /** Code mirror options */
    options: object,
    /** The height of the editor. */
    height: number,
    /** The width of the editor. */
    width: number,
  };

  static defaultProps = {
    options: null,
    height: null,
    width: null,
  };

  register = ref => {
    this.codeMirror = ref ? ref.getCodeMirror() : null;
    this.codeMirror.setSize(this.props.width, this.props.height);
  };

  render() {
    const { classes, value, onChange, ...options } = this.props;
    const opts = {
      mode: 'application/json',
      theme: 'material',
      tabSize: 2,
      indentWithTabs: false,
      gutters: ['CodeMirror-lint-markers'],
      lineNumbers: true,
      ...options,
    };

    return (
      <CodeMirror
        ref={this.register}
        className={classes.codeMirror}
        value={value}
        onChange={onChange}
        options={opts}
      />
    );
  }
}
