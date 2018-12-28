import React, { Component } from 'react';
import { string, object, oneOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import STable from 'react-schema-viewer/lib/SchemaTable';

@withStyles(
  {},
  {
    withTheme: true,
  }
)
/**
 * Display a SchemaTable asynchronously
 */
export default class SchemaTable extends Component {
  defaultProps = {
    schema: oneOf([string, object]).isRequired,
  };

  state = {
    schema: null,
  };

  async componentDidMount() {
    const { schema } = this.props;

    if (!this.state.schema && schema) {
      const result =
        typeof schema === 'string'
          ? await (await fetch(schema)).json()
          : schema;

      this.setState({ schema: result });
    }
  }

  render() {
    const { theme } = this.props;
    const { schema } = this.state;

    return schema ? (
      <STable
        headerBackgroundColor={
          theme.palette.type === 'light' ? 'rgb(240,240,240)' : 'rgb(43,57,69)'
        }
        schema={schema}
      />
    ) : (
      'Loading...'
    );
  }
}
