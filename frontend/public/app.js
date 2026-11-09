const API = window.location.port === '8080'
  ? `${window.location.protocol}//${window.location.hostname}:3000`
  : 'http://localhost:3000';

const status = document.querySelector('.status');
const statusText = document.querySelector('#status-text');
const runtime = document.querySelector('#runtime');
const notes = document.querySelector('#notes');
const counter = document.querySelector('#counter');
const form = document.querySelector('#note-form');
const input = document.querySelector('#note-input');

function renderNotes(items) {
  counter.textContent = `${items.length} NOTE${items.length === 1 ? '' : 'S'}`;
  notes.replaceChildren();
  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Chưa có ghi chú nào. Hãy bắt đầu cuộc thử nghiệm.';
    notes.append(empty);
    return;
  }
  for (const item of items) {
    const row = document.createElement('li');
    const content = document.createElement('span');
    content.textContent = item.content;
    const time = document.createElement('time');
    time.dateTime = item.created_at;
    time.textContent = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.created_at));
    row.append(content, time);
    notes.append(row);
  }
}

async function loadNotes() {
  const response = await fetch(`${API}/api/notes`);
  if (!response.ok) throw new Error('Không tải được ghi chú.');
  renderNotes(await response.json());
}

async function connect() {
  try {
    const response = await fetch(`${API}/api/health`);
    const health = await response.json();
    if (!response.ok) throw new Error('Backend chưa sẵn sàng.');
    status.classList.add('ready');
    statusText.textContent = 'Backend và database đã kết nối';
    runtime.textContent = health.runtime;
    await loadNotes();
  } catch {
    statusText.textContent = 'Chưa kết nối — hãy chạy docker compose up';
    runtime.textContent = '';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const response = await fetch(`${API}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input.value }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Không thể lưu ghi chú.');
    input.value = '';
    await loadNotes();
  } catch (error) {
    statusText.textContent = error.message;
    status.classList.remove('ready');
  } finally {
    button.disabled = false;
  }
});

connect();
