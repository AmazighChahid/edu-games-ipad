/**
 * Calcul Posé game engine
 * Pure logic for calculation exercises
 */

import type {
  CalculationProblem,
  CalculPoseGameState,
  DigitCell,
  Operation,
  CalculPoseLevelConfig,
} from '../types';

/**
 * Generate a random calculation problem based on level config
 */
export function generateProblem(config: CalculPoseLevelConfig): CalculationProblem {
  const { operation, minOperand, maxOperand, requiresCarry } = config;

  let operand1: number;
  let operand2: number;
  let result: number;

  do {
    operand1 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;
    operand2 = Math.floor(Math.random() * (maxOperand - minOperand + 1)) + minOperand;

    // Ensure operand1 >= operand2 for subtraction
    if (operation === 'subtraction' && operand1 < operand2) {
      [operand1, operand2] = [operand2, operand1];
    }

    result = operation === 'addition' ? operand1 + operand2 : operand1 - operand2;

    // Check carry requirement
    const hasCarry = checkHasCarry(operand1, operand2, operation);
    if (requiresCarry && !hasCarry) continue;
    if (!requiresCarry && hasCarry) continue;

    break;
  } while (true);

  return { operand1, operand2, operation, result };
}

/**
 * Check if operation involves a carry
 */
function checkHasCarry(a: number, b: number, operation: Operation): boolean {
  if (operation === 'addition') {
    // Check if any column sum >= 10
    const aStr = a.toString();
    const bStr = b.toString();
    const maxLen = Math.max(aStr.length, bStr.length);
    let carry = 0;

    for (let i = 0; i < maxLen; i++) {
      const aDigit = parseInt(aStr[aStr.length - 1 - i] || '0');
      const bDigit = parseInt(bStr[bStr.length - 1 - i] || '0');
      const sum = aDigit + bDigit + carry;
      if (sum >= 10) return true;
      carry = Math.floor(sum / 10);
    }
    return false;
  } else {
    // Subtraction - check if borrowing needed
    const aStr = a.toString();
    const bStr = b.toString();

    for (let i = 0; i < bStr.length; i++) {
      const aDigit = parseInt(aStr[aStr.length - 1 - i] || '0');
      const bDigit = parseInt(bStr[bStr.length - 1 - i] || '0');
      if (aDigit < bDigit) return true;
    }
    return false;
  }
}

/**
 * Get digits of a number (right to left: units, tens, hundreds)
 */
export function getDigits(num: number): number[] {
  if (num === 0) return [0];
  const digits: number[] = [];
  let n = Math.abs(num);
  while (n > 0) {
    digits.push(n % 10);
    n = Math.floor(n / 10);
  }
  return digits;
}

/**
 * Create initial cells for the calculation board
 */
export function createCells(problem: CalculationProblem): DigitCell[] {
  const { operand1, operand2, result } = problem;
  const cells: DigitCell[] = [];

  const op1Digits = getDigits(operand1);
  const op2Digits = getDigits(operand2);
  const resultDigits = getDigits(result);

  const maxColumns = Math.max(op1Digits.length, op2Digits.length, resultDigits.length);

  // Row 0: operand1 (displayed, not editable)
  for (let col = 0; col < maxColumns; col++) {
    cells.push({
      id: `cell-0-${col}`,
      row: 0,
      column: col,
      expectedValue: op1Digits[col] ?? null,
      userValue: op1Digits[col] ?? null,
      isEditable: false,
      isCorrect: null,
    });
  }

  // Row 1: operand2 (displayed, not editable)
  for (let col = 0; col < maxColumns; col++) {
    cells.push({
      id: `cell-1-${col}`,
      row: 1,
      column: col,
      expectedValue: op2Digits[col] ?? null,
      userValue: op2Digits[col] ?? null,
      isEditable: false,
      isCorrect: null,
    });
  }

  // Row 2: result (editable - user must fill in)
  for (let col = 0; col < maxColumns; col++) {
    cells.push({
      id: `cell-2-${col}`,
      row: 2,
      column: col,
      expectedValue: resultDigits[col] ?? null,
      userValue: null,
      isEditable: resultDigits[col] !== undefined,
      isCorrect: null,
    });
  }

  return cells;
}

/**
 * Create initial game state
 */
export function createInitialState(config: CalculPoseLevelConfig): CalculPoseGameState {
  const problem = generateProblem(config);
  const cells = createCells(problem);

  // Find first editable cell
  const firstEditable = cells.find(c => c.isEditable);

  return {
    problem,
    cells,
    currentCellId: firstEditable?.id ?? null,
    drawingPaths: [],
    recognizedDigit: null,
    carry: [],
  };
}

/**
 * Update a cell with user input
 */
export function updateCellValue(
  state: CalculPoseGameState,
  cellId: string,
  value: number | null
): CalculPoseGameState {
  const cells = state.cells.map(cell => {
    if (cell.id === cellId && cell.isEditable) {
      const isCorrect = value === cell.expectedValue;
      return {
        ...cell,
        userValue: value,
        isCorrect,
      };
    }
    return cell;
  });

  return { ...state, cells };
}

/**
 * Move to next editable cell
 */
export function moveToNextCell(state: CalculPoseGameState): CalculPoseGameState {
  const editableCells = state.cells.filter(c => c.isEditable);
  const currentIndex = editableCells.findIndex(c => c.id === state.currentCellId);

  if (currentIndex < editableCells.length - 1) {
    return {
      ...state,
      currentCellId: editableCells[currentIndex + 1].id,
      drawingPaths: [],
      recognizedDigit: null,
    };
  }

  return state;
}

/**
 * Check if all result cells are filled correctly
 */
export function checkVictory(state: CalculPoseGameState): boolean {
  const resultCells = state.cells.filter(c => c.row === 2 && c.isEditable);
  return resultCells.every(cell => cell.isCorrect === true);
}

/**
 * Check if all result cells are filled (correct or not)
 */
export function isComplete(state: CalculPoseGameState): boolean {
  const resultCells = state.cells.filter(c => c.row === 2 && c.isEditable);
  return resultCells.every(cell => cell.userValue !== null);
}

/**
 * Get the number of correct digits
 */
export function getCorrectCount(state: CalculPoseGameState): number {
  return state.cells.filter(c => c.row === 2 && c.isCorrect === true).length;
}

/**
 * Get the total number of digits to fill
 */
export function getTotalDigits(state: CalculPoseGameState): number {
  return state.cells.filter(c => c.row === 2 && c.isEditable).length;
}

/**
 * Clear drawing paths
 */
export function clearDrawing(state: CalculPoseGameState): CalculPoseGameState {
  return {
    ...state,
    drawingPaths: [],
    recognizedDigit: null,
  };
}

/**
 * Get operation symbol
 */
export function getOperationSymbol(operation: Operation): string {
  return operation === 'addition' ? '+' : '−';
}
