const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const singlePlayerCheckbox = document.getElementById('singlePlayer');

let board = Array(9).fill(null);
let current = 'X';
let finished = false;

function render(){
  boardEl.innerHTML = '';
  board.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.className = 'cell' + (cell || '');
    div.dataset.idx = idx;
    div.textContent = cell || '';
    if(cell || finished){ div.classList.add('disabled'); }
    div.addEventListener('click', onClick);
    boardEl.appendChild(div);
  });
  statusEl.textContent = finished ? (winnerText() || 'Seri') : `Giliran: ${current}`;
}

function onClick(e){
  if(finished) return;
  const idx = Number(e.currentTarget.dataset.idx);
  if(board[idx]) return;
  makeMove(idx, current);
  if(!finished && singlePlayerCheckbox.checked){
    // simple AI: random available cell after short delay
    const avail = board.map((v,i)=>v?null:i).filter(v=>v!==null);
    if(avail.length){
      setTimeout(()=>{
        const choice = avail[Math.floor(Math.random()*avail.length)];
        makeMove(choice, current);
      }, 350);
    }
  }
}

function makeMove(idx, player){
  if(board[idx] || finished) return;
  board[idx] = player;
  const res = checkWinner();
  if(res){
    finished = true;
  } else if(board.every(Boolean)){
    finished = true;
  } else {
    current = current === 'X' ? 'O' : 'X';
  }
  render();
}

function checkWinner(){
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(const [a,b,c] of lines){
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      return board[a];
    }
  }
  return null;
}

function winnerText(){
  const w = checkWinner();
  return w ? `Pemenang: ${w}` : null;
}

resetBtn.addEventListener('click', ()=>{
  board = Array(9).fill(null);
  current = 'X';
  finished = false;
  render();
});

render();
