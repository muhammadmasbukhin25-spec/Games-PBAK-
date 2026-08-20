// To‑Do app with localStorage persistence
const STORAGE_KEY = 'todo.tasks.v1';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');
const countEl = document.getElementById('count');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');

let tasks = [];

// Load from localStorage
function loadTasks(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('Failed to load tasks', e);
    tasks = [];
  }
}

// Save to localStorage
function saveTasks(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }catch(e){
    console.error('Failed to save tasks', e);
  }
}

function render(){
  listEl.innerHTML = '';
  if(tasks.length === 0){
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Belum ada tugas. Tambahkan tugas baru di atas.';
    listEl.appendChild(empty);
  } else {
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!task.completed;
      cb.addEventListener('change', ()=>{
        toggleComplete(task.id);
      });

      const textWrap = document.createElement('div');
      textWrap.className = 'text';

      const span = document.createElement('span');
      span.textContent = task.text;
      span.tabIndex = 0;
      span.addEventListener('dblclick', ()=> startEdit(task.id, span));
      span.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') startEdit(task.id, span); });

      textWrap.appendChild(span);

      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.title = 'Edit';
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', ()=> startEdit(task.id, span));

      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn';
      delBtn.title = 'Hapus';
      delBtn.textContent = '🗑️';
      delBtn.addEventListener('click', ()=> deleteTask(task.id));

      li.appendChild(cb);
      li.appendChild(textWrap);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      listEl.appendChild(li);
    });
  }
  updateCount();
}

function updateCount(){
  const total = tasks.length;
  const remaining = tasks.filter(t=>!t.completed).length;
  countEl.textContent = `${remaining}/${total} tugas tersisa`;
}

function addTask(text){
  const trimmed = (text || '').trim();
  if(!trimmed) return;
  const task = {id: Date.now().toString(), text: trimmed, completed:false};
  tasks.unshift(task);
  saveTasks();
  render();
}

function toggleComplete(id){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  t.completed = !t.completed;
  saveTasks();
  render();
}

function deleteTask(id){
  tasks = tasks.filter(x=>x.id!==id);
  saveTasks();
  render();
}

function startEdit(id, spanEl){
  const task = tasks.find(x=>x.id===id);
  if(!task) return;
  const input = document.createElement('input');
  input.className = 'edit-input';
  input.value = task.text;
  spanEl.replaceWith(input);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  function finish(){
    const newText = input.value.trim();
    if(newText){
      task.text = newText;
      saveTasks();
    } else {
      // if empty after editing, remove task
      tasks = tasks.filter(x=>x.id!==id);
      saveTasks();
    }
    render();
  }

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') input.blur();
    if(e.key === 'Escape') render();
  });
}

function clearCompleted(){
  tasks = tasks.filter(t=>!t.completed);
  saveTasks();
  render();
}

function clearAll(){
  if(!confirm('Hapus semua tugas?')) return;
  tasks = [];
  saveTasks();
  render();
}

// Events
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

// Initialize
loadTasks();
render();
