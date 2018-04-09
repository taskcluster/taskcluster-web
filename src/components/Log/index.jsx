import { Component, Fragment } from 'react';
import { arrayOf, bool, node, number, oneOfType, string } from 'prop-types';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import storage from 'localforage';
import { withStyles } from 'material-ui/styles';
import Spinner from '../Spinner';

const Loading = () => <Spinner loading />;

@withStyles(theme => ({
  '@global': {
    'div.react-lazylog': {
      backgroundColor: `${theme.palette.primary.dark}`,
      fontFamily: 'Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace',
      fontSize: 13,
      paddingTop: theme.spacing.triple,
      paddingBottom: theme.spacing.unit,
      color: 'rgba(255, 255, 255, 0.7)',
      '-webkit-font-smoothing': 'auto',
    },
  },
  highlight: {
    backgroundColor: `${theme.palette.action.selected} !important`,
  },
  line: {
    '& > a': {
      transition: theme.transitions.create('color'),
      color: theme.palette.text.inactive,
    },
    '&:hover > a': {
      color: `${theme.palette.text.primary} !important`,
    },
    '&$highlight > a': {
      color: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: `${theme.palette.action.hover} !important`,
    },
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.double,
    right: theme.spacing.triple,
  },
  miniFab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 11,
    right: theme.spacing.quad,
  },
}))
export default class Log extends Component {
  static propTypes = {
    url: string.isRequired,
    stream: bool,
    actions: oneOfType([node, arrayOf(node)]),
    lineNumber: number,
  };

  static defaultProps = {
    onHighlight: null,
    stream: false,
    actions: null,
    lineNumber: null,
  };

  shouldStartFollowing() {
    if (!this.props.stream) {
      return false;
    }

    const pref = storage.getItem('follow-log');

    if (typeof pref === 'boolean') {
      return pref;
    }

    return this.props.stream;
  }

  // scrollToLine(following) {
  //   if (following) {
  //     return null;
  //   }
  //
  //   if (this.state.jump) {
  //
  //   }
  // }

  render() {
    const { url, stream, classes, actions, lineNumber, ...props } = this.props;

    if (!stream) {
      return (
        <Fragment>
          <LazyLog
            url={url}
            scrollToLine={lineNumber}
            selectableLines
            lineClassName={classes.line}
            highlightLineClassName={classes.highlight}
            loadingComponent={Loading}
            {...props}
          />
          {actions}
        </Fragment>
      );
    }

    return (
      <ScrollFollow
        startFollowing={this.shouldStartFollowing()}
        render={({ follow }) => (
          <LazyLog
            url={url}
            follow={follow}
            selectableLines
            // scrollToLine={
            //   !follow &&
            //   ((this.state.jump ? lineNumber : null) ||
            //     (highlight ? scrollToLine : null))
            // }
            // scrollToAlignment="start"
            // highlight={highlight}
            // onHighlight={onHighlight}
            // onScroll={this.handleScroll}
          />
        )}
      />
    );
  }
}

/*
<SpeedDial
            icon={
              <SpeedDialIcon
                icon={<DotsVerticalIcon />}
                openIcon={<ArrowRightIcon />}
              />
            }>
            <SpeedDialAction
              ButtonProps={{ color: 'secondary' }}
              icon={<NumericIcon />}
              tooltipTitle="Go to line..."
              onClick={this.handleClick}
            />
          </SpeedDial>
 */

