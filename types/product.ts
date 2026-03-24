export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  spline_model?: string
}