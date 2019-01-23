import React, { Component } from 'react';
import { string, object, oneOf } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from 'react-schema-viewer/lib/SchemaTable';
import { THEME } from '../../utils/constants';

@withStyles(
  theme => {
    const borderColor =
      theme.palette.type === 'dark'
        ? THEME.TEN_PERCENT_WHITE
        : THEME.TEN_PERCENT_BLACK;

    return {
      bootstrapTable: {
        fontSize: 16,
        overflowX: 'auto',
        /* eslint-disable no-dupe-keys */
        // Copied from https://github.com/twbs/bootstrap/blob/f7e8445f72875a49a909dc0af8e4cf43f19f535e/dist/css/bootstrap.css#L1515-L1536
        '& .table': {
          width: '100%',
          marginBottom: '1rem',
        },
        '& .table th, & .table td': {
          padding: '0.75rem',
          verticalAlign: 'top',
          borderTop: `1px solid ${borderColor}`,
        },
        '& .table thead th': {
          verticalAlign: 'bottom',
          borderBottom: `2px solid ${borderColor}`,
          '& table tbody + tbody': {
            borderTop: `2px solid ${borderColor}`,
          },
        },
        '& .table': {
          width: '100%',
          marginBottom: '1rem',
        },
        '& .table th, & .table td': {
          padding: '0.75rem',
          verticalAlign: 'top',
          borderTop: `1px solid ${borderColor}`,
        },
        '& .table thead th': {
          verticalAlign: 'bottom',
          borderBottom: `2px solid ${borderColor}`,
          '& table tbody + tbody': {
            borderTop: `2px solid ${borderColor}`,
          },
        },
        // Copied from https://github.com/twbs/bootstrap/blob/f7e8445f72875a49a909dc0af8e4cf43f19f535e/dist/css/bootstrap.css#L1547-L1559
        '& .table-bordered': {
          border: `1px solid ${borderColor}`,
        },
        '& .table-bordered th': {
          border: `1px solid ${borderColor}`,
        },
        '& .table-bordered thead th, & .table-bordered thead td': {
          borderBottomWidth: 2,
        },
        /* eslint-enable no-dupe-keys */
      },
    };
  },
  { withTheme: true }
)
/**
 * Display a SchemaTable asynchronously
 */
export default class SchemaTable extends Component {
  static defaultProps = {
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
    const { classes, theme } = this.props;
    const { schema } = this.state;
    const headerBackground =
      theme.palette.type === 'light' ? 'rgb(240,240,240)' : 'rgb(43,57,69)';

    return schema ? (
      <div className={classes.bootstrapTable}>
        <Table headerBackgroundColor={headerBackground} schema={schema} />
      </div>
    ) : (
      'Loading Schema...'
    );
  }
}
