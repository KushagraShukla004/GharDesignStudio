import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}
interface EbState {
  hasError: boolean;
}

/**
 * Stops a crash in one view (notably a WebGL failure in the 3D preview on
 * devices without WebGL) from blanking the whole app. Resets when children
 * change (i.e. when the user switches tabs).
 */
export class ErrorBoundary extends Component<Props, EbState> {
  state: EbState = { hasError: false };

  static getDerivedStateFromError(): EbState {
    return { hasError: true };
  }

  componentDidUpdate(prev: Props) {
    if (prev.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
