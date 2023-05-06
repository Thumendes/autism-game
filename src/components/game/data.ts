export const boardConfig = [
  [0, 4, 5, 6, 0, 0, 0],
  [0, 3, 0, 7, 0, 13, 14],
  [1, 2, 0, 8, 0, 12, 0],
  [0, 0, 0, 9, 10, 11, 0],
];

export const STEP_COUNT = boardConfig.reduce((acc, row) => {
  const rowSteps = row.reduce((acc, cell) => {
    return acc + (cell ? 1 : 0);
  }, 0);

  return acc + rowSteps;
}, 0);

export const ROLLBACK_POSITION = 7;

export const ROLLBACK_COUNT = 5;
