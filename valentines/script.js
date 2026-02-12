const questions = [
  {
    question: "When did we first kiss?",
    options: ["23 september 2021 (our first official day)", "24 Sept (first official date but past midnight)", "27 sept in the car"],
    answer: 0
  },
  {
    question: "What can i eat everyday, forever?",
    options: ["Macs", "Stuffd", "Katsudon", "Maggie"],
    answer: 1
  },
  {
    question: "Which wrist is hurting more?",
    options: ["Left", "Right"],
    answer: 1
  },
  {
    question: "What do I like to hear?",
    options: ["Compliment my singing", "Compliment my look", "Compliment my intelligence"],
    answer: 2
  },
  {
    question: "What crime did you commit most?",
    options: ["Owe money", "Robbery", "Drunk and cause inconvenience", "Steal my heart"],
    answer: 1
  },
  {
    question: "Who does Janald love",
    options: ["Fanny", "Fanny", "Fanny", "Fanny", "Fanny"],
    answer: 3
  }
];

const max_score = questions.length;

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let attemptCount = localStorage.getItem("attemptCount") || 0;

// ===== SNOWFLAKE INITIALIZATION =====
const snowflakesContainer = document.querySelector('.snowflakes') || createSnowflakesContainer();
const containerWidth = window.innerWidth;
const containerHeight = window.innerHeight;
const snowflakeCount = 30;

// Create initial snowflakes
for (let i = 0; i < snowflakeCount; i++) {
  createSnowflake();
}

function createSnowflakesContainer() {
  const container = document.createElement('div');
  container.className = 'snowflakes';
  document.body.insertBefore(container, document.body.firstChild);
  return container;
}

function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  
  // Randomize snowflake properties
  const size = Math.random() * 5 + 2;
  const startPositionX = Math.random() * containerWidth;
  const startPositionY = Math.random() * containerHeight * -1;
  
  // Set snowflake styles
  snowflake.style.width = `${size}px`;
  snowflake.style.height = `${size}px`;
  snowflake.style.left = `${startPositionX}px`;
  snowflake.style.top = `${startPositionY}px`;
  snowflake.style.opacity = Math.random() * 0.7 + 0.3;
  
  // Store snowflake properties for animation
  snowflake.setAttribute('data-speed', Math.random() * 2 + 1);
  snowflake.setAttribute('data-amplitude', Math.random() * 30 + 5);
  snowflake.setAttribute('data-x', startPositionX);
  snowflake.setAttribute('data-y', startPositionY);
  
  snowflakesContainer.appendChild(snowflake);
  animateSnowflake(snowflake);
}

function animateSnowflake(snowflake) {
  const speed = parseFloat(snowflake.getAttribute('data-speed'));
  const amplitude = parseFloat(snowflake.getAttribute('data-amplitude'));
  let x = parseFloat(snowflake.getAttribute('data-x'));
  let y = parseFloat(snowflake.getAttribute('data-y'));
  
  function update() {
    // Update position with sinusoidal horizontal movement
    y += speed;
    x += Math.sin(y / amplitude) * 0.5;
    
    // Set new position
    snowflake.style.transform = `translate(${Math.sin(y / 50) * amplitude}px, ${y}px)`;
    
    // Reset if snowflake moves out of view
    if (y > containerHeight) {
      y = -10;
      x = Math.random() * containerWidth;
      snowflake.setAttribute('data-x', x);
      snowflake.setAttribute('data-y', y);
    } else {
      snowflake.setAttribute('data-y', y);
    }
    
    requestAnimationFrame(update);
  }
  
  update();
}
// ===== END SNOWFLAKE CODE =====

// Typing animation function
let typingIndex = 0;
let typingTimeout;

function typeText(element, text, speed = 50, callback = null) {
  // Clear any existing timeout
  clearTimeout(typingTimeout);
  
  element.textContent = "";
  typingIndex = 0;

  function type() {
    if (typingIndex < text.length) {
      element.textContent += text.charAt(typingIndex);
      typingIndex++;
      typingTimeout = setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }

  type();
}

function startQuiz() {
  document.getElementById("start-screen").classList.remove("active");
  document.getElementById("quiz-screen").classList.add("active");
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestion];
  const questionElement = document.getElementById("question-text");
  
  // Display options with fade-in animation while question is typing
  displayOptions(q.options);
  
  typeText(questionElement, q.question, 40);
}

