import Grid from '../Grid/index.jsx';
import React from 'react';

const constructGrid = (width, height) => {
  const grid = [];

  for (let i=0; i < height; i++) {
    const row = [];
    for(let j=0; j < width; j++) {
      row.push(false);
    }
    grid.push(row);
  }

  return grid;
}

let memoizeMap = [];

const nextGrid = (grid, born, live) => {
  if (!(grid && grid.length && grid[0].length)) {
    return [];
  }

  const newGrid = [];

  for (let y=0; y<grid.length; y++) {
    const newGridRow = [];

    for (let x=0; x<grid[0].length; x++) {
      let numLiveNeighbors = 0;
      let memoizeIndex = 0;
      let memoizeBit = 1;

      for (let checkX = x-1; checkX < x+2; checkX++) {
        for (let checkY = y-1; checkY < y+2; checkY++) {
          const val = grid[checkY] && grid[checkY][checkX] ? 1 : 0;

          if (val !== undefined) {
            if (checkX !== x || checkY !== y) {
              numLiveNeighbors += val;
            }

            memoizeIndex += memoizeBit * val;
            memoizeBit <<= 1;
          }
        }
      }

      const memoizeVal = memoizeMap[memoizeIndex];
      if (memoizeVal !== undefined) {
        newGridRow.push(memoizeVal);
      } else {
        let liveVal;
        if (born.includes(numLiveNeighbors) && !grid[y][x]) {
          liveVal = true;
        } else if (live.includes(numLiveNeighbors)) {
          liveVal = grid[y][x];
        } else {
          liveVal = false;
        }
        memoizeMap[memoizeIndex] = liveVal;
        newGridRow.push(liveVal);
      }
    }

    newGrid.push(newGridRow);
  }

  return newGrid;
}

let time = Date.now();
let count = 0;

const GridController = React.createClass({
  getInitialState: function() {
    const {
      height,
      width,
    } = this.props;

    const grid = constructGrid(width, height);

    return {
      animating: false,
      grid: grid,
    };
  },

  componentWillReceiveProps(nextProps) {
    const {
      born,
      frequency,
      live,
      height,
      width,
    } = nextProps;

    const {
      born: oldBorn,
      frequency: oldFrequency,
      live: oldLive,
      height: oldHeight,
      width: oldWidth,
    } = this.props;

    if (height !== oldHeight || width !== oldWidth) {
      const grid = constructGrid(width, height);

      this.setState({grid: grid});
    }

    if (frequency !== oldFrequency || born !== oldBorn || live !== oldLive) {
      console.log('yo?');
      this._resetInterval(nextProps);
    }
  },

  _createInterval(someProps) {
    count = 0;
    time = Date.now();
    const animateLoop = () => {
      const {
        born,
        live,
      } = someProps;

      const newGrid = nextGrid(this.state.grid, born, live);

      count++;
      const timePerStep = (Date.now() - time) / count;

      this.setState({
        grid: newGrid,
        timePerStep: timePerStep,
      });
    }

    const msPerLoop = 1000.0 / someProps.frequency;
    this.setState({animateInterval: setInterval(animateLoop, msPerLoop)});
  },

  _destroyInterval() {
    const {
      animateInterval,
    } = this.state;

    clearInterval(animateInterval);
    this.setState({animateInterval: null});
  },

  _resetInterval(nextProps) {
    if (this.state.animateInterval) {
      this._destroyInterval();
      this._createInterval(nextProps);
    }
  },

  handleRandomize() {
    const {
      height,
      width,
    } = this.props;

    const {
      grid,
    } = this.state;

    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        grid[i][j] = Math.random() < 0.5;
      }
    }

    this.setState({grid: grid});
  },

  handleAnimate() {
    if (this.state.animateInterval) {
      this._destroyInterval();
    } else {
      this._createInterval(this.props);
    }
  },

  render() {
    return (
      <div>
        <Grid
          grid={this.state.grid}
          height={this.props.height}
          margin={this.props.margin}
          size={this.props.size}
          width={this.props.width}
        />
        <button
          onClick={this.handleRandomize}
        >
          Randomize
        </button>
        <button
          onClick={this.handleAnimate}
        >
          Animate
        </button>
        <div>
          {Math.round(this.state.timePerStep || 0)} ms/step
        </div>
      </div>
    );
  }
});

module.exports = GridController;
