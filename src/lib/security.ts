
// Security utilities for API key handling and encryption
export class SecurityUtils {
  private static readonly ENCRYPTION_KEY = 'lovable-ai-comment-security-key';

  // Simple encryption for API keys (in production, use proper encryption)
  static encryptApiKey(apiKey: string): string {
    if (!apiKey) return '';
    
    // Simple XOR encryption for demo purposes
    // In production, use proper encryption libraries
    const encrypted = apiKey
      .split('')
      .map((char, index) => 
        String.fromCharCode(
          char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(index % this.ENCRYPTION_KEY.length)
        )
      )
      .join('');
    
    return btoa(encrypted);
  }

  static decryptApiKey(encryptedKey: string): string {
    if (!encryptedKey) return '';
    
    try {
      const decoded = atob(encryptedKey);
      const decrypted = decoded
        .split('')
        .map((char, index) => 
          String.fromCharCode(
            char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(index % this.ENCRYPTION_KEY.length)
          )
        )
        .join('');
      
      return decrypted;
    } catch {
      return '';
    }
  }

  // Mask API key for display
  static maskApiKey(apiKey: string): string {
    if (!apiKey || apiKey.length < 8) return '••••••••';
    
    const start = apiKey.substring(0, 4);
    const end = apiKey.substring(apiKey.length - 4);
    const middle = '•'.repeat(Math.max(8, apiKey.length - 8));
    
    return `${start}${middle}${end}`;
  }

  // Validate API key format
  static validateApiKeyFormat(apiKey: string): boolean {
    if (!apiKey) return false;
    
    // Basic validation - should be alphanumeric with some special chars
    const apiKeyRegex = /^[a-zA-Z0-9\-_\.]{20,200}$/;
    return apiKeyRegex.test(apiKey);
  }
}
