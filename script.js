// DOM Elements
const nameInput = document.getElementById('nameInput');
const occasionSelect = document.getElementById('occasionSelect');
const customMessageBox = document.getElementById('customMessageBox');
const customMessage = document.getElementById('customMessage');
const aiGenerateBtn = document.getElementById('aiGenerateBtn');
const sendBtn = document.getElementById('sendBtn');
const overlay = document.getElementById('overlay');
const greetTitle = document.getElementById('greetTitle');
const greetMessage = document.getElementById('greetMessage');
const greetHeaderTitle = document.getElementById('greetHeaderTitle');
const closeBtn = document.getElementById('closeBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const greetDisplay = document.getElementById('greetDisplay');

// Predefined messages for each occasion
const occasionMessages = {
  birthday: {
    title: "HAPPY BIRTHDAY",
    messages: [
      "YOU'RE AWESOME! Have the most EPIC birthday ever! May your day be filled with cake, laughs, and all the good vibes!",
      "PARTY TIME! Another year older, another year COOLER! Hope your birthday is absolutely LEGENDARY!",
      "CELEBRATE BIG! You deserve all the happiness today! Keep being amazing and have a BLAST!"
    ]
  },
  valentine: {
    title: "HAPPY VALENTINE'S",
    messages: [
      "YOU'RE TOTALLY RAD! Have the most AWESOME Valentine's Day ever! Keep being amazing and spreading good vibes! ♥",
      "LOVE IS IN THE AIR! You're absolutely fantastic! Wishing you a day full of love and happiness!",
      "YOU ROCK! Hope your Valentine's Day is filled with joy, laughter, and all the love you deserve!"
    ]
  },
  anniversary: {
    title: "HAPPY ANNIVERSARY",
    messages: [
      "CONGRATS! Here's to another amazing year together! You two are absolutely INCREDIBLE!",
      "CELEBRATE YOUR LOVE! May your bond keep growing stronger! You're an inspiration!",
      "CHEERS TO YOU! What an amazing journey! Here's to many more wonderful years ahead!"
    ]
  },
  graduation: {
    title: "CONGRATS GRADUATE",
    messages: [
      "YOU DID IT! This is just the beginning of something AMAZING! So proud of you!",
      "WAY TO GO! Your hard work paid off! Now go out there and conquer the world!",
      "CELEBRATION TIME! You've earned this moment! The future is bright and it's all yours!"
    ]
  },
  congrats: {
    title: "CONGRATULATIONS",
    messages: [
      "YOU'RE A SUPERSTAR! This achievement is totally EPIC! Keep crushing it!",
      "AMAZING JOB! You worked hard and it shows! So proud of what you've accomplished!",
      "YOU ROCK! This is just the beginning! Keep being awesome and reaching for the stars!"
    ]
  },
  "thank-you": {
    title: "THANK YOU",
    messages: [
      "YOU'RE THE BEST! Thanks for being so AWESOME! Your kindness means the world!",
      "MUCH APPRECIATED! You're absolutely amazing! Thank you for everything you do!",
      "HUGE THANKS! Your support and kindness are truly appreciated! You're fantastic!"
    ]
  },
  "get-well": {
    title: "GET WELL SOON",
    messages: [
      "SENDING HEALING VIBES! Hope you feel better SUPER FAST! You've got this!",
      "HANG IN THERE! Wishing you a speedy recovery! Can't wait to see you back to your awesome self!",
      "FEEL BETTER SOON! Sending tons of positive energy your way! You're stronger than you know!"
    ]
  },
  "thinking-of-you": {
    title: "THINKING OF YOU",
    messages: [
      "YOU'RE AWESOME! Just wanted to send some good vibes your way! Hope you're having a great day!",
      "HEY THERE! You crossed my mind and I wanted to say you're pretty fantastic!",
      "SENDING POSITIVITY! Hope this brightens your day! You're amazing, don't forget it!"
    ]
  }
};

/**
 * Gets a random message for the selected occasion
 * @param {string} occasion - The occasion type
 * @returns {Object} Object with title and message
 */
function getRandomMessage(occasion) {
  const data = occasionMessages[occasion];
  const randomMsg = data.messages[Math.floor(Math.random() * data.messages.length)];
  return {
    title: data.title,
    message: randomMsg
  };
}

/**
 * Generates an AI message using Claude API
 * @param {string} name - Recipient name
 * @param {string} occasion - Occasion type
 * @returns {Promise<Object>} Object with title and message
 */
async function generateAIMessage(name, occasion) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Create a fun, energetic greeting card message for ${name} for their ${occasion}. 
            
Style requirements:
- Use the Memphis/90s design aesthetic: bold, enthusiastic, ALL CAPS for emphasis
- Include emojis sparingly but effectively
- Keep it under 3 sentences
- Be genuine and heartfelt but FUN and RADICAL
- Use words like: AWESOME, EPIC, RAD, FANTASTIC, LEGENDARY, ROCK, CRUSH IT
- Match the high-energy vibe of 90s positivity

Return ONLY a JSON object with this exact structure (no markdown, no backticks):
{
  "title": "TITLE IN ALL CAPS",
  "message": "Your energetic message here"
}`
          }
        ],
      })
    });

    const data = await response.json();
    const content = data.content[0].text.trim();
    
    // Parse the JSON response
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error('AI generation error:', error);
    // Fallback to random message if AI fails
    return getRandomMessage(occasion);
  }
}

/**
 * Shows or hides custom message box based on occasion selection
 */
function toggleCustomMessageBox() {
  if (occasionSelect.value === 'custom') {
    customMessageBox.classList.remove('hidden');
  } else {
    customMessageBox.classList.add('hidden');
  }
}

/**
 * Validates user input
 * @returns {boolean} True if valid
 */
function validateInput() {
  const name = nameInput.value.trim();
  
  if (!name) {
    alert('Please enter a name!');
    nameInput.focus();
    return false;
  }
  
  if (occasionSelect.value === 'custom' && !customMessage.value.trim()) {
    alert('Please write a custom message!');
    customMessage.focus();
    return false;
  }
  
  return true;
}

/**
 * Opens the greeting modal with AI-generated message
 */
async function openAIGreeting() {
  if (!validateInput()) return;
  
  const name = nameInput.value.trim();
  const occasion = occasionSelect.value;
  
  // Handle custom message
  if (occasion === 'custom') {
    greetHeaderTitle.textContent = '♥ YOUR MESSAGE ♥';
    greetTitle.textContent = name.toUpperCase();
    greetMessage.textContent = customMessage.value.trim();
    
    overlay.classList.add('show');
    loadingSpinner.classList.add('hidden');
    greetDisplay.classList.remove('hidden');
    return;
  }
  
  // Show modal with loading state
  overlay.classList.add('show');
  loadingSpinner.classList.remove('hidden');
  greetDisplay.classList.add('hidden');
  
  // Generate AI message
  const result = await generateAIMessage(name, occasion);
  
  // Update content
  greetHeaderTitle.textContent = '♥ AI GENERATED ♥';
  greetTitle.textContent = `${result.title}, ${name.toUpperCase()}!`;
  greetMessage.textContent = result.message;
  
  // Show result
  loadingSpinner.classList.add('hidden');
  greetDisplay.classList.remove('hidden');
}

/**
 * Opens the greeting modal with random predefined message
 */
function openRandomGreeting() {
  if (!validateInput()) return;
  
  const name = nameInput.value.trim();
  const occasion = occasionSelect.value;
  
  // Handle custom message
  if (occasion === 'custom') {
    greetHeaderTitle.textContent = '♥ YOUR MESSAGE ♥';
    greetTitle.textContent = name.toUpperCase();
    greetMessage.textContent = customMessage.value.trim();
  } else {
    // Use random predefined message
    const result = getRandomMessage(occasion);
    greetHeaderTitle.textContent = '♥ YOUR GREETING ♥';
    greetTitle.textContent = `${result.title}, ${name.toUpperCase()}!`;
    greetMessage.textContent = result.message;
  }
  
  overlay.classList.add('show');
  loadingSpinner.classList.add('hidden');
  greetDisplay.classList.remove('hidden');
}

/**
 * Closes the greeting modal
 */
function closeGreeting() {
  overlay.classList.remove('show');
}

/**
 * Handles click outside modal to close
 * @param {Event} e - Click event
 */
function handleOverlayClick(e) {
  if (e.target === overlay) {
    closeGreeting();
  }
}

// Event Listeners
occasionSelect.addEventListener('change', toggleCustomMessageBox);
aiGenerateBtn.addEventListener('click', openAIGreeting);
sendBtn.addEventListener('click', openRandomGreeting);
closeBtn.addEventListener('click', closeGreeting);
overlay.addEventListener('click', handleOverlayClick);

// Enter key support for name input
nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    openRandomGreeting();
  }
});