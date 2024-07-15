
let board2 = [];
function isValid(row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board2[i][col] === num)
            return false;
        if (board2[row][i] === num) return false;
        if (board2[3 * Math.floor((row / 3)) + Math.floor(i / 3)][3 * (Math.floor(col / 3)) + i % 3] === num) return false;
    }
    return true;
}
function findEmpty(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!board[i][j])
                return { r: i, c: j };
        }
    }
    return { r: undefined, c: undefined };
}
function solveSudoku(board) {
    let d = findEmpty(board);
    let { r, c } = d;
    if (r === undefined && c === undefined) return true;
    for (let i = 1; i < 10; i++) {
        if (isValid(r, c, i)) {
            board[r][c] = i;
            if (solveSudoku(board))
                return true;
        }
        board[r][c] = 0;
    }
    return false;
}
function removeNumbers(board, ctr) {
    let choices = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++)
            choices.push([i, j]);
    }
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    while (ctr > 0) {
        let [rr, cc] = choices.shift();
        val = board[rr][cc]
        board[rr][cc] = 0
        let tpBoard = board.map(b => [...b]);
        soln = solveCount(tpBoard);
        if (soln === 1)
            ctr -= 1
        else {
            board[rr][cc] = val
            choices.push([rr, cc]);
        }
    }
}
function solveCount(board) {
    let { r, c } = findEmpty(board)
    if (!r && !c) return 1;
    let ctr = 0;
    for (let i = 1; i < 10; i++) {
        board[r][c] = i;
        if (isValid(r, c, board))
            ctr += solveCount(board)
        board[r][c] = 0;
    }
    return ctr;
}
function fillBoard(rem) {
    for (let i = 0; i < 9; i++)
        board2.push(new Array(9).fill(0));
    let r = 0;
    for (let k = 0; k < 3; k++) {
        let nums = new Array(9).fill(0).map((_, idx) => idx + 1);
        for (let i = r; i < r + 3; i++) {
            for (let j = r; j < r + 3; j++) {
                let idx = Math.floor(Math.random() * nums.length);
                let val = nums[idx];
                board2[i][j] = val;
                nums.splice(idx, 1);
            }
        }
        r += 3;
    }
    solveSudoku(board2);
    removeNumbers(board2, rem);
}
