const btn = document.getElementById('btn');
btn.addEventListener('click', loadPosts);

async function loadPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const posts = await response.json();

    posts.forEach(function (post) {
      const postElement = document.createElement('div');
      postElement.classList.add('post');

      const postTitle = document.createElement('h3');
      postTitle.textContent = post.title;

      const postBody = document.createElement('p');
      postBody.textContent = post.body;

      postElement.appendChild(postTitle);
      postElement.appendChild(postBody);

      document.body.appendChild(postElement);
    });
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error);
  }
}

// loadPosts();
