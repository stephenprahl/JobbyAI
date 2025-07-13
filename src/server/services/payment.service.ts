import { decrypt, encrypt } from '../utils/encryption';
import { logger } from '../utils/logger';
import prisma from './prisma.service';

export interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  holderName?: string;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  description?: string;
  cardDetails: CardDetails;
  billingAddress?: BillingAddress;
  subscriptionId?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  error?: string;
}

export class PaymentService {
  /**
   * Process a payment using card details
   */
  public async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      logger.info('Processing payment', {
        userId: request.userId,
        amount: request.amount,
        currency: request.currency
      });

      // Validate card details
      const validationResult = this.validateCardDetails(request.cardDetails);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: request.userId,
          subscriptionId: request.subscriptionId,
          amount: request.amount,
          currency: request.currency,
          description: request.description,
          status: 'PENDING',
          cardLast4: request.cardDetails.number.slice(-4),
          cardBrand: this.detectCardBrand(request.cardDetails.number),
          billingAddress: request.billingAddress ? JSON.parse(JSON.stringify(request.billingAddress)) : null,
          metadata: {
            processedBy: 'internal_payment_system'
          }
        }
      });

      // Simulate payment processing (replace with actual payment gateway)
      const processingResult = await this.simulatePaymentProcessing(request.cardDetails, request.amount);

      if (processingResult.success) {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCEEDED',
            transactionId: processingResult.transactionId,
            processedAt: new Date()
          }
        });

        logger.info('Payment processed successfully', {
          paymentId: payment.id,
          transactionId: processingResult.transactionId
        });

        return {
          success: true,
          paymentId: payment.id,
          transactionId: processingResult.transactionId
        };
      } else {
        // Update payment status to failed
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            metadata: {
              ...payment.metadata as any,
              failureReason: processingResult.error
            }
          }
        });

        return {
          success: false,
          error: processingResult.error
        };
      }
    } catch (error) {
      logger.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment processing failed. Please try again.'
      };
    }
  }

  /**
   * Save payment method securely
   */
  public async savePaymentMethod(
    userId: string,
    cardDetails: CardDetails,
    billingAddress?: BillingAddress,
    setAsDefault: boolean = false
  ): Promise<{ success: boolean; paymentMethodId?: string; error?: string }> {
    try {
      // Validate card details
      const validationResult = this.validateCardDetails(cardDetails);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      // If setting as default, update existing default method
      if (setAsDefault) {
        await prisma.paymentMethod.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false }
        });
      }

      // Encrypt card token (in real implementation, use proper tokenization)
      const cardToken = this.generateCardToken(cardDetails);
      const encryptedToken = await encrypt(cardToken);

      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId,
          type: 'card',
          cardLast4: cardDetails.number.slice(-4),
          cardBrand: this.detectCardBrand(cardDetails.number),
          cardExpMonth: cardDetails.expMonth,
          cardExpYear: cardDetails.expYear,
          cardHolderName: cardDetails.holderName,
          billingAddress: billingAddress ? JSON.parse(JSON.stringify(billingAddress)) : null,
          isDefault: setAsDefault,
          encryptedCardToken: encryptedToken
        }
      });

      logger.info('Payment method saved', { userId, paymentMethodId: paymentMethod.id });

      return {
        success: true,
        paymentMethodId: paymentMethod.id
      };
    } catch (error) {
      logger.error('Error saving payment method:', error);
      return {
        success: false,
        error: 'Failed to save payment method'
      };
    }
  }

  /**
   * Get user's payment methods
   */
  public async getUserPaymentMethods(userId: string) {
    try {
      const paymentMethods = await prisma.paymentMethod.findMany({
        where: {
          userId,
          isActive: true
        },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          type: true,
          cardLast4: true,
          cardBrand: true,
          cardExpMonth: true,
          cardExpYear: true,
          cardHolderName: true,
          billingAddress: true,
          isDefault: true,
          createdAt: true
        }
      });

      return paymentMethods;
    } catch (error) {
      logger.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  /**
   * Process payment using saved payment method
   */
  public async processPaymentWithSavedMethod(
    userId: string,
    paymentMethodId: string,
    amount: number,
    currency: string = 'usd',
    description?: string,
    subscriptionId?: string
  ): Promise<PaymentResult> {
    try {
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          id: paymentMethodId,
          userId,
          isActive: true
        }
      });

      if (!paymentMethod) {
        return {
          success: false,
          error: 'Payment method not found'
        };
      }

      // Decrypt card token
      const cardToken = await decrypt(paymentMethod.encryptedCardToken);
      const cardDetails = this.parseCardToken(cardToken);

      return await this.processPayment({
        userId,
        amount,
        currency,
        description,
        cardDetails,
        billingAddress: paymentMethod.billingAddress ? (paymentMethod.billingAddress as unknown as BillingAddress) : undefined,
        subscriptionId
      });
    } catch (error) {
      logger.error('Error processing payment with saved method:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  }

  /**
   * Validate card details
   */
  private validateCardDetails(cardDetails: CardDetails): { valid: boolean; error?: string } {
    // Basic card number validation
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 13) {
      return { valid: false, error: 'Invalid card number' };
    }

    // Luhn algorithm validation
    if (!this.luhnCheck(cardDetails.number.replace(/\s/g, ''))) {
      return { valid: false, error: 'Invalid card number' };
    }

    // Expiry validation
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (cardDetails.expYear < currentYear ||
      (cardDetails.expYear === currentYear && cardDetails.expMonth < currentMonth)) {
      return { valid: false, error: 'Card has expired' };
    }

    // CVC validation
    if (!cardDetails.cvc || cardDetails.cvc.length < 3 || cardDetails.cvc.length > 4) {
      return { valid: false, error: 'Invalid CVC' };
    }

    return { valid: true };
  }

  /**
   * Luhn algorithm for card validation
   */
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Detect card brand from number
   */
  private detectCardBrand(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');

    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6/.test(number)) return 'discover';

    return 'unknown';
  }

  /**
   * Generate a card token (simplified - use proper tokenization in production)
   */
  private generateCardToken(cardDetails: CardDetails): string {
    return JSON.stringify({
      number: cardDetails.number,
      expMonth: cardDetails.expMonth,
      expYear: cardDetails.expYear,
      cvc: cardDetails.cvc,
      holderName: cardDetails.holderName
    });
  }

  /**
   * Parse card token back to card details
   */
  private parseCardToken(token: string): CardDetails {
    return JSON.parse(token);
  }

  /**
   * Simulate payment processing (replace with actual payment gateway)
   */
  private async simulatePaymentProcessing(
    cardDetails: CardDetails,
    amount: number
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate some failure cases for testing
    if (cardDetails.number.endsWith('0000')) {
      return {
        success: false,
        error: 'Insufficient funds'
      };
    }

    if (cardDetails.number.endsWith('1111')) {
      return {
        success: false,
        error: 'Card declined'
      };
    }

    // Generate mock transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId
    };
  }

  /**
   * Delete payment method
   */
  public async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    await prisma.paymentMethod.update({
      where: {
        id: paymentMethodId,
        userId
      },
      data: { isActive: false }
    });
  }

  /**
   * Set default payment method
   */
  public async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    await prisma.$transaction([
      // Remove default from all other methods
      prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      }),
      // Set new default
      prisma.paymentMethod.update({
        where: { id: paymentMethodId, userId },
        data: { isDefault: true }
      })
    ]);
  }
}

export const paymentService = new PaymentService();
