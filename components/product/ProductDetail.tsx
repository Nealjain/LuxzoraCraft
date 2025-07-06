'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Minus, Plus, ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface ProductDetailHook {
  product: Product | null;
  reviews: Review[];
  isLoading: boolean;
  error: Error | null;
}

function useProductDetail(slug: string): ProductDetailHook {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (response.ok) {
          setProduct(data.product);
          setReviews(data.reviews);
        } else {
          setError(new Error(data.message || 'Failed to fetch product details'));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [slug]);

  return { product, reviews, isLoading, error };
}

// Move interfaces outside the component
interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsProps {
  productId: string;
}

function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock user ID for now - replace with actual authenticated user ID
  const currentUserId = 'user-mock-id'; 

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${productId}`);
        const data = await response.json();
        if (response.ok) {
          setReviews(data.reviews);
        } else {
          setError(data.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError('Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: currentUserId, ...newReview }),
      });
      const data = await response.json();
      if (response.ok) {
        setReviews(prev => [...prev, data.review]);
        setNewReview({ rating: 0, comment: '' });
        setSuccess('Review submitted successfully!');
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-gray-400">Loading reviews...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-dark p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <p className="font-medium text-white mr-2">User {review.user_id.substring(0, 8)}...</p>
                <div className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              </div>
              <p className="text-gray-300">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-xl font-serif text-white mt-10 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-white text-sm font-medium mb-2">Rating</label>
          <select
            id="rating"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            className="w-full p-3 rounded-md bg-gray-dark border border-white/10 text-white focus:ring-accent focus:border-accent"
            required
          >
            <option value="0">Select a rating</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comment" className="block text-white text-sm font-medium mb-2">Comment</label>
          <textarea
            id="comment"
            rows={4}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-dark border border-white/10 text-white focus:ring-accent focus:border-accent"
            placeholder="Share your thoughts on this product..."
            required
          ></textarea>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}



// Dynamically import Spline component to avoid SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64 bg-gray-dark rounded-lg">
      <p className="text-gray-400">Loading 3D Model...</p>
    </div>
  ),
})

interface ProductDetailProps {
  product?: Product;
  params?: { slug: string };
}

export default function ProductDetail({ product: propProduct, params }: ProductDetailProps) {
  // Initialize hooks first
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSpline, setShowSpline] = useState(false)
  
  const { addItem } = useCart()
  
  const slug = params?.slug;
  const { product: fetchedProduct, reviews, isLoading, error } = useProductDetail(slug || '');
  
  // Use prop product if provided, otherwise use fetched product
  const product = propProduct || fetchedProduct;

  // Only show loading/error states if we're fetching and don't have a prop product
  if (!propProduct && isLoading) return <div>Loading product details...</div>;
  if (!propProduct && error) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found.</div>;
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return
    if (value > product.stock) return
    setQuantity(value)
  }
  
  const handleAddToCart = () => {
    addItem(product, quantity)
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Images */}
      <div>
        <div className="mb-4 rounded-lg overflow-hidden aspect-square">
          {showSpline && product.spline_model ? (
            <Suspense fallback={<div className="h-full bg-gray-dark animate-pulse" />}>
              <Spline scene={product.spline_model} />
            </Suspense>
          ) : (
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="flex space-x-4">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveImage(index)
                setShowSpline(false)
              }}
              className={`w-20 h-20 rounded-md overflow-hidden ${
                activeImage === index && !showSpline ? 'ring-2 ring-accent' : ''
              }`}
            >
              <img 
                src={image} 
                alt={`${product.name} - View ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          
          {product.spline_model && (
            <button
              onClick={() => setShowSpline(true)}
              className={`w-20 h-20 rounded-md overflow-hidden bg-gray-dark flex items-center justify-center ${
                showSpline ? 'ring-2 ring-accent' : ''
              }`}
            >
              <span className="text-xs text-center text-accent">3D View</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
            {product.name}
          </h1>
          
          <p className="text-2xl text-accent font-medium mb-6">
            {formatPrice(product.price)}
          </p>
          
          <div className="border-t border-b border-white/10 py-4 my-6">
            <p className="text-gray-300">
              {product.description}
            </p>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="text-white mb-2">Quantity</p>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-10 h-10 bg-gray-dark flex items-center justify-center rounded-l-md"
              >
                <Minus size={16} />
              </button>
              
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 h-10 bg-gray-dark text-center border-x border-white/10"
              />
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 bg-gray-dark flex items-center justify-center rounded-r-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Stock Status */}
          <p className="text-sm mb-6">
            {product.stock > 0 ? (
              <span className="text-green-400">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-400">Out of Stock</span>
            )}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
            
            <button className="btn btn-outline flex items-center justify-center gap-2">
              <Heart size={18} />
              Add to Wishlist
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-1">Category</h3>
              <p className="text-gray-300 capitalize">{product.category}</p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-1">SKU</h3>
              <p className="text-gray-300">{product.id}</p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif text-white mb-6">Customer Reviews</h2>
          {product && <Reviews productId={product.id} />}
        </div>
      </div>
    </div>
  )
}