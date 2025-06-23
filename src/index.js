// Get DOM elements
const postList = document.getElementById('post-list');
const postDetail = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');

const BASE_URL = 'http://localhost:3000/posts';
let currentPostId = null;

function main() {
  displayPosts();
  addNewPostListener();
  updateUIForAuth();
  // Clear detail view initially
  postDetail.innerHTML = '<p>Select a post to view details.</p>';
}

document.addEventListener('DOMContentLoaded', main);

// Display posts
function displayPosts() {
  fetch(BASE_URL)
    .then(r => r.json())
    .then(posts => {
      postList.innerHTML = '';
      posts.forEach(renderPostListItem);
    })
    .catch(console.error);
}

function renderPostListItem(post) {
  const postDiv = document.createElement('div');
  postDiv.classList.add('post-item');

  const img = document.createElement('img');
  img.src = post.image || 'https://via.placeholder.com/80';
  img.alt = post.title;
  img.width = 80;

  const title = document.createElement('h3');
  title.textContent = post.title;

  postDiv.append(img, title);
  postDiv.addEventListener('click', () => handlePostClick(post.id));
  postList.appendChild(postDiv);
}
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    username: loginForm.username.value,
    password: loginForm.password.value
  };
  const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    username: registerForm.username.value,
    password: registerForm.password.value
  };

  function updateUIForAuth() {
  const token = localStorage.getItem('token');
  const loggedIn = !!token;

  newPostForm.style.display = loggedIn ? 'block' : 'none';
  document.getElementById('login-section').style.display = loggedIn ? 'none' : 'block';
  document.getElementById('register-section').style.display = loggedIn ? 'none' : 'block';
  document.getElementById('logout-btn').classList.toggle('hidden', !loggedIn);
}

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(r => {
      if (!r.ok) throw new Error('Registration failed');
      alert('Registration successful. You can now log in.');
      registerForm.reset();
    })
    .catch(err => {
      alert(err.message);
    });
});


  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(r => r.json())
    .then(res => {
      token = res.token;
      localStorage.setItem('token', token);
      alert('Logged in!');
    })
    .catch(() => alert('Login failed'));
});
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  alert('Logged out');
  updateUIForAuth();
});



// 2️⃣ Show post detail with Edit/Delete
function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(r => r.json())
    .then(post => {
      currentPostId = post.id;
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image || ''}" alt="${post.title}" width="120" />
        <p>${post.content}</p>
        <p><em>By: ${post.author}</em></p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
        <form id="edit-post-form" class="hidden">
          <h4>Edit Post</h4>
          <label>Title:<input type="text" id="edit-title" value="${post.title}" /></label><br>
          <label>Content:<textarea id="edit-content">${post.content}</textarea></label><br>
          <button type="submit">Save</button>
          <button type="button" id="cancel-edit">Cancel</button>
        </form>
      `;

      document
        .getElementById('edit-btn')
        .addEventListener('click', () =>
          document.getElementById('edit-post-form').classList.remove('hidden')
        );
      document
        .getElementById('cancel-edit')
        .addEventListener('click', () =>
          document.getElementById('edit-post-form').classList.add('hidden')
        );
      document
        .getElementById('edit-post-form')
        .addEventListener('submit', updatePost);
      document
        .getElementById('delete-btn')
        .addEventListener('click', deletePost);
    })
    .catch(console.error);
}

// 3️⃣ Add new post
function addNewPostListener() {
  newPostForm.addEventListener('submit', e => {
    e.preventDefault();
    const newPost = {
      title: newPostForm.title.value.trim(),
      content: newPostForm.content.value.trim(),
      author: newPostForm.author.value.trim(),
      image: newPostForm.image ? newPostForm.image.value.trim() : ''
    };

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(r => r.json())
      .then(post => {
        renderPostListItem(post);
        newPostForm.reset();
      })
      .catch(console.error);
  });
}

// 4️⃣ Update post
function updatePost(e) {
  e.preventDefault();
  const updated = {
    title: document.getElementById('edit-title').value.trim(),
    content: document.getElementById('edit-content').value.trim()
  };

  fetch(`${BASE_URL}/${currentPostId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  })
    .then(r => r.json())
    .then(() => {
      displayPosts();
      handlePostClick(currentPostId);
    })
    .catch(console.error);
}

// 5️⃣ Delete post
function deletePost() {
  if (!confirm('Are you sure?')) return;

  fetch(`${BASE_URL}/${currentPostId}`, { method: 'DELETE' })
    .then(() => {
      displayPosts();
      postDetail.innerHTML = '<p>Select a post to view details.</p>';
    })
    .catch(console.error);
}
