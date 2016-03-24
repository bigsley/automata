import GridController from '../GridController/index.jsx';
import React from 'react';

const GridInputController = React.createClass({
  getInitialState: function() {
    return {
      height: 100,
      width: 100,
      frequency: 100,
      born: '3',
      bornArray: [3],
      live: '2,3',
      liveArray: [2, 3],
      margin: 1,
      size: 3,
    };
  },

  heightChange(event) {
    const height = parseInt(event.target.value) || 0;
    this.setState({height: height});
  },

  widthChange(event) {
    const width = parseInt(event.target.value) || 0;
    this.setState({width: width});
  },

  frequencyChange(event) {
    const frequency = parseInt(event.target.value) || 0;
    this.setState({frequency: frequency});
  },

  bornChange(event) {
    const born = event.target.value;
    const bornArray = born.split(',').map(x => parseInt(x));
    this.setState({
      born: born,
      bornArray: bornArray
    });
  },

  liveChange(event) {
    const live = event.target.value;
    const liveArray = live.split(',').map(x => parseInt(x));
    this.setState({
      live: live,
      liveArray: liveArray,
    });
  },

  marginChange(event) {
    const margin = event.target.value || 0;
    this.setState({margin: margin})
  },

  sizeChange(event) {
    const size = event.target.value || 0;
    this.setState({size: size})
  },

  render() {
    const {
      bornArray,
      liveArray,
      height,
      width,
      frequency,
      born,
      live,
      margin,
      size
    } = this.state;

    return (
      <div className='columns'>
        <div className='column'>
          <GridController
            height={height}
            width={width}
            frequency={frequency}
            born={bornArray}
            live={liveArray}
            margin={margin}
            size={size}
          />
        </div>
        <div className='column'>
          <div className='input'>
            <div className='label'>
              Height
            </div>
            <input
              type="text"
              value={height}
              onChange={this.heightChange}
            />
          </div>
          <div className='input'>
            <div className='label'>
              Width
            </div>
            <input
              type="text"
              value={width}
              onChange={this.widthChange}
            />
          </div>
          <div className='input'>
            <div className='label'>
              Frequency (hz)
            </div>
            <input
              type="text"
              value={frequency}
              onChange={this.frequencyChange}
            />
          </div>
          <div className='input'>
            <div className='label'>
              Born
            </div>
            <input
              type="text"
              value={born}
              onChange={this.bornChange}
            />
          </div>
          <div className='input'>
            <div className='label'>
              Live
            </div>
            <input
              type="text"
              value={live}
              onChange={this.liveChange}
            />
          </div>
        </div>
        <div className='column'>
          <div className='input'>
            <div className='label'>
              Margin (px)
            </div>
            <input
              type="text"
              value={margin}
              onChange={this.marginChange}
            />
          </div>
          <div className='input'>
            <div className='label'>
              Cell Size (px)
            </div>
            <input
              type="text"
              value={size}
              onChange={this.sizeChange}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = GridInputController;

