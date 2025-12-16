// @flow
import * as React from 'react';
import BlueScreen from './BlueScreen';

type State = {
  error: ?any,
};

type Props = {
  children: any,
  fallbackComponent?: ?any,
};

class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  componentDidCatch = (error: any, errorInfo: any) => {
    this.setState({ error });
    // React 17 change: component stacks derive from native error frames and
    // may re-execute parts of render/constructors when building stacks.
    // Keep side-effects out of render/constructor; do client-side logging here.
    // Version delta: 16.8.6 -> 17.0.2
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error({ error });
      window.Raven &&
        window.Raven.captureException(error, { extra: errorInfo });
    }
  };

  render() {
    const { error } = this.state;
    const {
      fallbackComponent: FallbackComponent = null,
      children,
    } = this.props;

    if (error) {
      if (this.props.fallbackComponent) {
        // $FlowFixMe
        return <FallbackComponent />;
      }

      if (!this.props.fallbackComponent) {
        return null;
      }

      return <BlueScreen />;
    }

    return children;
  }
}

export default ErrorBoundary;
