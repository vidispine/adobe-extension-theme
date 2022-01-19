import React from 'react';
import { Container, Paper } from '@material-ui/core';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { error, hasError: true };
  }

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;
    if (hasError) {
      return (
        <Container maxWidth="sm">
          <Paper
            variant="outlined"
            style={{
              backgroundColor: '#313131',
              color: '#eee',
              padding: '8px 16px 32px 16px',
            }}
          >
            <h3>We&apos;re sorry - something went wrong: </h3>
            {error && (
              <div
                style={{
                  color: '#e57373',
                }}
              >
                {error.toString()}
              </div>
            )}
          </Paper>
        </Container>
      );
    }
    return children;
  }
}
