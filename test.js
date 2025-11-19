/**
 * Test Suite for Greeting Card Website
 * Run this file in the browser console or include it in your HTML
 */

// Test utilities
const TestRunner = {
  passed: 0,
  failed: 0,
  total: 0,

  assert(condition, testName) {
    this.total++;
    if (condition) {
      this.passed++;
      console.log(`PASS: ${testName}`);
      return true;
    } else {
      this.failed++;
      console.error(`FAIL: ${testName}`);
      return false;
    }
  },

  assertEquals(actual, expected, testName) {
    this.total++;
    if (actual === expected) {
      this.passed++;
      console.log(`PASS: ${testName}`);
      console.log(`   Expected: ${expected}, Got: ${actual}`);
      return true;
    } else {
      this.failed++;
      console.error(`FAIL: ${testName}`);
      console.error(`   Expected: ${expected}, Got: ${actual}`);
      return false;
    }
  },

  assertNotNull(value, testName) {
    this.total++;
    if (value !== null && value !== undefined) {
      this.passed++;
      console.log(`PASS: ${testName}`);
      return true;
    } else {
      this.failed++;
      console.error(`FAIL: ${testName}`);
      console.error(`   Value was null or undefined`);
      return false;
    }
  },

  assertContains(str, substring, testName) {
    this.total++;
    if (str && str.includes(substring)) {
      this.passed++;
      console.log(`PASS: ${testName}`);
      return true;
    } else {
      this.failed++;
      console.error(`FAIL: ${testName}`);
      console.error(`   "${str}" does not contain "${substring}"`);
      return false;
    }
  },

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.total}`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Success Rate: ${((this.passed / this.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(50) + '\n');
  }
};

// Test Suite
async function runTests() {
  console.clear();
  console.log('Starting Greeting Card Website Tests...\n');

  // Reset counters
  TestRunner.passed = 0;
  TestRunner.failed = 0;
  TestRunner.total = 0;

  // Test 1: Check if DOM elements exist
  console.log('\nTesting DOM Elements...');
  TestRunner.assertNotNull(document.getElementById('nameInput'), 'Name input exists');
  TestRunner.assertNotNull(document.getElementById('occasionSelect'), 'Occasion select exists');
  TestRunner.assertNotNull(document.getElementById('customMessage'), 'Custom message textarea exists');
  TestRunner.assertNotNull(document.getElementById('aiGenerateBtn'), 'AI Generate button exists');
  TestRunner.assertNotNull(document.getElementById('sendBtn'), 'Send button exists');

  // Test 2: Check if functions are defined
  console.log('\nTesting Function Definitions...');
  TestRunner.assert(typeof generateCardId === 'function', 'generateCardId function exists');
  TestRunner.assert(typeof getRandomMessage === 'function', 'getRandomMessage function exists');
  TestRunner.assert(typeof saveCard === 'function', 'saveCard function exists');
  TestRunner.assert(typeof loadCard === 'function', 'loadCard function exists');
  TestRunner.assert(typeof validateInput === 'function', 'validateInput function exists');

  // Test 3: Test generateCardId function
  console.log('\nTesting Card ID Generation...');
  const cardId1 = generateCardId();
  const cardId2 = generateCardId();
  TestRunner.assert(cardId1.startsWith('card_'), 'Card ID has correct prefix');
  TestRunner.assert(cardId1 !== cardId2, 'Card IDs are unique');
  TestRunner.assert(cardId1.length > 10, 'Card ID has sufficient length');

  // Test 4: Test occasion messages
  console.log('\nTesting Occasion Messages...');
  const occasions = ['birthday', 'valentine', 'anniversary', 'graduation', 'congrats', 'thank-you', 'get-well', 'thinking-of-you'];
  
  occasions.forEach(occasion => {
    const message = getRandomMessage(occasion);
    TestRunner.assertNotNull(message, `${occasion} message exists`);
    TestRunner.assertNotNull(message.title, `${occasion} has title`);
    TestRunner.assertNotNull(message.message, `${occasion} has message text`);
  });

  // Test 5: Test localStorage save/load
  console.log('\nTesting LocalStorage Save/Load...');
  const testCard = {
    name: 'Test User',
    title: 'TEST TITLE',
    message: 'This is a test message'
  };
  
  try {
    const testUrl = await saveCard(testCard);
    TestRunner.assertNotNull(testUrl, 'Save card returns URL');
    TestRunner.assertContains(testUrl, '?card=', 'URL contains card parameter');
    
    // Extract card ID from URL
    const urlParams = new URLSearchParams(testUrl.split('?')[1]);
    const cardId = urlParams.get('card');
    
    // Check if card was saved to localStorage
    const savedCard = localStorage.getItem(`card:${cardId}`);
    TestRunner.assertNotNull(savedCard, 'Card saved to localStorage');
    
    const parsedCard = JSON.parse(savedCard);
    TestRunner.assertEquals(parsedCard.name, testCard.name, 'Card name matches');
    TestRunner.assertEquals(parsedCard.title, testCard.title, 'Card title matches');
    TestRunner.assertEquals(parsedCard.message, testCard.message, 'Card message matches');
    
    // Clean up
    localStorage.removeItem(`card:${cardId}`);
    console.log('   Cleaned up test data');
  } catch (error) {
    TestRunner.assert(false, `Save/Load test failed: ${error.message}`);
  }

  // Test 6: Test input validation
  console.log('\nTesting Input Validation...');
  const nameInput = document.getElementById('nameInput');
  const originalValue = nameInput.value;
  
  // Test empty name
  nameInput.value = '';
  TestRunner.assert(validateInput() === false, 'Validation fails with empty name');
  
  // Test valid name
  nameInput.value = 'John Doe';
  TestRunner.assert(validateInput() === true, 'Validation passes with valid name');
  
  // Restore original value
  nameInput.value = originalValue;

  // Test 7: Test occasion data structure
  console.log('\nTesting Occasion Data Structure...');
  TestRunner.assert(typeof occasionMessages === 'object', 'occasionMessages object exists');
  TestRunner.assertEquals(Object.keys(occasionMessages).length, 8, 'Has 8 occasions');
  
  Object.keys(occasionMessages).forEach(key => {
    const data = occasionMessages[key];
    TestRunner.assertNotNull(data.title, `${key} has title property`);
    TestRunner.assert(Array.isArray(data.messages), `${key} has messages array`);
    TestRunner.assert(data.messages.length > 0, `${key} has at least one message`);
  });

  // Test 8: Test URL generation
  console.log('\nTesting URL Generation...');
  const mockCard = { name: 'Test', title: 'TEST', message: 'Test message' };
  try {
    const url = await saveCard(mockCard);
    TestRunner.assert(url.includes(window.location.origin), 'URL includes origin');
    TestRunner.assert(url.includes('?card=card_'), 'URL has correct format');
    
    // Clean up
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const cardId = urlParams.get('card');
    localStorage.removeItem(`card:${cardId}`);
  } catch (error) {
    TestRunner.assert(false, `URL generation failed: ${error.message}`);
  }

  // Test 9: Test social share functions
  console.log('\nTesting Social Share Functions...');
  TestRunner.assert(typeof shareToFacebook === 'function', 'shareToFacebook function exists');
  TestRunner.assert(typeof shareToTwitter === 'function', 'shareToTwitter function exists');
  TestRunner.assert(typeof shareToWhatsApp === 'function', 'shareToWhatsApp function exists');
  TestRunner.assert(typeof shareToMessenger === 'function', 'shareToMessenger function exists');

  // Test 10: Test confetti creation
  console.log('\nTesting Confetti Function...');
  TestRunner.assert(typeof createConfetti === 'function', 'createConfetti function exists');
  
  // Test 11: Check localStorage availability
  console.log('\nTesting Browser Storage...');
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    TestRunner.assert(true, 'localStorage is available');
  } catch (e) {
    TestRunner.assert(false, 'localStorage is NOT available');
  }

  // Test 12: Test random message variety
  console.log('\nTesting Message Variety...');
  const birthdayMessages = new Set();
  for (let i = 0; i < 10; i++) {
    const msg = getRandomMessage('birthday');
    birthdayMessages.add(msg.message);
  }
  TestRunner.assert(birthdayMessages.size > 1, 'Random messages vary (not always the same)');

  // Print final summary
  TestRunner.printSummary();

  // Return results
  return {
    passed: TestRunner.passed,
    failed: TestRunner.failed,
    total: TestRunner.total,
    successRate: ((TestRunner.passed / TestRunner.total) * 100).toFixed(2)
  };
}

// Auto-run tests when script loads (optional)
console.log('Test suite loaded. Run runTests() to start testing.');
console.log('Example: await runTests()');

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, TestRunner };
}