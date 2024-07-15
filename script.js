const board = document.querySelectorAll("tr");
const solve = document.querySelector("#solve");
const reset = document.querySelector("#reset");
const generate = document.querySelector("#generate")
const difficultyLevel = document.querySelector("#diff");
const hrs = document.querySelector(".hrs");
const mins = document.querySelector(".min");
const sec = document.querySelector(".sec");
const image = document.querySelector('#image')
const url = document.querySelector("#url")

let seconds = 0, minutes = 0, hours = 0, id;
const update = () => {
    sec.innerText = `${(seconds + "").padStart(2, '0')}`,
        mins.innerText = `${(minutes + "").padStart(2, '0')}:`,
        hrs.innerText = `${(hours + "").padStart(2, '0')}:`
}

window.onload = () => {
    fillBoard(parseInt(difficultyLevel.value));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board2[i][j]) {
                board[i].children[j].style.backgroundColor = "rgb(255 197 0)";
                board[i].children[j].innerText = board2[i][j];
            }
            else {
                board[i].children[j].style.backgroundColor = "white";
                board[i].children[j].innerText = '';
            }
        }
    }
    board2 = [];
}
for (let i of board) {
    for (let j of i.children) {
        j.addEventListener("input", () => {
            if (isNaN(parseInt(j.innerText)))
                j.innerText = '';
            else {
                if (j.innerText.trim().length >= 2)
                    j.innerText = j.innerText[0];
            }
        })
    }
}
const init = f => {
    seconds = 0, minutes = 0, hours = 0;
    sec.innerText = `${(seconds + "").padStart(2, '0')}`;
    mins.innerText = `${(minutes + "").padStart(2, '0')}:`;
    hrs.innerText = `${(hours + "").padStart(2, '0')}:`
    fillBoard(parseInt(difficultyLevel.value));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!f) {
                if (board2[i][j]) {
                    board[i].children[j].style.backgroundColor = "rgb(255 197 0)";
                    board[i].children[j].innerText = board2[i][j];
                }
                else {
                    board[i].children[j].style.backgroundColor = "white";
                    board[i].children[j].innerText = '';
                }
            } else {
                board[i].children[j].innerText = '';
                board[i].children[j].style.backgroundColor = "white";
            }
        }
    }
    board2 = [];
}
const check = (row, col, num, board) => {
    for (let i = 0; i < 9; i++) {
        if (parseInt(board[i].children[col].innerText) === num) return false;
        if (parseInt(board[row].children[i].innerText) === num) return false;
        if (parseInt(board[(3 * (Math.floor(row / 3))) + Math.floor(i / 3)].children[(3 * (Math.floor(col / 3))) + i % 3].innerText) === num)
            return false;
    }
    return true;
}

function findSpace(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!parseInt(board[i].children[j].innerText))
                return { r: i, c: j };
        }
    }
    return { r: undefined, c: undefined };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function timer() {
    id = setInterval(() => {
        update();
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    }, 1000)
}
async function backtrack(board) {
    let d = findSpace(board);
    if (d.r === undefined && d.c === undefined) return true;
    for (let k = 1; k < 10; k++) {
        if (check(d.r, d.c, k, board)) {
            await sleep(50);
            board[d.r].children[d.c].innerText = k;
            board[d.r].children[d.c].style.backgroundColor = '#fbf5b0';
            if (await backtrack(board)) {
                return true
            }
            board[d.r].children[d.c].innerText = '';
            board[d.r].children[d.c].style.backgroundColor = 'rgb(200 255 21)';
        }
    }
    return false;
}

solve.addEventListener("click", async () => {
    timer();
    generate.disabled = true;
    solve.disabled = true;
    reset.disabled = true;
    if (await backtrack(board)) {
        clearInterval(id);
        generate.disabled = false;
        solve.disabled = false;
        reset.disabled = false;
    }
})

generate.addEventListener('click', () => {
    init(0);
})
reset.addEventListener("click", () => {
    init(1);
})
image.addEventListener("change", async (e) => {
    let formData = new FormData()
    let res; let data;
    const files = e.target.files
    formData.append('image', files[0])
    try {
        res = await fetch('https://sudoku-board-extractor.vercel.app/', {
            headers: {
                "Accept-Content": 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            method: 'POST',
            body: formData
        })
        res = await res.json()
        data = res['data']
    } catch (e) {
        alert(e)
    }
    if (!data)
        alert("Invalid Board")
    else {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (data[i][j]) {
                    board[i].children[j].style.backgroundColor = "rgb(255 197 0)";
                    board[i].children[j].innerText = data[i][j];
                }
                else {
                    board[i].children[j].style.backgroundColor = "white";
                    board[i].children[j].innerText = '';
                }
            }
        }
    }
})