// Mock email verification service
const verificationCodes = new Map();

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const emailVerificationService = {
  async sendVerificationEmail(email) {
    await delay(300);
    
    const code = generateVerificationCode();
    const expiryTime = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    verificationCodes.set(email.toLowerCase(), {
      code,
      expiryTime
    });
    
    // In a real app, this would send an actual email
    console.log(`Verification code for ${email}: ${code}`);
    
    return {
      success: true,
      message: 'Verification email sent successfully'
    };
  },

  async verifyCode(email, code) {
    await delay(200);
    
    const storedData = verificationCodes.get(email.toLowerCase());
    
    if (!storedData) {
      return false;
    }
    
    if (Date.now() > storedData.expiryTime) {
      verificationCodes.delete(email.toLowerCase());
      return false;
    }
    
    if (storedData.code !== code) {
      return false;
    }
    
    verificationCodes.delete(email.toLowerCase());
    return true;
  },

  async resendVerificationEmail(email) {
    return this.sendVerificationEmail(email);
  }
};