function displayOptions(options) {
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => selectAnswer(index);
    button.style.opacity = "1";
    optionsDiv.appendChild(button);
  });
}

function selectAnswer(index) {
  selectedAnswer = index;
  
  // Check answer and advance automatically
  if (selectedAnswer === questions[currentQuestion].answer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-screen").classList.remove("active");
  document.getElementById("result-screen").classList.add("active");

  attemptCount++;
  localStorage.setItem("attemptCount", attemptCount);

  const resultText = `You got ${score} / ${max_score} of the questions right.`;
  typeText(document.getElementById("result-text"), resultText, 40);

  let message = "";
  if (score === max_score) {
    message = `You finally did it... After the disappointing ${attemptCount} tries that you took by repeating this test over and over`;
  } else if (score >= 3) {
    message = "Boooooo! You don't know me well enough. Try harder.";
  } else {
    message = "Seriously?! You gotta learn more about me! 😤";
  }

  // Calculate delay based on result text length
  const resultTextLength = resultText.length;
  const delayForResultText = resultTextLength * 40 + 500;

  setTimeout(() => {
    typeText(
      document.getElementById("attempt-text"),
      `${message}\n\nAttempts: ${attemptCount}`,
      30
    );
  }, delayForResultText);

  const startOverBtn = document.querySelector("#result-screen button");
  if (score === max_score) {
    startOverBtn.remove();
  }

  if (score === max_score) {
    setTimeout(() => {
      document.getElementById("result-screen").classList.remove("active");
      document.getElementById("valentine-screen").classList.add("active");
    }, 7000);
  }
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;

  // Re-add the Start Over button if it was removed
  const resultScreen = document.getElementById("result-screen");
  if (!resultScreen.querySelector("button")) {
    const btn = document.createElement("button");
    btn.innerText = "Start Over";
    btn.onclick = restartQuiz;
    resultScreen.appendChild(btn);
  }

  document.getElementById("result-screen").classList.remove("active");
  document.getElementById("quiz-screen").classList.add("active");

  loadQuestion();
}

// No button logic
const noBtn = document.getElementById("no-btn");

noBtn.addEventListener("mouseover", () => {
  noBtn.innerText = "Don't regret";
});

noBtn.addEventListener("mouseout", () => {
  noBtn.innerText = "No";
});

noBtn.addEventListener("click", () => {
  alert("Wrong answer. Go redo the quiz 😌");
  currentQuestion = 0;
  score = 0;

  // Re-add the Start Over button
  const resultScreen = document.getElementById("result-screen");
  if (!resultScreen.querySelector("button")) {
    const btn = document.createElement("button");
    btn.innerText = "Start Over";
    btn.onclick = restartQuiz;
    resultScreen.appendChild(btn);
  }

  document.getElementById("valentine-screen").classList.remove("active");
  document.getElementById("quiz-screen").classList.add("active");

  loadQuestion();
});

function showDetails() {
  document.getElementById("valentine-screen").classList.remove("active");
  document.getElementById("details-screen").classList.add("active");
  startHeartRain();
}

const heartEmojis = ['❤️', '💙', '💜', '💛', '💚', '🧡', '💖', '💘', '💝'];
let heartRainInterval;

function startHeartRain() {
  heartRainInterval = setInterval(() => {
    createHeart();
  }, 300); // Hearts fall every 300ms
}

function createHeart() {
  const heartContainer = document.querySelector(".heart-rain") || createHeartContainer();
  const heart = document.createElement("span");
  heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.animationDuration = (Math.random() * 3 + 2) + "s";
  heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}

function createHeartContainer() {
  const container = document.createElement("div");
  container.className = "heart-rain";
  document.body.appendChild(container);
  return container;
}