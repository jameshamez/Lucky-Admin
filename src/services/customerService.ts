export interface AdditionalContact {
  contactName: string;
  lineId: string;
  phoneNumber: string;
  email: string;
}

export interface CreateCustomerPayload {
  companyName: string;
  customerType: string;
  taxId: string;
  billingProvince: string;
  billingDistrict: string;
  billingSubdistrict: string;
  billingPostcode: string;
  billingAddress: string;
  shippingProvince: string;
  shippingDistrict: string;
  shippingSubdistrict: string;
  shippingPostcode: string;
  shippingAddress: string;
  contactName: string;
  lineId: string;
  phoneNumbers: string[];
  emails: string[];
  presentationStatus: string;
  interestedProducts: string[];
  responsiblePerson: string;
  customerStatus: string;
  howFoundUs: string;
  otherChannel: string;
  notes: string;
  additionalContacts: AdditionalContact[];
}

const API_BASE_URL = 'https://finfinphone.com/api-lucky/admin';

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export const customerService = {
  /**
   * Creates a new customer by sending data to the PHP API.
   * Endpoint: POST /save_customer.php
   */
  createCustomer: async (payload: CreateCustomerPayload): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/save_customer.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  /**
   * Fetches all customers.
   * Endpoint: GET /get_customers.php
   */
  getCustomers: async (): Promise<unknown[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_customers.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }
};
