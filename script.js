const X_CLASS = 'x'
const O_CLASS = 'o'

const WINNING_COMBINATIONS = [
  // horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6],
]

const WINNING_LINE_CLASSES = [
  'board_win_0',
  'board_win_1',
  'board_win_2',
  'board_win_3',
  'board_win_4',
  'board_win_5',
  'board_win_6',
  'board_win_7',
]

// define constants describing field state
const EMPTY = ' '
const X = 'X'
const O = 'O'

const HUMAN = X
const COMPUTER = O

// initialize array containing game state
const gameState = new Array(9).fill(EMPTY)

// handles for HTML elements
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winMessageDiv = document.getElementById('win_message')
const winMessage = document.getElementById('message')
const restartButton = document.getElementById('restart')

// initialize game
function startGame() {
  // data initialization
  gameState.fill(EMPTY)
  // html initialization
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(O_CLASS)
    cell.removeEventListener('click', handleCellClick)
    cell.addEventListener('click', handleCellClick, { once: true })
  })

  restartButton.addEventListener('click', startGame)

  winMessageDiv.classList.remove('visible')

  WINNING_LINE_CLASSES.forEach(className => {
    board.classList.remove(className)
  })
}

startGame()

function handleCellClick(e) {
  // put move on the screen
  const cell = e.target
  cell.classList.add(X_CLASS)
  // save move to the game state
  const index = [...cellElements].indexOf(cell)
  gameState[index] = X
  // check for win
  if (winning(gameState, HUMAN) || draw(gameState)) {
    handleEndgame()
    return
  }
  // perform computer move
  const move = computerMove(gameState)
  cellElements[move].classList.add(O_CLASS)
  gameState[move] = O
  if (winning(gameState, COMPUTER) || draw(gameState)) { 
    handleEndgame()
    return
  }
}

function handleEndgame() {
  if (winning(gameState, HUMAN)) {
    winMessage.innerText = 'You won!'
  } else if (winning(gameState, COMPUTER)) {
    winMessage.innerText = 'Computer won!'
  } else if (draw(gameState)) {
    winMessage.innerText = "It's a draw!"
  }

  WINNING_COMBINATIONS.forEach((combination, index) => {
    const match = (
      gameState[combination[0]] == gameState[combination[1]] &&
      gameState[combination[1]] == gameState[combination[2]]
    )
    if (match) {
      board.classList.add(`board_win_${index}`)
    }
  })

  winMessageDiv.classList.add('visible')
}

// Section containing AI part

function computerMove(state) {
  let bestVal = -Infinity
  let bestMove = -1

  state.forEach((cell, index) => {
    if (cell == EMPTY) {
      const newState = [...state]
      newState[index] = COMPUTER
      const val = minimax(newState, 0, false, -Infinity, +Infinity)
      if (val > bestVal) {
        bestVal = val
        bestMove = index
      }
    }
  })

  return bestMove
}

function minimax(state, depth, maximize, alpha, beta) {
  const score = evaluate(state)
  if (score === -10) return score + depth
  if (score === 10) return score - depth
  if (draw(state)) return 0

  let bestVal = maximize ? -Infinity : Infinity

  for (let i = 0; i < 10; i++) {
    if (state[i] === EMPTY) {
      const newState = [...state]
      newState[i] = maximize ? COMPUTER : HUMAN
      const val = minimax(newState, depth+1, !maximize, alpha, beta)
      if (maximize) {
        bestVal = Math.max(bestVal, val)
        alpha = Math.max(alpha, bestVal)
      }
      if (!maximize) {
        bestVal = Math.min(bestVal, val)
        beta = Math.min(beta, bestVal)
      }
      if (alpha >= beta) break
    }
  }

  return bestVal
}

function evaluate(state) {
  if (winning(state, HUMAN)) return -10
  if (winning(state, COMPUTER)) return 10
  return 0
}

function draw(state) {
  return state.every(cell => cell != EMPTY)
}

function winning(state, player) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index =>
      state[index] == player
    )
  )
}

// startGame()

// // restartButton.addEventListener('click', startGame)

