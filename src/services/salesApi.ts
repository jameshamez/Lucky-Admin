import axios from 'axios';

const BASE_URL = 'https://finfinphone.com/api-lucky/admin/price_estimation';
const ADMIN_BASE_URL = 'https://finfinphone.com/api-lucky/admin';
const PORTAL_BASE_URL = 'https://finfinphone.com/api-lucky/portal';

// ---- Product Interfaces ----
export interface ProductSize {
  id: number;
  product_id: number;
  size: string;
  height: number;
  width: number;
  weight: number;
}

export interface ProductColor {
  id: number;
  product_id: string;
  color: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

export interface ProductPrice {
  id: number;
  product_id: number;
  retail_price: number;
  wholesale_price: number;
  special_price: number;
}

export interface ProductPart {
  id: number;
  name: string;
  product_id: number;
  for_product: string;
  color: string;
  quantity: number;
}

export interface ProductOption {
  id: number;
  product_id: number;
  option_id: number;
}

export interface ProductionTime {
  id: number;
  product_id: number;
  duration: string;
  unit: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  modelName: string;
  description: string;
  price: number;
  category: string;
  subcategoryId: string;
  productType: string;
  options: ProductOption[];
  parts: ProductPart[];
  prices: ProductPrice[];
  sizes: ProductSize[];
  colors: ProductColor[];
  image: string;
  images: string[];
  productionTimes: ProductionTime[];
  inventory: number;
  request: number;
  total_available: number;
  tags: string[];
}

export interface GetProductsResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface PriceEstimationData {
  id?: string;
  customerId: string;
  salesOwnerId: string;
  estimateDate: string;
  jobName: string;
  productCategory: string;
  productType: string;
  quantity: string; // Backend expects int/decimal, but frontend state is string
  budget: string;
  status: string;
  estimateNote: string;
  eventDate: string;
  material: string;
  customMaterial: string;
  hasDesign: string;
  designDescription: string;

  // Medal
  medalSize: string;
  medalThickness: string;
  selectedColors: string[];
  frontDetails: string[];
  backDetails: string[];
  lanyardSize: string;
  lanyardPatterns: string;

  // Lanyard
  strapSize: string;
  strapPatternCount: string;
  sewingOption: string;

  // Award
  awardDesignDetails: string;
  plaqueOption: string;
  plaqueText: string;
  inscriptionPlate: string;
  inscriptionDetails: string;

  // Generic
  genericDesignDetails: string;

  // Dimensions
  width: string;
  length: string;
  height: string;
  thickness: string;

  // Files
  attachedFiles: { name: string; path: string }[]; // URLs or paths
}

export const salesApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BASE_URL}/upload_file.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  savePriceEstimation: async (data: PriceEstimationData) => {
    try {
      const response = await axios.post(`${BASE_URL}/save_price_estimation.php`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error saving price estimation:', error);
      throw error;
    }
  },

  getPriceEstimations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get_price_estimations.php`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price estimations:', error);
      throw error;
    }
  },

  getPriceEstimationDetail: async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/get_price_estimation_detail.php?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price estimation detail:', error);
      throw error;
    }
  },

  getCustomers: async () => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/get_customers.php`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  deletePriceEstimation: async (id: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/delete_price_estimation.php`, { id });
      return response.data;
    } catch (error) {
      console.error('Error deleting price estimation:', error);
      throw error;
    }
  },

  getProducts: async (): Promise<GetProductsResponse> => {
    try {
      const response = await axios.get<GetProductsResponse>(`${PORTAL_BASE_URL}/getProduct.php`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
};
