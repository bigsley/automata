import React from 'react';

const Grid = React.createClass({
  /**
   * @return {Object}
   */
  getInitialState() {
    const {
      margin,
      size,
    } = this.props;

    return {
      style: {
        margin: margin,
        width: size,
        height: size,
      },
    };
  },

  componentWillReceiveProps(nextProps) {
    const {
      margin,
      size,
    } = nextProps;

    this.setState({
      style: {
        margin: margin,
        width: size,
        height: size,
      },
    });
  },

  render() {
    const {
      grid,
    } = this.props;

    const {
      style,
    } = this.state;

    if (!grid) {
      return null;
    }

    return (
      <div className='grid'>
        {grid.map((row) => {
          return (
            <div className='grid--row'>
              {row.map((cell) => {
                let className = 'grid--cell ';
                if (cell) {
                  className += 'grid--cell-live';
                } else {
                  className += 'grid--cell-dead';
                }
                return (
                  <div
                    className={className}
                    style={style}
                  >
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
});

module.exports = Grid;
