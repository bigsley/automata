'use strict';

const MAX_WIDTH=600;
const MAX_HEIGHT=600;
const MARGIN=1;
let animating = false;
let animateInterval = null;
let grid = [];
let gridElements = null;
let msPerLoop = 1000.0 / parseFloat($('#frequency').val());
let liveValues = [2, 3];
let bornValues = [3];
let rounds = 0;
let gridRecord = [];

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

const renderGridRefresh = () => {
  const boxElement = $('#box');
  boxElement.html('');
  const height = grid.length;
  const width = (grid[0] && grid[0].length) || 0;
  gridElements = [];

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
    const gridRow = [];
    const rowElement = $('<div class="row"></div>');
    row.forEach((cellValue) => {
      const element = createCellElement(cellValue, cellStyle)
      rowElement.append(element);
      gridRow.push(element);
    });

    boxElement.append(rowElement);
    gridElements.push(gridRow);
  });
};

const renderGrid = () => {
  if (!gridElements) {
    renderGridRefresh();
  } else {
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[0].length ; j++) {
        const live = grid[i][j];

        if (live) {
          gridElements[i][j].removeClass('dead');
          gridElements[i][j].addClass('live');
        } else {
          gridElements[i][j].removeClass('live');
          gridElements[i][j].addClass('dead');
        }
      }
    }
  }
};

const handleSizeChange = () => {
  grid = buildGrid();
  renderGridRefresh();
}

const handleRandomize = () => {
  const randomFn = () => Math.random() < 0.5;

  grid = buildGrid(randomFn);
  renderGrid();
};

const handleLiveChange = () => {
  liveValues =
    $('#live')
    .val()
    .split(',')
    .map((x) => parseInt(x))
    .filter((x) => (0 <= x && x <= 8));

  console.log(liveValues);
};

const handleBornChange = () => {
  bornValues =
    $('#born')
    .val()
    .split(',')
    .map((x) => parseInt(x))
    .filter((x) => (0 <= x && x <= 8));

  console.log(bornValues);
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

  if (bornValues.includes(numLiveNeighbors)) {
    return true;
  } else if (liveValues.includes(numLiveNeighbors)) {
    return grid[x][y];
  } else {
    return false;
  }
}

const startAnimating = () => {
  msPerLoop = 1000.0 / parseFloat($('#frequency').val());

  const animateLoop = () => {
    grid = buildGrid(_lifeFunction);
    renderGrid();
  }

  animateInterval = setInterval(animateLoop, msPerLoop);

  $('#animate-button').html('Stop Animating');
}

const stopAnimating = () => {
  if (animateInterval) {
    clearInterval(animateInterval);
    animateInterval = null;
  }

  $('#animate-button').html('Animate');
}

const handleAnimateToggle = () => {
  animating = !animating;

  if (animating) {
    startAnimating();
  } else {
    stopAnimating();
  }
}

const handleLifeRecordToggle = () => {

}

$(document).ready(() => {
  grid = buildGrid();
  renderGrid();

  $('#width').keyup(handleSizeChange);
  $('#height').keyup(handleSizeChange);
  $('#live').keyup(handleLiveChange);
  $('#born').keyup(handleBornChange);
  $('#randomize-button').click(handleRandomize);
  $('#animate-button').click(handleAnimateToggle);
  $('#record-button').click(handleLifeRecordToggle);
});
