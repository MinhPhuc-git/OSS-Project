const API = `http://${window.location.hostname}:3000`;

const status = document.querySelector('#status');
const statusText = document.querySelector('#status-text');
const runtime = document.querySelector('#runtime');
const requestResult = document.querySelector('#request-result');
const notes = document.querySelector('#notes');
const counter = document.querySelector('#counter');
const form = document.querySelector('#note-form');
const input = document.querySelector('#note-input');
const checkButton = document.querySelector('#check-api');

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
  requestResult.textContent = `GET /api/notes → HTTP ${response.status}`;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  renderNotes(await response.json());
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  requestResult.textContent = 'POST /api/notes → đang chờ BE...';
  try {
    const response = await fetch(`${API}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input.value }),
    });
    requestResult.textContent = `POST /api/notes → HTTP ${response.status}`;
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    input.value = '';
    await loadNotes();
  } catch (error) {
    requestResult.textContent = `POST /api/notes → REQUEST FAILED: ${error.message}`;
    statusText.textContent = 'BE không phản hồi; chức năng cần BE + database đã lỗi.';
    status.classList.remove('ready');
    console.error('POST /api/notes thất bại:', error);
  }
});

checkButton.addEventListener('click', async () => {
  requestResult.textContent = 'GET /api/notes → đang chờ BE...';
  try {
    await loadNotes();
    status.classList.add('ready');
    statusText.textContent = 'BE và database đã phản hồi.';
  } catch (error) {
    requestResult.textContent = `GET /api/notes → REQUEST FAILED: ${error.message}`;
    status.classList.remove('ready');
    statusText.textContent = 'BE không phản hồi; chức năng cần BE + database đã lỗi.';
    console.error('GET /api/notes thất bại:', error);
  }
});

// Không gọi BE lúc mở trang: FE vẫn hiển thị khi BE đã crash.
