class EmailValidationService {
  constructor() {
    this.validationResults = [];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

validateEmailSyntax(email) {
    // RFC 5322 compliant email regex with better validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  async validateDomainExists(domain) {
    try {
      // Simulate DNS/MX record lookup
      await this.delay(100);
      
      // Common invalid domains for testing
      const invalidDomains = [
        'example.com', 'test.com', 'invalid.com', 'fake.com',
        'notreal.com', 'dummy.com', 'sample.com', 'placeholder.com'
      ];
      
      if (invalidDomains.includes(domain.toLowerCase())) {
        return false;
      }
      
      // Simulate some domains failing DNS lookup
      return Math.random() > 0.05; // 95% success rate for valid-looking domains
    } catch (error) {
      return false;
    }
  }

  isDisposableEmail(email) {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'yopmail.com', 'temp-mail.org', 'throwaway.email',
      'getnada.com', 'maildrop.cc', 'sharklasers.com', 'guerrillamail.info',
      'guerrillamail.biz', 'guerrillamail.de', 'grr.la', 'guerrillamail.net',
      'guerrillamail.org', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
      'trbvm.com', 'byom.de', 'trbvn.com', 'spamgourmet.com', 'incognitomail.org',
      'trashmail.com', 'kurzepost.de', 'objectmail.com', 'protonmail.com',
      'sogetthis.com', 'spamhereonline.com', 'spamherelots.com', 'spamhereplease.com',
      'tempemail.com', 'tempinbox.com', 'thankyou2010.com', 'trash2009.com',
      'mytrashmail.com', 'mailexpire.com', 'mailforspam.com', 'mailmetrash.com',
      'mailmoat.com', 'mailscrap.com', 'mailshell.com', 'mailsiphon.com',
      'mailzilla.com', 'mailzilla.org', 'mbx.cc', 'mt2009.com', 'mt2014.com',
      'myspaceinc.com', 'myspaceinc.net', 'myspaceinc.org', 'myspacepimpedup.com',
      'myspamless.com', 'mytrashmail.com', 'no-spam.ws', 'nobulk.com',
      'noclickemail.com', 'nogmailspam.info', 'nomail.xl.cx', 'nomail2me.com',
      'nomorespamemails.com', 'nonspam.eu', 'nonspammer.de', 'noref.in',
      'nospam.ze.tc', 'nospam4.us', 'nospamfor.us', 'nospamthanks.info',
      'notmailinator.com', 'nowmymail.com', 'nwldx.com', 'objectmail.com',
      'obobbo.com', 'odnorazovoe.ru', 'one-time.email', 'onewaymail.com',
      'online.ms', 'opayq.com', 'ordinaryamerican.net', 'otherinbox.com',
      'ovpn.to', 'owlpic.com', 'pancakemail.com', 'pcusers.otherinbox.com',
      'pjkmc.com', 'plexolan.de', 'pookmail.com', 'protonmail.ch',
      'prtnx.com', 'qisdo.com', 'qisoa.com', 'qoika.com', 'qqc.email',
      'quickinbox.com', 'rcpt.at', 'real-link.org', 'receiveee.com',
      'recode.me', 'reliable-mail.com', 'rhyta.com', 'rmqkr.net',
      'royal.net', 'rppkn.com', 'rtrtr.com', 'secure-mail.biz',
      'selfdestructingmail.com', 'selfdestructingmail.org', 'sendspamhere.com',
      'sharedmailbox.org', 'shieldedmail.com', 'shiftmail.com', 'shortmail.net',
      'sibmail.com', 'sify.com', 'simpleitsecurity.info', 'slapsfromlastnight.com',
      'slaskpost.se', 'smashmail.de', 'smellfear.com', 'snakemail.com',
      'sneakemail.com', 'snkmail.com', 'sofort-mail.de', 'sogetthis.com',
      'soodonims.com', 'spam.la', 'spam.su', 'spam4.me', 'spamavert.com',
      'spambob.com', 'spambob.net', 'spambob.org', 'spambog.com',
      'spambog.de', 'spambog.ru', 'spambox.us', 'spamcannon.com',
      'spamcannon.net', 'spamcero.com', 'spamcon.org', 'spamcorptastic.com',
      'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org', 'spamday.com',
      'spamex.com', 'spamfree24.com', 'spamfree24.de', 'spamfree24.eu',
      'spamfree24.info', 'spamfree24.net', 'spamfree24.org', 'spamgoes.com',
      'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org', 'spamhole.com',
      'spamify.com', 'spaminator.de', 'spamkill.info', 'spaml.com',
      'spaml.de', 'spammotel.com', 'spamobox.com', 'spamoff.de',
      'spamreturn.com', 'spamstack.net', 'spamthis.co.uk', 'spamthisplease.com',
      'spamtrail.com', 'spamtroll.net', 'speed.1s.fr', 'spikio.com',
      'spitfire.de', 'spoofmail.de', 'spray.se', 'squizzy.de',
      'ssoia.com', 'startkeys.com', 'stinkefinger.net', 'stop-my-spam.com',
      'stuffmail.de', 'super-auswahl.de', 'supergreatmail.com', 'supermailer.jp',
      'superrito.com', 'superstachel.de', 'suremail.info', 'sweetxxx.de',
      'tafmail.com', 'teewars.org', 'teleworm.com', 'teleworm.us',
      'temp-mail.org', 'temp-mail.ru', 'tempalias.com', 'tempemail.biz',
      'tempemail.com', 'tempemail.net', 'tempinbox.co.uk', 'tempinbox.com',
      'tempmail.eu', 'tempmail.it', 'tempmail2.com', 'tempmaildemo.com',
      'tempmailer.com', 'tempmailer.de', 'tempmailaddress.com', 'tempmailid.com',
      'tempthe.net', 'tempymail.com', 'test.com', 'thanksnospam.info',
      'thankyou2010.com', 'thc.st', 'thelimestones.com', 'thisisnotmyrealemail.com',
      'thismail.net', 'throwam.com', 'throwaway.email', 'throwawayemailaddresses.com',
      'tilien.com', 'tittbit.in', 'tmail.ws', 'tmailinator.com',
      'toiea.com', 'tokem.co', 'toomail.biz', 'topranklist.de',
      'tradermail.info', 'trash-amil.com', 'trash-mail.at', 'trash-mail.cf',
      'trash-mail.com', 'trash-mail.de', 'trash-mail.ga', 'trash-mail.gq',
      'trash-mail.ml', 'trash-mail.tk', 'trash2009.com', 'trash2010.com',
      'trash2011.com', 'trashdevil.com', 'trashdevil.de', 'trashemail.de',
      'trashmail.at', 'trashmail.com', 'trashmail.de', 'trashmail.me',
      'trashmail.net', 'trashmail.org', 'trashmail.ws', 'trashmailer.com',
      'trashymail.com', 'trashymail.net', 'trbvm.com', 'trbvn.com',
      'trialmail.de', 'trickmail.net', 'trillianpro.com', 'tryalert.com',
      'turual.com', 'twinmail.de', 'tyldd.com', 'uggsrock.com',
      'uk2.net', 'untergrund.net', 'uroid.com', 'us.af', 'venompen.com',
      'veryrealemail.com', 'vidchart.com', 'viditag.com', 'viewcastmedia.com',
      'viewcastmedia.net', 'viewcastmedia.org', 'vomoto.com', 'vubby.com',
      'walala.org', 'walkmail.net', 'webemail.me', 'weg-werfen.de',
      'wegwerfadresse.de', 'wegwerfemail.de', 'wegwerfmail.de', 'wegwerfmail.net',
      'wegwerfmail.org', 'wh4f.org', 'whyspam.me', 'willhackforfood.biz',
      'willselldrugs.com', 'wuzup.net', 'wuzupmail.net', 'www.e4ward.com',
      'wwwnew.eu', 'x.ip6.li', 'xagloo.com', 'xemaps.com', 'xents.com',
      'xmaily.com', 'xoxy.net', 'yapped.net', 'yeah.net', 'yesey.net',
      'yomail.info', 'yopmail.com', 'yopmail.fr', 'yopmail.net',
      'youmailr.com', 'yourdomain.com', 'ypmail.webredirect.org', 'yuurok.com',
      'za.com', 'zehnminutenmail.de', 'zetmail.com', 'zippymail.info',
      'zoemail.net', 'zoemail.org', 'zomg.info'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }

  isRoleBasedEmail(email) {
    const roleBasedPrefixes = [
      'admin', 'administrator', 'support', 'info', 'information', 'contact', 
      'sales', 'marketing', 'noreply', 'no-reply', 'help', 'service',
      'webmaster', 'postmaster', 'hostmaster', 'usenet', 'news', 'www',
      'uucp', 'ftp', 'abuse', 'security', 'root', 'daemon', 'system',
      'toor', 'dialer', 'manager', 'dumper', 'operator', 'decode',
      'guest', 'rfindd', 'email', 'mailer-daemon', 'nobody', 'inbox',
      'test', 'pgp-keys', 'pgp-public-keys', 'keys', 'pop', 'imap',
      'smtp', 'http', 'web', 'fax', 'mail', 'mailerdaemon', 'mlowner',
      'mlrequest', 'noc', 'operations', 'owner', 'request', 'root',
      'routing', 'support', 'sysadmin', 'tech', 'undisclosed-recipients',
      'postfix', 'mailer', 'listserv', 'majordomo', 'bounce', 'bounces',
      'confirm', 'join', 'leave', 'owner', 'request', 'admin'
    ];
    const localPart = email.split('@')[0]?.toLowerCase();
    return roleBasedPrefixes.some(prefix => 
      localPart === prefix || 
      localPart.startsWith(prefix + '.') || 
      localPart.startsWith(prefix + '_') ||
      localPart.startsWith(prefix + '-') ||
      localPart.endsWith('.' + prefix) ||
      localPart.endsWith('_' + prefix) ||
      localPart.endsWith('-' + prefix)
    );
  }

  validateEmailFormat(email) {
    const errors = [];
    
    // Check for consecutive dots
    if (email.includes('..')) {
      errors.push('Contains consecutive dots');
    }
    
    // Check for leading or trailing dots in local part
    const [localPart, domain] = email.split('@');
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      errors.push('Local part cannot start or end with a dot');
    }
    
    // Check for leading or trailing dots in domain
    if (domain && (domain.startsWith('.') || domain.endsWith('.'))) {
      errors.push('Domain cannot start or end with a dot');
    }
    
    // Check for multiple @ symbols
    if ((email.match(/@/g) || []).length !== 1) {
      errors.push('Must contain exactly one @ symbol');
    }
    
    // Check length constraints
    if (email.length > 254) {
      errors.push('Email address too long (max 254 characters)');
    }
    
    if (localPart.length > 64) {
      errors.push('Local part too long (max 64 characters)');
    }
    
    if (domain && domain.length > 253) {
      errors.push('Domain too long (max 253 characters)');
    }
    
    return errors;
  }

async validateSingleEmail(email) {
    await this.delay(50); // Simulate API call

    // Trim whitespace
    email = email.trim();

    // Check for empty email
    if (!email) {
      return {
        email,
        isValid: false,
        reason: 'Email address is empty'
      };
    }

    // Check basic syntax first
    if (!this.validateEmailSyntax(email)) {
      return {
        email,
        isValid: false,
        reason: 'Invalid email syntax'
      };
    }

    // Check format issues
    const formatErrors = this.validateEmailFormat(email);
    if (formatErrors.length > 0) {
      return {
        email,
        isValid: false,
        reason: formatErrors[0] // Return first error
      };
    }

    // Check for disposable email
    if (this.isDisposableEmail(email)) {
      return {
        email,
        isValid: false,
        reason: 'Disposable email address detected',
        isRisky: true
      };
    }

    // Check for role-based email
    if (this.isRoleBasedEmail(email)) {
      return {
        email,
        isValid: true,
        reason: 'Role-based email address (may have low engagement)',
        isRisky: true
      };
    }

    // Validate domain exists
    const domain = email.split('@')[1];
    const domainExists = await this.validateDomainExists(domain);
    
    if (!domainExists) {
      return {
        email,
        isValid: false,
        reason: 'Domain does not exist or has no mail servers'
      };
    }

    // Additional validation checks with more realistic simulation
    const validationChecks = [
      { check: () => Math.random() > 0.02, reason: 'Mailbox does not exist' },
      { check: () => Math.random() > 0.01, reason: 'Domain not configured for email' },
      { check: () => Math.random() > 0.005, reason: 'Blocked by email provider' },
      { check: () => Math.random() > 0.003, reason: 'Recipient server temporarily unavailable' }
    ];

    for (const { check, reason } of validationChecks) {
      if (!check()) {
        return {
          email,
          isValid: false,
          reason
        };
      }
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