
// Types
export interface Brand {
  id: string;
  name: string;
  brand_brief?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  brand_brief?: string;
}

export interface UpdateBrandData {
  name?: string;
  brand_brief?: string;
}