// export default class LogView extends PureComponent {
//   static propTypes = {
//     queue: object,
//     taskId: string,
//     runId: number,
//     status: object,
//     log: object,
//     highlight: oneOfType([arrayOf(number), number]),
//     onHighlight: func
//   };
//
//   constructor(props) {
//     super(props);
//
//     const streaming = this.isStreaming(props.status);
//
//     this.state = {
//       streaming,
//       follow: streaming || this.prefersFollow(),
//       isFullscreen: false,
//       fullscreenEnabled: fscreen.fullscreenEnabled,
//       lazyViewerHeight: VIEWER_HEIGHT_MIN,
//       jump: false,
//       lineNumber: ''
//     };
//   }
//
//   componentWillMount() {
//     fscreen.addEventListener(
//       'fullscreenchange',
//       this.handleFullscreenChange,
//       false
//     );
//     window.addEventListener('resize', this.handleLazyViewerHeight);
//   }
//
//   componentDidMount() {
//     this.handleLazyViewerHeight();
//   }
//
//   componentWillUnmount() {
//     fscreen.removeEventListener(
//       'fullscreenchange',
//       this.handleFullscreenChange
//     );
//     window.removeEventListener('resize', this.handleLazyViewerHeight);
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (
//       nextProps.taskId !== this.props.taskId ||
//       nextProps.runId !== this.props.runId ||
//       nextProps.status !== this.props.status ||
//       (nextProps.log &&
//         this.props.log &&
//         nextProps.log.name !== this.props.log.name)
//     ) {
//       const streaming = this.isStreaming(nextProps.status);
//
//       this.setState({
//         streaming,
//         follow: streaming || this.prefersFollow(),
//         isFullscreen: false
//       });
//     }
//   }
//
//   componentDidUpdate() {
//     this.handleLazyViewerHeight();
//
//     if (this.state.jump) {
//       // eslint-disable-next-line react/no-did-update-set-state
//       this.setState({ jump: false });
//     }
//   }
//
//   prefersFollow() {
//     return localStorage.getItem('follow-log') === 'true';
//   }
//
//   handleJump = () => {
//     this.setState({
//       lineNumber: this.state.lineNumber,
//       jump: true,
//       follow: false
//     });
//   };
//
//   isStreaming(status) {
//     return status
//       ? status.state === 'pending' || status.state === 'running'
//       : false;
//   }
//
//   handleFollowClick = () => {
//     localStorage.setItem('follow-log', !this.state.follow);
//     this.setState({ follow: !this.state.follow });
//   };
//
//   handleScroll = ({ scrollTop, scrollHeight, clientHeight }) => {
//     if (this.state.follow && scrollHeight - scrollTop !== clientHeight) {
//       this.setState({ follow: false });
//     }
//   };
//
//   handleFullscreen = () =>
//     this.lazylog && fscreen.requestFullscreen(this.lazylog);
//
//   handleFullscreenChange = () => {
//     this.setState({
//       isFullscreen: fscreen.fullscreenElement !== null
//     });
//   };
//
//   handleLazyViewerHeight = () => {
//     if (this.lazylog) {
//       const lazyViewerHeight =
//         window.innerHeight -
//         Math.round(this.lazylog.getBoundingClientRect().top);
//
//       if (lazyViewerHeight > VIEWER_HEIGHT_MIN) {
//         this.setState({ lazyViewerHeight });
//       }
//     }
//   };
//
//   registerChild = ref => {
//     if (!ref) {
//       return;
//     }
//
//     const node = findDOMNode(ref);
// eslint-disable-line react/no-find-dom-node
//
//     if (!node) {
//       return;
//     }
//
//     [this.lazylog] = node.children;
//   };
//
//   handleLineNumberChange = ({ target }) =>
//     this.setState({ lineNumber: target.value });
//
//   render() {
//     const {
//       queue,
//       taskId,
//       runId,
//       status,
//       log,
//       highlight,
//       onHighlight
//     } = this.props;
//     const {
//       streaming,
//       follow,
//       fullscreenEnabled,
//       isFullscreen,
//       lazyViewerHeight,
//       lineNumber
//     } = this.state;
//
//     if (!queue || !taskId || isNil(runId) || !status || !log) {
//       return null;
//     }
//
//     const scrollToLine = Array.isArray(highlight) ? highlight[0] : highlight;
//     const url = queue.buildUrl(queue.getArtifact, taskId, runId, log.name);
//     const LazyViewer = streaming ? LazyStream : LazyLog;
//
//     return (
//       <div>
//         <div>
//           <Button
//             onClick={this.handleFollowClick}
//             bsSize="sm"
//             style={buttonStyle}>
//             <Icon name={follow ? 'check-square-o' : 'square-o'} />
//             &nbsp;&nbsp;Follow log
//           </Button>
//
//           <ModalItem
//             bsSize="sm"
//             bsStyle="default"
//             button
//             style={{ margin: '10px 0px 10px 10px' }}
//             onComplete={this.handleJump}
//             body={
//               <FormControl
//                 type="number"
//                 placeholder="0"
//                 autoComplete="off"
//                 onChange={this.handleLineNumberChange}
//                 value={this.state.lineNumber}
//               />
//             }>
//             <Icon name="sort-numeric-asc" /> Go to line
//           </ModalItem>
//
//           <Button
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             bsSize="sm"
//             style={buttonStyle}>
//             <Icon name="external-link-square" />&nbsp;&nbsp;View raw log
//           </Button>
//
//           {fullscreenEnabled && (
//             <Button
//               onClick={this.handleFullscreen}
//               bsSize="sm"
//               style={buttonStyle}>
//               <Icon name="arrows-alt" />&nbsp;&nbsp;View fullscreen
//             </Button>
//           )}
//         </div>
//
//         <ScrollFollow startFollowing={follow}>
//           {({ follow }) => (
//             <LazyViewer
//               ref={this.registerChild}
//               url={url}
//               height={
//                 isFullscreen
//                   ? document.documentElement.clientHeight
//                   : lazyViewerHeight
//               }
//               follow={follow}
//               scrollToLine={
//                 !follow &&
//                 ((this.state.jump ? lineNumber : null) ||
//                   (highlight ? scrollToLine : null))
//               }
//               scrollToAlignment="start"
//               highlight={highlight}
//               onHighlight={onHighlight}
//               onScroll={this.handleScroll}
//             />
//           )}
//         </ScrollFollow>
//       </div>
//     );
//   }
// }
