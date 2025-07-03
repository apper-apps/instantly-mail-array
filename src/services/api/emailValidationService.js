class EmailValidationService {
  constructor() {
    this.validationResults = [];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validateEmailSyntax(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isDisposableEmail(email) {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'yopmail.com', 'temp-mail.org'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }

  isRoleBasedEmail(email) {
    const roleBasedPrefixes = [
      'admin', 'support', 'info', 'contact', 'sales', 'marketing', 
      'noreply', 'no-reply', 'help', 'service'
    ];
    const localPart = email.split('@')[0]?.toLowerCase();
    return roleBasedPrefixes.some(prefix => localPart.includes(prefix));
  }

  async validateSingleEmail(email) {
    await this.delay(50); // Simulate API call

    if (!this.validateEmailSyntax(email)) {
      return {
        email,
        isValid: false,
        reason: 'Invalid email syntax'
      };
    }

    if (this.isDisposableEmail(email)) {
      return {
        email,
        isValid: false,
        reason: 'Disposable email address',
        isRisky: true
      };
    }

    if (this.isRoleBasedEmail(email)) {
      return {
        email,
        isValid: true,
        reason: 'Role-based email address',
        isRisky: true
      };
    }

    // Simulate random validation results for demo
    const isValid = Math.random() > 0.1; // 90% valid rate
    
    if (!isValid) {
      const reasons = [
        'Domain does not exist',
        'Mailbox does not exist',
        'Domain not configured for email',
        'Blocked by provider'
      ];
      return {
        email,
        isValid: false,
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      };
    }

    return {
      email,
      isValid: true,
      reason: 'Valid email address'
    };
  }

  async validateBulk(file, progressCallback) {
    const text = await this.readFileContent(file);
    const emails = this.parseEmailList(text);
    
    const results = {
      total: emails.length,
      valid: [],
      invalid: [],
      risky: []
    };

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const validation = await this.validateSingleEmail(email);
      
      if (validation.isValid) {
        if (validation.isRisky) {
          results.risky.push(email);
        } else {
          results.valid.push(email);
        }
      } else {
        results.invalid.push({
          email: validation.email,
          reason: validation.reason
        });
      }

      // Update progress
      const progress = Math.round(((i + 1) / emails.length) * 100);
      if (progressCallback) {
        progressCallback(progress);
      }
    }

    // Store results
    const validationId = Date.now();
    this.validationResults.push({
      Id: validationId,
      fileName: file.name,
      timestamp: new Date().toISOString(),
      results
    });

    return results;
  }

  async readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  parseEmailList(text) {
    const lines = text.split('\n');
    const emails = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && trimmed.includes('@')) {
        // Handle CSV format - extract email from first column or find email in line
        const emailMatch = trimmed.match(/([^\s@]+@[^\s@]+\.[^\s@]+)/);
        if (emailMatch) {
          emails.push(emailMatch[1]);
        }
      }
    }
    
    // Remove duplicates
    return [...new Set(emails)];
  }

  async exportResults(data, type) {
    await this.delay(200);
    
    let content = '';
    let filename = '';
    
    if (type === 'valid') {
      content = data.join('\n');
      filename = `valid_emails_${Date.now()}.txt`;
    } else if (type === 'invalid') {
      content = data.map(item => `${item.email},${item.reason}`).join('\n');
      filename = `invalid_emails_${Date.now()}.csv`;
    }
    
    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  }

  async getValidationHistory() {
    await this.delay();
    return [...this.validationResults];
  }

  async deleteValidationResult(id) {
    await this.delay();
    const index = this.validationResults.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Validation result not found');
    }
    this.validationResults.splice(index, 1);
    return true;
  }
}

export const emailValidationService = new EmailValidationService();