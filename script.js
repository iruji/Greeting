// DOM Elements - Creator View
const creatorView = document.getElementById('creatorView');
const nameInput = document.getElementById('nameInput');
const occasionSelect = document.getElementById('occasionSelect');
const customMessageBox = document.getElementById('customMessageBox');
const customMessage = document.getElementById('customMessage');
const aiGenerateBtn = document.getElementById('aiGenerateBtn');
const sendBtn = document.getElementById('sendBtn');

// DOM Elements - Card View (for recipients)
const cardView = document.getElementById('cardView');
const cardTitle = document.getElementById('cardTitle');
const cardMessage = document.getElementById('cardMessage');
const createOwnBtn = document.getElementById('createOwnBtn');
const confettiContainer = document.getElementById('confetti');

// DOM Elements - Success Modal
const successOverlay = document.getElementById('successOverlay');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const successDisplay = document.getElementById('successDisplay');
const previewTitle = document.getElementById('previewTitle');
const previewMessage = document.getElementById('previewMessage');
const shareLink = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');

// DOM Elements - Social Share
const shareFacebook = document.getElementById('shareFacebook');
const shareTwitter = document.getElementById('shareTwitter');
const shareWhatsApp = document.getElementById('shareWhatsApp');
const shareMessenger = document.getElementById('shareMessenger');

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
 * Initialize the app - check if viewing a card or creating one
 */
async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('card');
  
  if (cardId) {
    // Recipient view - load and display the card
    await loadCard(cardId);
  } else {
    // Creator view - show the form
    creatorView.classList.remove('hidden');
  }
}

/**
 * Loads a card from storage and displays it
 * @param {string} cardId - The card ID
 */
async function loadCard(cardId) {
  try {
    // Use localStorage for MVP (works on localhost)
    const cardDataString = localStorage.getItem(`card:${cardId}`);
    
    if (cardDataString) {
      const cardData = JSON.parse(cardDataString);
      
      // Display the card
      cardTitle.textContent = `${cardData.title}, ${cardData.name.toUpperCase()}!`;
      cardMessage.textContent = cardData.message;
      
      // Show card view
      cardView.classList.remove('hidden');
      creatorView.classList.add('hidden');
      
      // Create confetti animation
      createConfetti();
    } else {
      // Card not found
      alert('Card not found! It may have expired or been deleted.');
      creatorView.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error loading card:', error);
    alert('Unable to load card. Please try again.');
    creatorView.classList.remove('hidden');
  }
}

/**
 * Creates confetti animation
 */
function createConfetti() {
  const colors = ['#ff0080', '#00d4ff', '#fff200', '#7000ff', '#00ff88'];
  
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    confettiContainer.appendChild(piece);
  }
}

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
 * Generates a unique card ID
 * @returns {string} Unique ID
 */
