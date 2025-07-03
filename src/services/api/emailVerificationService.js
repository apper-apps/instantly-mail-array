// Mock email verification service with enhanced delivery simulation
const verificationCodes = new Map();
const emailDeliveryAttempts = new Map();

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate real-world email delivery scenarios
const simulateEmailDelivery = async (email) => {
  const attemptCount = emailDeliveryAttempts.get(email.toLowerCase()) || 0;
  emailDeliveryAttempts.set(email.toLowerCase(), attemptCount + 1);
  
  // Simulate various email delivery scenarios
  const scenarios = [
    { success: true, probability: 0.85, message: 'Email sent successfully' },
    { success: false, probability: 0.10, message: 'Email delivery failed - Invalid email address' },
    { success: false, probability: 0.03, message: 'Email delivery failed - SMTP server error' },
    { success: false, probability: 0.02, message: 'Email delivery failed - Rate limit exceeded' }
  ];
  
  // On first attempt, sometimes fail to simulate real issues
  // On retry attempts, increase success probability
  const successBoost = attemptCount > 1 ? 0.15 : 0;
  const random = Math.random();
  let cumulative = 0;
  
  for (const scenario of scenarios) {
    const adjustedProbability = scenario.success ? scenario.probability + successBoost : scenario.probability * (1 - successBoost);
    cumulative += adjustedProbability;
    if (random < cumulative) {
      return scenario;
    }
  }
  
  return scenarios[0]; // Default to success
};

export const emailVerificationService = {
  async sendVerificationEmail(email) {
    await delay(300);
    
    console.log(`🔄 Attempting to send verification email to: ${email}`);
    
    // Simulate email delivery
    const deliveryResult = await simulateEmailDelivery(email);
    
    if (!deliveryResult.success) {
      console.error(`❌ Email delivery failed for ${email}: ${deliveryResult.message}`);
      return {
        success: false,
        message: deliveryResult.message
      };
    }
    
    const code = generateVerificationCode();
    const expiryTime = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    verificationCodes.set(email.toLowerCase(), {
      code,
      expiryTime,
      attempts: 0
    });
    
    // Success - log for debugging
    console.log(`✅ Email sent successfully to ${email}`);
    console.log(`📧 Verification code for ${email}: ${code}`);
    console.log(`⏰ Code expires at: ${new Date(expiryTime).toLocaleTimeString()}`);
    
    // Reset delivery attempts on successful send
    emailDeliveryAttempts.set(email.toLowerCase(), 0);
    
    return {
      success: true,
      message: 'Verification email sent successfully'
    };
  },

  async verifyCode(email, code) {
    await delay(200);
    
    const storedData = verificationCodes.get(email.toLowerCase());
    
    if (!storedData) {
      console.log(`❌ No verification code found for ${email}`);
      return false;
    }
    
    // Track verification attempts
    storedData.attempts += 1;
    
    if (Date.now() > storedData.expiryTime) {
      console.log(`⏰ Verification code expired for ${email}`);
      verificationCodes.delete(email.toLowerCase());
      return false;
    }
    
    if (storedData.code !== code) {
      console.log(`❌ Invalid verification code for ${email}. Attempt ${storedData.attempts}`);
      
      // Remove after too many failed attempts
      if (storedData.attempts >= 5) {
        console.log(`🚫 Too many failed attempts for ${email}. Code invalidated.`);
        verificationCodes.delete(email.toLowerCase());
      }
      return false;
    }
    
    console.log(`✅ Email verification successful for ${email}`);
    verificationCodes.delete(email.toLowerCase());
    emailDeliveryAttempts.delete(email.toLowerCase());
    return true;
  },

  async resendVerificationEmail(email) {
    console.log(`🔄 Resending verification email to: ${email}`);
    return this.sendVerificationEmail(email);
  },

  // Debug helper - not used in production
  getStoredCodes() {
    return Array.from(verificationCodes.entries()).map(([email, data]) => ({
      email,
      code: data.code,
      expiresAt: new Date(data.expiryTime).toLocaleString(),
      attempts: data.attempts
    }));
  }
};