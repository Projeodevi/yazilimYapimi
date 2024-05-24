document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const wordForm = document.getElementById('word-form');
  const quizSection = document.getElementById('quiz-section');
  const wordManagement = document.getElementById('word-management');
  const analyzeButton = document.getElementById('analyze-button');

  analyzeButton.addEventListener('click', analyze);
  let token = localStorage.getItem('token');

  if (token) {
    showWordManagement();
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      alert('Registration successful!');
      showWordManagement();
    } else {
      alert('Registration failed!');
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      alert(data.message);
      showWordManagement();
    } else {
      alert(data.message);
    }
  });

  wordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const englishWord = document.getElementById('english-word').value;
    const turkishTranslation = document.getElementById('turkish-translation').value;
    const sentences = document.getElementById('sentences').value.split('\n');
    const imageFile = document.getElementById('image-file').files[0];
    const audioFile = document.getElementById('audio-file').files[0];

    let imageUrl = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      imageUrl = data.imageUrl;
    }

    let audioUrl = '';
    if (audioFile) {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await fetch('/upload/audio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      audioUrl = data.audioUrl;
    }

    const response = await fetch('/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ englishWord, turkishTranslation, sentences, imageUrl, audioUrl }),
    });
    
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.message);
    }
  });

  function showWordManagement() {
    document.getElementById('register-login').classList.add('hidden');
    wordManagement.classList.remove('hidden');
    quizSection.classList.remove('hidden');
    loadQuiz();
  }

  async function loadQuiz() {
    const response = await fetch('/quiz/start', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const quizzes = await response.json();
    console.log(quizzes);
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    quizzes.forEach(quiz => {
      const quizItem = document.createElement('div');
      quizItem.classList.add('quiz-item');
      let additional = '';
      if (quiz.word.imageUrl && quiz.word.imageUrl.length > 0) {
        additional = `<img src="${quiz.word.imageUrl}" alt="${quiz.word.englishWord}">`;
      }
      if (quiz.word.audioUrl && quiz.word.audioUrl.length > 0) {
        additional += `<audio controls><source src="${quiz.word.audioUrl}" type="audio/mpeg"></audio>`;
      }
      quizItem.innerHTML = `
        <h3>${quiz.word.englishWord}</h3>` +
        additional +
        `<input type="text" placeholder="Your Answer">
        <button onclick="submitAnswer('${quiz._id}', this.previousElementSibling.value)">Submit</button>
      `;
      quizContainer.appendChild(quizItem);
    });
  }

  async function submitAnswer(quizId, answer) {
    const response = await fetch('http://localhost:8000/quiz/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quizId, answer }),
    });

    const result = await response.json();
    if (response.ok) {
      if (result.correct) {
        alert(data.message);
      } else {
        alert(data.message);
      }
      loadQuiz();
    } else {
      alert(data.message);
    }
  }

  async function analyze() {
    const response = await fetch('/quiz/analyze', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data);
  }

  window.submitAnswer = submitAnswer;
});