function generateCardId() {
  return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Saves card to storage and returns the shareable URL
 * @param {Object} cardData - Card data object
 * @returns {Promise<string>} Shareable URL
 */
async function saveCard(cardData) {
  const cardId = generateCardId();
  
  try {
    // Use localStorage for MVP (works on localhost)
    localStorage.setItem(`card:${cardId}`, JSON.stringify(cardData));
    
    // Generate shareable URL
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?card=${cardId}`;
  } catch (error) {
    console.error('Error saving card:', error);
    throw new Error('Failed to save card');
  }
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
  // Custom message box is always visible now
  // This function can be removed or kept for future use
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
  
  return true;
}

/**
 * Creates a card with AI-generated message
 */
async function createAICard() {
  if (!validateInput()) return;
  
  const name = nameInput.value.trim();
  const occasion = occasionSelect.value;
  
  // Show modal with loading state
  successOverlay.classList.add('show');
  loadingSpinner.classList.remove('hidden');
  successDisplay.classList.add('hidden');
  
  // Generate AI message
  const result = await generateAIMessage(name, occasion);
  const cardData = {
    name: name,
    title: result.title,
    message: result.message
  };
  
  // Save card and get shareable link
  try {
    const url = await saveCard(cardData);
    
    // Update preview
    previewTitle.textContent = `${cardData.title}, ${cardData.name.toUpperCase()}!`;
    previewMessage.textContent = cardData.message;
    shareLink.value = url;
    
    // Show success view
    loadingSpinner.classList.add('hidden');
    successDisplay.classList.remove('hidden');
  } catch (error) {
    alert('Failed to create card. Please try again.');
    successOverlay.classList.remove('show');
  }
}

/**
 * Creates a card with random predefined message or custom message
 */
async function createRandomCard() {
  if (!validateInput()) return;
  
  const name = nameInput.value.trim();
  const occasion = occasionSelect.value;
  const customMsg = customMessage.value.trim();
  
  let cardData;
  
  // If user wrote a custom message, use that
  if (customMsg) {
    cardData = {
      name: name,
      title: 'SPECIAL MESSAGE',
      message: customMsg
    };
  } else {
    // Otherwise use random predefined message based on occasion
    const result = getRandomMessage(occasion);
    cardData = {
      name: name,
      title: result.title,
      message: result.message
    };
  }
  
  // Save card and get shareable link
  try {
    const url = await saveCard(cardData);
    
    // Update preview
    previewTitle.textContent = `${cardData.title}, ${cardData.name.toUpperCase()}!`;
    previewMessage.textContent = cardData.message;
    shareLink.value = url;
    
    // Show success modal
    successOverlay.classList.add('show');
    loadingSpinner.classList.add('hidden');
    successDisplay.classList.remove('hidden');
  } catch (error) {
    alert('Failed to create card. Please try again.');
  }
}

/**
 * Copies the shareable link to clipboard
 */
async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    
    // Visual feedback
    const originalText = copyLinkBtn.textContent;
    copyLinkBtn.textContent = '✓ Copied!';
    copyLinkBtn.classList.add('copied');
    
    setTimeout(() => {
      copyLinkBtn.textContent = originalText;
      copyLinkBtn.classList.remove('copied');
    }, 2000);
  } catch (error) {
    // Fallback: select the text
    shareLink.select();
    alert('Link copied! You can now paste it anywhere.');
  }
}

/**
 * Share to Facebook
 */
function shareToFacebook() {
  const url = encodeURIComponent(shareLink.value);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to Twitter/X
 */
function shareToTwitter() {
  const url = encodeURIComponent(shareLink.value);
  const text = encodeURIComponent('Check out this awesome greeting card I made! 🎉');
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to WhatsApp
 */
function shareToWhatsApp() {
  const url = encodeURIComponent(shareLink.value);
  const text = encodeURIComponent('Check out this greeting card I made for you! 🎉 ');
  const whatsappUrl = `https://wa.me/?text=${text}${url}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Share to Messenger
 */
function shareToMessenger() {
  const url = encodeURIComponent(shareLink.value);
  const messengerUrl = `https://www.facebook.com/dialog/send?link=${url}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(window.location.href)}`;
  // Note: Messenger sharing requires a Facebook App ID for full functionality
  // Fallback to Facebook share
  shareToFacebook();
}

/**
 * Closes the success modal
 */
function closeSuccess() {
  successOverlay.classList.remove('show');
}

/**
 * Returns to creator view from card view
 */
function goToCreator() {
  window.location.href = window.location.pathname;
}

// Event Listeners
occasionSelect.addEventListener('change', toggleCustomMessageBox);
aiGenerateBtn.addEventListener('click', createAICard);
sendBtn.addEventListener('click', createRandomCard);
closeSuccessBtn.addEventListener('click', closeSuccess);
copyLinkBtn.addEventListener('click', copyLink);
createOwnBtn.addEventListener('click', goToCreator);

// Social share buttons
shareFacebook.addEventListener('click', shareToFacebook);
shareTwitter.addEventListener('click', shareToTwitter);
shareWhatsApp.addEventListener('click', shareWhatsApp);
shareMessenger.addEventListener('click', shareToMessenger);

// Close modal on overlay click
successOverlay.addEventListener('click', (e) => {
  if (e.target === successOverlay) {
    closeSuccess();
  }
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && successOverlay.classList.contains('show')) {
    closeSuccess();
  }
});

// Enter key support for name input
nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    createRandomCard();
  }
});

// Initialize the app
init();