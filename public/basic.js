'use strict';

const MAX_WIDTH=600;
const MAX_HEIGHT=600;
const MARGIN=1;
let animating = false;
let animateInterval = null;
let grid = [];
let msPerLoop = 1000.0 / parseFloat($('#frequency').val());

const buildGrid = (fn) => {
  const width = parseInt($('#width').val());
  const height = parseInt($('#height').val());

  const newGrid = [];
  const liveFunction = fn ? fn : () => false;

  for (let i = 0; i < height; i++) {
    let row = [];

    for (let j = 0; j < width; j++) {
      row[j] = liveFunction(i, j);
    }

    newGrid.push(row);
  }

  return newGrid;
};

const createCellElement = (live, cellStyle) => {
  const cellElement = $(`<div class="cell" style='${cellStyle}'></div>`);

  if (live) {
    cellElement.addClass('live');
  } else {
    cellElement.addClass('dead');
  }

  return cellElement;
};

const renderGrid = () => {
  const boxElement = $('#box');
  boxElement.html('');
  const height = grid.length;
  const width = (grid[0] && grid[0].length) || 0;

  if (!(height && width)) {
    boxElement.html('ERROR');
    return;
  }

  const cellHeight = (MAX_HEIGHT - 2 * height * MARGIN) / height;
  const cellWidth = (MAX_HEIGHT - 2 * width * MARGIN) / width;

  if (cellWidth < 1.0 || cellHeight < 1.0) {
    boxElement.html('ERROR');
    return;
  }

  const cellStyle =
    `width: ${cellWidth}px; height: ${cellHeight}px; margin: ${MARGIN}px;`;

  grid.forEach((row) => {
    const rowElement = $('<div class="row"></div>');
    row.forEach((cellValue) => {
      rowElement.append(createCellElement(cellValue, cellStyle));
    });

    boxElement.append(rowElement);
  });
};

const handleSizeChange = () => {
  grid = buildGrid();
  renderGrid();
}

const handleRandomize = () => {
  const randomFn = () => Math.random() < 0.5;

  grid = buildGrid(randomFn);
  renderGrid();
};

const _lifeFunction = (x, y) => {
  let numLiveNeighbors = 0;

  for (let checkX = x-1; checkX < x+2; checkX++) {
    for (let checkY = y-1; checkY < y+2; checkY++) {
      if (checkX !== x || checkY !== y) {
        numLiveNeighbors += grid[checkX] && grid[checkX][checkY] ? 1 : 0;
      }
    }
  }

  if (numLiveNeighbors === 2) {
    return grid[x][y];
  }

  if (numLiveNeighbors === 3) {
    return true;
  }

  return false;
}

const handleAnimateToggle = () => {
  animating = !animating;

  if (animating) {
    msPerLoop = 1000.0 / parseFloat($('#frequency').val());

    const animateLoop = () => {
      grid = buildGrid(_lifeFunction);
      renderGrid();
    }

    animateInterval = setInterval(animateLoop, msPerLoop);

    $('#animate-button').html('Stop Animating');
  } else {
    if (animateInterval) {
      clearInterval(animateInterval);
      animateInterval = null;
    }

    $('#animate-button').html('Animate');
  }
}

$(document).ready(() => {
  grid = buildGrid();
  renderGrid();

  $('#width').keyup(handleSizeChange);
  $('#height').keyup(handleSizeChange);
  $('#randomize-button').click(handleRandomize);
  $('#animate-button').click(handleAnimateToggle);
});
