document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password })
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
  
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        // Load notes after login
        loadNotes();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
  
  document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      const data = await response.json();
      alert('Note added');
      loadNotes();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
  
  async function loadNotes() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const notes = await response.json();
      const noteList = document.getElementById('noteList');
      noteList.innerHTML = notes.map(note => `
        <div>
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <button onclick="deleteNote('${note._id}')">Delete</button>
        </div>
      `).join('');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
  
  async function deleteNote(id) {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Note deleted');
      loadNotes();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
  