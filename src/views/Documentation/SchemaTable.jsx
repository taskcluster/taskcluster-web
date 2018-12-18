import React, { Component } from 'react';
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
  state = {
    schema: null,
  };

  async componentDidMount() {
    const { url } = this.props;

    if (!this.state.schema && url) {
      const result = await (await fetch(url)).json();

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
