
// Mock user database
const mockUsers = [
  {
    Id: 1,
    email: 'demo@instantly.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date().toISOString()
  }
];

let userIdCounter = 2;

const generateToken = () => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
};

const findUserByEmail = (email) => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay(500);
    
    const user = findUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    if (user.password !== password) {
      return {
        success: false,
        message: 'Invalid password'
      };
    }
const token = generateToken();
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  },

  async register(email, password, firstName, lastName) {
    await delay(500);
    
    const existingUser = findUserByEmail(email);
    
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists with this email'
      };
    }
const newUser = {
      Id: userIdCounter++,
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    const token = generateToken();
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Registration successful!'
    };
  },

async logout() {
    await delay(200);
    return { success: true };
  },

  async forgotPassword(email) {
    await delay(500);
    
    const user = findUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    return {
      success: true,
      message: 'Password reset email sent successfully'
    };
  },

  async resetPassword(email, code, newPassword) {
    await delay(500);
    
    const user = findUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    user.password = newPassword;
    
    return {
      success: true,
      message: 'Password reset successfully'
    };
  }
};