// function startGame() {
//   circleTurn = false
//   state.fill(EMPTY)
//   cellElements.forEach(cell => {
//     cell.classList.remove(X_CLASS)
//     cell.classList.remove(O_CLASS)
//     cell.removeEventListener('click', handleClick)
//     cell.addEventListener('click', handleClick, { once: true })
//   })
//   setBoardHoverClass()
//   // winningMessageElement.classList.remove('show')
// }

// function handleClick(e) {
//   const cell = e.target
//   const currentClass = circleTurn ? O_CLASS : X_CLASS
//   placeMark(cell, currentClass)
//   if (checkWinState(state)) {
//     endGame(false)
//   } else if (isDrawState(state)) {
//     endGame(true)
//   } else {
//     swapTurns()
//     setBoardHoverClass()
//     circleTurn && computerMove()
//   }
// }

// function endGame(draw) {
//   if (draw) {
//     winningMessageTextElement.innerText = 'Draw!'
//   } else {
//     winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
//   }
//   winningMessageElement.classList.add('show')
// }

// function isDraw() {
//   return [...cellElements].every(cell => {
//     return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
//   })
// }

// function isDrawState(state) {
//   const filled = state.every(field => {
//     return field != EMPTY
//   })

//   return filled && !checkWinState(state)
// }

// function placeMark(cell, currentClass) {
//   cell.classList.add(currentClass)
//   const index = [...cellElements].indexOf(cell)
//   state[index] = (currentClass == X_CLASS) ? X : O
// }

// function computerMove() {
//   // Naive approach - click any available field
//   // const emptyField = [...cellElements].find(field => {
//   //   return !(field.classList.contains('o') || field.classList.contains('x'))
//   // })
//   // emptyField.click()
  
//   bestVal = -1000
//   bestMove = -1
//   state.forEach((cell, index, cells) => {
//     if (cell === EMPTY) {
//       newPosition =[...cells]
//       moveVal = minimax(state, 0, true)
//       if (moveVal > bestVal) {
//         bestVal = moveVal
//         bestMove = index
//       }
//     }
//   })
//   cellElements[bestMove].click()
// }

// // function which is not using DOM elements
// function checkWinState(state) {
//   currentSymbol = circleTurn ? O : X
//   return WINNING_COMBINATIONS.some(combination => {
//     return combination.every(index => {
//       return state[index] == currentSymbol
//     })
//   })
// }

// function swapTurns() {
//   circleTurn = !circleTurn
// }

// function setBoardHoverClass() {
//   board.classList.remove(X_CLASS)
//   board.classList.remove(O_CLASS)
//   if (circleTurn) {
//     board.classList.add(O_CLASS)
//   } else {
//     board.classList.add(X_CLASS)
//   }
// }

// // function checkWin(currentClass) {
// //   return WINNING_COMBINATIONS.some(combination => {
// //     return combination.every(index => {
// //       return cellElements[index].classList.contains(currentClass)
// //     })
// //   })
// // }

// const player = X
// const computer = O

// function evaluate(state) {
//   const playerWins = WINNING_COMBINATIONS.some(combination => {
//     return combination.every(index => {
//       return state[index] == player
//     })
//   })

//   if (playerWins) return -10

//   const computerWins = WINNING_COMBINATIONS.some(combination => {
//     return combination.every(index => {
//       return state[index] == computer
//     })
//   })

//   if (computerWins) return 10

//   return 0
// }

// function movePossible(state) {
//   possible = false
//   state.forEach(cell => {
//     if (cell === EMPTY) possible = true
//   })
//   return possible
// }

// function minimax(state, depth, maximize) {
//   score = evaluate(state)

//   if (score === 10) {
//     return score - depth
//   }

//   if (score === -10) {
//     return score + depth
//   }

//   if (!movePossible(state)) {
//     return 0
//   }

//   if (maximize) {
//     best = -Infinity
//     state.forEach((cell, index, cells) => {
//       if (cell === EMPTY) {
//         newPosition =[...cells]
//         newPosition[index] = computer
//         best = Math.max(best, minimax(newPosition, depth+1, !maximize))
//       }
//     })
//     return best
//   } else {
//     best = Infinity
//     state.forEach((cell, index, cells) => {
//       if (cell === EMPTY) {
//         newPosition =[...cells]
//         newPosition[index] = player
//         best = Math.min(best, minimax(newPosition, depth+1, !maximize))
//       }
//     })
//     return best
//   }
// }