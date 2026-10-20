import { useEffect, useRef, useState } from 'react'
import {
  Leaf, Recycle, Truck, Smartphone, RefreshCw, Star, X, ShoppingBag, Menu,
  ArrowRight, ArrowLeft, Check, CheckCircle, CreditCard, Banknote, Scale,
  Globe, Waves, Droplets, Wind, Sprout, Lightbulb, Image, MessageCircle,
  Briefcase, Play, Package, FileText, Archive, Cpu, Shirt, Package2,
  Home, MapPin, Clock, Award, Users, User, Eye, EyeOff, ShieldCheck, QrCode,
  Mail, Lock, LogOut, Send
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  points: number
  image: string
  badge?: string
  badgeColor?: string
  description: string
  impact: string
  co2Saved: string
  material: string
  rating: number
  reviews: number
  inStock: boolean
  tags: string[]
}

interface CartItem {
  product: Product
  qty: number
}

type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered'

interface DeliveryAddress {
  name: string
  phone: string
  flat: string
  area: string
  pin: string
}

interface Order {
  id: string
  date: string
  items: CartItem[]
  totalPaid: number
  pointsUsed: number
  pointsEarned: number
  address: DeliveryAddress
  paymentMethod: string
  status: OrderStatus
  statusStep: number
  timelineTimes: Array<string | null>
  estimatedDelivery: string
  plasticAvoidedKg: number
  co2SavedKg: number
}

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'Reusable', label: 'Reusable' },
  { id: 'Upcycled', label: 'Upcycled Goods' },
  { id: 'Plastic-Free', label: 'Plastic-Free' },
  { id: 'Sustainable', label: 'Sustainable Living' },
]

const CATEGORY_CARDS = [
  {
    id: 'Reusable',
    name: 'Reusable Products',
    desc: 'Long-lasting alternatives that outlive single-use',
    count: 48,
    img: 'https://images.unsplash.com/photo-1633878353720-7a49a4a3d0ec?w=600&h=700&fit=crop&auto=format',
  },
  {
    id: 'Upcycled',
    name: 'Upcycled Goods',
    desc: 'Waste transformed into beautiful, useful objects',
    count: 32,
    img: 'https://images.unsplash.com/photo-1599403516947-eef21d54ec99?w=600&h=700&fit=crop&auto=format',
  },
  {
    id: 'Plastic-Free',
    name: 'Plastic-Free',
    desc: 'Say goodbye to plastic, forever',
    count: 61,
    img: 'https://images.unsplash.com/photo-1563391506244-af91a410fcc9?w=600&h=700&fit=crop&auto=format',
  },
  {
    id: 'Sustainable',
    name: 'Sustainable Living',
    desc: 'Everyday essentials reimagined for zero waste',
    count: 27,
    img: 'https://images.unsplash.com/photo-1643185720431-9c050eebbc9a?w=600&h=700&fit=crop&auto=format',
  },
]

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Bamboo Cutlery Travel Set',
    category: 'Reusable',
    price: 299,
    originalPrice: 399,
    points: 30,
    image: 'https://images.unsplash.com/photo-1633878353628-5fc8b983325c?w=600&h=720&fit=crop&auto=format',
    badge: 'Best Seller',
    badgeColor: '#2D5016',
    description: 'Premium bamboo cutlery set with fork, knife, spoon, chopsticks and a cleaning brush in a handwoven travel pouch. Replaces 500+ single-use plastic utensils per year. Naturally antibacterial, lightweight, and compostable at end of life.',
    impact: 'Prevents 500g plastic/year',
    co2Saved: '1.2 kg CO₂',
    material: '100% Organic Bamboo',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    tags: ['bamboo', 'kitchen', 'travel'],
  },
  {
    id: 2,
    name: 'Borosilicate Glass Containers (Set of 3)',
    category: 'Reusable',
    price: 899,
    points: 90,
    image: 'https://images.unsplash.com/photo-1681146375786-07ca2c058ce1?w=600&h=720&fit=crop&auto=format',
    badge: 'New Arrival',
    badgeColor: '#5C8A44',
    description: 'Leak-proof borosilicate glass containers with bamboo lids. Microwave, oven, and dishwasher safe. Nesting design for compact storage. Eliminates the need for plastic wrap and single-use containers permanently.',
    impact: 'Eliminates 240 plastic bags/year',
    co2Saved: '3.4 kg CO₂',
    material: 'Borosilicate Glass + Bamboo',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    tags: ['glass', 'kitchen', 'meal-prep'],
  },
  {
    id: 3,
    name: 'Handcrafted Neem Wood Comb',
    category: 'Plastic-Free',
    price: 149,
    points: 15,
    image: 'https://images.unsplash.com/photo-1774301844178-c9ce96b76d92?w=600&h=720&fit=crop&auto=format',
    description: 'Hand-carved neem wood wide-tooth comb. Conditions and detangles naturally, reduces static, and massages the scalp. Fully compostable at end of life. Each piece has unique wood grain — no two are identical.',
    impact: 'Saves 3 plastic combs/year',
    co2Saved: '0.3 kg CO₂',
    material: '100% Neem Wood',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    tags: ['neem', 'hair', 'bathroom'],
  },
  {
    id: 4,
    name: 'Upcycled Denim Tote Bag',
    category: 'Upcycled',
    price: 549,
    originalPrice: 699,
    points: 55,
    image: 'https://images.unsplash.com/photo-1731834880898-00fccc78e5ba?w=600&h=720&fit=crop&auto=format',
    badge: 'Artisan Made',
    badgeColor: '#8B6347',
    description: 'Handmade in Mumbai by local artisans using reclaimed denim jeans. Each bag is one-of-a-kind. Reinforced cotton handles, interior pocket, and zip closure. Diverts post-consumer textile waste from landfill.',
    impact: 'Diverts 300g textile waste',
    co2Saved: '2.1 kg CO₂',
    material: 'Reclaimed Denim + Organic Cotton',
    rating: 4.6,
    reviews: 67,
    inStock: true,
    tags: ['denim', 'upcycled', 'handmade'],
  },
  {
    id: 5,
    name: 'Cold-Process Soap Bar Collection',
    category: 'Plastic-Free',
    price: 399,
    points: 40,
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=720&fit=crop&auto=format',
    badge: 'Vegan',
    badgeColor: '#5C8A44',
    description: 'Set of 3 handcrafted cold-process soap bars. Lemongrass & Ginger, Neem & Turmeric, Charcoal & Tea Tree. Completely plastic-free packaging. Each bar lasts 3× longer than bottled liquid soap.',
    impact: 'Eliminates 6 plastic bottles',
    co2Saved: '0.8 kg CO₂',
    material: 'Natural Plant Oils + Herbs',
    rating: 4.9,
    reviews: 312,
    inStock: true,
    tags: ['soap', 'vegan', 'bathroom'],
  },
  {
    id: 6,
    name: 'Bamboo Toothbrush (Pack of 4)',
    category: 'Plastic-Free',
    price: 249,
    points: 25,
    image: 'https://images.unsplash.com/photo-1553691475-f38e4026275b?w=600&h=720&fit=crop&auto=format',
    badge: 'Eco Pick',
    badgeColor: '#3D6B20',
    description: 'FSC-certified bamboo handle with BPA-free nylon bristles. The handle is fully compostable — simply remove the bristles before composting. Dentist-approved and gentle on gums.',
    impact: '4 less plastic toothbrushes',
    co2Saved: '0.5 kg CO₂',
    material: 'FSC Bamboo + Nylon Bristles',
    rating: 4.7,
    reviews: 445,
    inStock: true,
    tags: ['bamboo', 'dental', 'bathroom'],
  },
  {
    id: 7,
    name: 'Recycled Paper Seed Notebook',
    category: 'Upcycled',
    price: 199,
    points: 20,
    image: 'https://images.unsplash.com/photo-1648235982809-61e2a66f5c01?w=600&h=720&fit=crop&auto=format',
    description: '120 pages of 100% recycled paper with a seed-embedded kraft cover. When the notebook is done, tear and plant the cover — it grows wildflowers. Soy-based ink printing throughout.',
    impact: 'Saves 1 tree per 10 notebooks',
    co2Saved: '0.4 kg CO₂',
    material: '100% Recycled Paper',
    rating: 4.5,
    reviews: 198,
    inStock: true,
    tags: ['stationery', 'upcycled', 'office'],
  },
  {
    id: 8,
    name: 'Organic Cotton Produce Bags (Set of 6)',
    category: 'Reusable',
    price: 349,
    points: 35,
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&h=720&fit=crop&auto=format',
    description: 'Lightweight GOTS-certified organic cotton mesh bags for fruits, vegetables, and bulk goods. Tare weight printed on each bag. Machine washable and durable for 300+ wash cycles.',
    impact: 'Replaces 300+ plastic bags/year',
    co2Saved: '2.8 kg CO₂',
    material: 'GOTS Certified Organic Cotton',
    rating: 4.8,
    reviews: 521,
    inStock: true,
    tags: ['cotton', 'produce', 'grocery'],
  },
]

const ORDER_STEPS = [
  'Order placed',
  'Packed in plastic-free packaging',
  'Shipped',
  'Out for delivery',
  'Delivered',
]

const calculateOrderImpact = (items: CartItem[]) => ({
  plasticAvoidedKg: Number(items.reduce((sum, item) => sum + item.qty * 0.24, 0).toFixed(2)),
  co2SavedKg: Number(items.reduce((sum, item) => sum + parseFloat(item.product.co2Saved) * item.qty, 0).toFixed(1)),
})

const demoDate = (dayOffset: number, hour = 12, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date
}

const timelineLabel = (date: Date) => date.toLocaleString('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

const deliveryDateLabel = (date: Date) => date.toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'REVIVE-39218',
    date: demoDate(-3, 11, 20).toISOString(),
    items: [
      { product: PRODUCTS[1], qty: 1 },
      { product: PRODUCTS[7], qty: 2 },
    ],
    totalPaid: 1547,
    pointsUsed: 100,
    pointsEarned: 160,
    address: {
      name: 'Priya Sharma',
      phone: '98205 67842',
      flat: 'A-204, Greenview Apts',
      area: 'Andheri West, Mumbai',
      pin: '400053',
    },
    paymentMethod: 'UPI Payment',
    status: 'Shipped',
    statusStep: 2,
    timelineTimes: [
      timelineLabel(demoDate(-3, 11, 20)),
      timelineLabel(demoDate(-3, 16, 45)),
      timelineLabel(demoDate(-2, 9, 10)),
      null,
      null,
    ],
    estimatedDelivery: deliveryDateLabel(demoDate(1)),
    ...calculateOrderImpact([
      { product: PRODUCTS[1], qty: 1 },
      { product: PRODUCTS[7], qty: 2 },
    ]),
  },
  {
    id: 'REVIVE-28471',
    date: demoDate(-10, 14, 35).toISOString(),
    items: [
      { product: PRODUCTS[0], qty: 1 },
      { product: PRODUCTS[4], qty: 1 },
    ],
    totalPaid: 648,
    pointsUsed: 0,
    pointsEarned: 70,
    address: {
      name: 'Priya Sharma',
      phone: '98205 67842',
      flat: 'A-204, Greenview Apts',
      area: 'Andheri West, Mumbai',
      pin: '400053',
    },
    paymentMethod: 'Credit / Debit Card',
    status: 'Delivered',
    statusStep: 4,
    timelineTimes: [
      timelineLabel(demoDate(-10, 14, 35)),
      timelineLabel(demoDate(-10, 18, 10)),
      timelineLabel(demoDate(-9, 8, 30)),
      timelineLabel(demoDate(-7, 10, 15)),
      timelineLabel(demoDate(-7, 13, 42)),
    ],
    estimatedDelivery: deliveryDateLabel(demoDate(-7)),
    ...calculateOrderImpact([
      { product: PRODUCTS[0], qty: 1 },
      { product: PRODUCTS[4], qty: 1 },
    ]),
  },
]

/* ─── Points rate table ──────────────────────────────────────────────────── */
const WASTE_TYPES = [
  { id: 'plastic',  label: 'Plastic',           pts: 10, Icon: Package  },
  { id: 'paper',   label: 'Paper & Cardboard',  pts: 8,  Icon: FileText },
  { id: 'glass',   label: 'Glass',              pts: 6,  Icon: Archive  },
  { id: 'metal',   label: 'Metal Cans',         pts: 15, Icon: Package2 },
  { id: 'eWaste',  label: 'E-Waste',            pts: 20, Icon: Cpu      },
  { id: 'clothes', label: 'Old Clothes',        pts: 12, Icon: Shirt    },
]

/* ─── Points discount helper — 100 pts = ₹50 off ────────────────────────── */
function calcDiscount(greenPoints: number, subtotal: number) {
  const usable = Math.floor(greenPoints / 100) * 100
  return Math.min((usable / 100) * 50, subtotal)
}

function calculateCartTotals(
  cart: CartItem[],
  greenPoints: number,
  usePoints: boolean,
  payMode?: 'upi' | 'card' | 'cod',
) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  const discount = usePoints ? calcDiscount(greenPoints, subtotal) : 0
  const shipping = subtotal >= 499 ? 0 : 49
  const paymentFee = payMode === 'cod' ? 25 : 0
  return {
    subtotal,
    discount,
    shipping,
    paymentFee,
    total: subtotal - discount + shipping + paymentFee,
  }
}

/* ─── Stars ──────────────────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={11}
          strokeWidth={1.5}
          fill={i <= Math.round(rating) ? '#2D5016' : 'none'}
          color={i <= Math.round(rating) ? '#2D5016' : '#D4C5A9'}
        />
      ))}
    </div>
  )
}

/* ─── Product Card ───────────────────────────────────────────────────────── */
function ProductCard({
  product,
  onAddToCart,
  onOpenProduct,
}: {
  product: Product
  onAddToCart: (p: Product) => void
  onOpenProduct: (p: Product) => void
}) {
  return (
    <div className="product-card group cursor-pointer" onClick={() => onOpenProduct(product)}>
      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '5/6', backgroundColor: '#EDE8DC' }}>
        <img
          src={product.image}
          alt={product.name}
          className="product-img w-full h-full object-cover"
        />
        {product.badge && (
          <div
            className="absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: product.badgeColor ?? '#2D5016', fontFamily: 'var(--font-body)' }}
          >
            {product.badge}
          </div>
        )}
        <div className="card-actions absolute bottom-3 left-3 right-3">
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(product) }}
            className="w-full py-2.5 text-sm font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: '#2D5016', color: '#F5F0E8', fontFamily: 'var(--font-body)' }}
          >
            Add to Cart — ₹{product.price.toLocaleString('en-IN')}
          </button>
        </div>
      </div>
      <div className="pt-3 pb-1 px-0.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#5C8A44' }}>
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Stars rating={product.rating} />
            <span className="text-xs" style={{ color: '#8B6347' }}>({product.reviews})</span>
          </div>
        </div>
        <h3
          className="text-base font-semibold leading-snug mb-1.5"
          style={{ fontFamily: 'var(--font-display)', color: '#1A3409', lineHeight: '1.3' }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold" style={{ color: '#2D5016' }}>₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm line-through" style={{ color: '#B0A090' }}>₹{product.originalPrice}</span>
            )}
          </div>
          <div
            className="flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1"
            style={{ backgroundColor: '#D4EBC8', color: '#2D5016' }}
          >
            <Leaf size={11} strokeWidth={1.5} color="#2D5016" />
            <span>+{product.points} pts</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <Globe size={11} strokeWidth={1.5} color="#5C8A44" />
          <p className="text-xs font-medium" style={{ color: '#5C8A44' }}>{product.impact}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Product Modal ──────────────────────────────────────────────────────── */
function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product
  onClose: () => void
  onAddToCart: (p: Product) => void
}) {
  const [qty, setQty] = useState(1)

  const impactMeta = [
    { label: 'Impact',    val: product.impact,                        Icon: Waves        },
    { label: 'CO₂ Saved', val: product.co2Saved,                     Icon: Wind         },
    { label: 'Material',  val: product.material,                      Icon: Leaf         },
    { label: 'In Stock',  val: product.inStock ? 'Available' : 'Out', Icon: CheckCircle  },
  ]

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26,52,9,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="fade-in relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#F5F0E8', maxHeight: '92vh', overflowY: 'auto' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(45,80,22,0.12)', color: '#2D5016' }}
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative overflow-hidden" style={{ minHeight: 360, backgroundColor: '#EDE8DC' }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" style={{ minHeight: 360 }} />
            {product.badge && (
              <div
                className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: product.badgeColor ?? '#2D5016', fontFamily: 'var(--font-body)' }}
              >
                {product.badge}
              </div>
            )}
          </div>

          <div className="p-7 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#5C8A44' }}>
                {product.category}
              </span>
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ fontFamily: 'var(--font-display)', color: '#1A3409', lineHeight: 1.25 }}
              >
                {product.name}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <Stars rating={product.rating} />
                <span className="text-sm" style={{ color: '#8B6347' }}>{product.rating} ({product.reviews} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-bold" style={{ color: '#2D5016' }}>₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span className="text-base line-through" style={{ color: '#B0A090' }}>₹{product.originalPrice}</span>
                )}
                <div
                  className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 ml-auto"
                  style={{ backgroundColor: '#D4EBC8', color: '#2D5016' }}
                >
                  <Leaf size={11} strokeWidth={1.5} color="#2D5016" />
                  Earn +{product.points} pts
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A5C3C', lineHeight: 1.7 }}>
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {impactMeta.map(item => (
                  <div key={item.label} className="rounded-xl p-3" style={{ backgroundColor: '#EDE8DC' }}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <item.Icon size={11} strokeWidth={1.5} color="#8B6347" />
                      <span className="text-xs font-medium" style={{ color: '#8B6347' }}>{item.label}</span>
                    </div>
                    <div className="text-xs font-semibold" style={{ color: '#1A3409' }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: '#D4C5A9' }}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 text-lg font-bold flex items-center justify-center transition-colors hover:bg-mint"
                    style={{ color: '#2D5016' }}
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold text-sm" style={{ color: '#1A3409' }}>{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 text-lg font-bold flex items-center justify-center transition-colors hover:bg-mint"
                    style={{ color: '#2D5016' }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => { for (let i = 0; i < qty; i++) onAddToCart(product); onClose() }}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
                  style={{ backgroundColor: '#2D5016', color: '#F5F0E8', fontFamily: 'var(--font-body)' }}
                >
                  Add {qty > 1 ? `${qty} ` : ''}to Cart — ₹{(product.price * qty).toLocaleString('en-IN')}
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs" style={{ color: '#8B6347' }}>
                <span className="flex items-center gap-1"><Truck size={11} strokeWidth={1.5} color="#8B6347" /> Free delivery above ₹499</span>
                <span className="flex items-center gap-1"><RefreshCw size={11} strokeWidth={1.5} color="#8B6347" /> 7-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Cart Sidebar ───────────────────────────────────────────────────────── */
function CartSidebar({
  cart, isOpen, onClose, onUpdateQty, onRemove, onCheckout,
  greenPoints, usePoints, setUsePoints,
}: {
  cart: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQty: (id: number, qty: number) => void
  onRemove: (id: number) => void
  onCheckout: () => void
  greenPoints: number
  usePoints: boolean
  setUsePoints: (v: boolean) => void
}) {
  const { subtotal, discount: pointsDiscount, shipping, total } = calculateCartTotals(cart, greenPoints, usePoints)

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(26,52,9,0.35)' }} onClick={onClose} />
      )}
      <div
        className="cart-slide fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl"
        style={{ width: 'min(420px, 100vw)', backgroundColor: '#F5F0E8', transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#D4C5A9' }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>Your Cart</h2>
            <p className="text-xs mt-0.5" style={{ color: '#8B6347' }}>{cart.reduce((s, i) => s + i.qty, 0)} items</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EDE8DC', color: '#2D5016' }}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} strokeWidth={1} color="#D4C5A9" className="mx-auto mb-4" />
              <p className="font-semibold text-lg mb-2" style={{ color: '#1A3409' }}>Your cart is empty</p>
              <p className="text-sm" style={{ color: '#8B6347' }}>Add some eco-friendly products to get started</p>
              <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#2D5016', color: '#F5F0E8', fontFamily: 'var(--font-body)' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex gap-4 pb-4 border-b" style={{ borderColor: '#EDE8DC' }}>
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#EDE8DC' }}>
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-0.5 uppercase tracking-wide" style={{ color: '#5C8A44' }}>{item.product.category}</p>
                  <p className="text-sm font-semibold leading-snug mb-2" style={{ color: '#1A3409' }}>{item.product.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: '#D4C5A9' }}>
                      <button onClick={() => onUpdateQty(item.product.id, item.qty - 1)} className="w-7 h-7 text-sm font-bold" style={{ color: '#2D5016' }}>−</button>
                      <span className="w-7 text-center text-xs font-semibold" style={{ color: '#1A3409' }}>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.product.id, item.qty + 1)} className="w-7 h-7 text-sm font-bold" style={{ color: '#2D5016' }}>+</button>
                    </div>
                    <span className="font-bold text-sm" style={{ color: '#2D5016' }}>₹{(item.product.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button onClick={() => onRemove(item.product.id)} className="self-start pt-1 opacity-40 hover:opacity-100 transition-opacity">
                  <X size={14} strokeWidth={1.5} color="#8B6347" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: '#D4C5A9', backgroundColor: '#EDE8DC' }}>
            {/* Green Points toggle */}
            <div
              className="flex items-center justify-between p-3 rounded-xl mb-4 cursor-pointer"
              style={{ backgroundColor: '#D4EBC8' }}
              onClick={() => setUsePoints(!usePoints)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors"
                  style={{ backgroundColor: usePoints ? '#2D5016' : 'white', borderColor: '#5C8A44' }}
                >
                  {usePoints && <Check size={11} strokeWidth={2.5} color="white" />}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#1A3409' }}>Use {greenPoints} Green Points</p>
                  <p className="text-xs" style={{ color: '#5C8A44' }}>100 pts = ₹50 off · Save ₹{calcDiscount(greenPoints, subtotal)}</p>
                </div>
              </div>
              <span className="text-xs font-bold point-pulse" style={{ color: '#2D5016' }}>
                {usePoints ? `−₹${pointsDiscount}` : '−₹0'}
              </span>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span style={{ color: '#8B6347' }}>Subtotal</span><span style={{ color: '#1A3409' }}>₹{subtotal.toLocaleString('en-IN')}</span></div>
              {usePoints && <div className="flex justify-between text-sm"><span style={{ color: '#5C8A44' }}>Green Points</span><span style={{ color: '#5C8A44' }}>−₹{pointsDiscount}</span></div>}
              <div className="flex justify-between text-sm"><span style={{ color: '#8B6347' }}>Shipping</span><span style={{ color: shipping === 0 ? '#5C8A44' : '#1A3409' }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: '#C5B89A', color: '#1A3409' }}>
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={onCheckout} className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: '#2D5016', color: '#F5F0E8', fontFamily: 'var(--font-body)' }}>
              Proceed to Checkout <ArrowRight size={15} strokeWidth={2} />
            </button>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs" style={{ color: '#8B6347' }}>
              <span className="flex items-center gap-1"><CreditCard size={11} strokeWidth={1.5} color="#8B6347" /> Secure payments</span>
              <span className="flex items-center gap-1"><RefreshCw size={11} strokeWidth={1.5} color="#8B6347" /> 7-day returns</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/* ─── Checkout Modal ─────────────────────────────────────────────────────── */
function CheckoutModal({
  cart, onClose, onOrderPlaced, onTrackOrder, greenPoints, usePoints,
}: {
  cart: CartItem[]
  onClose: () => void
  onOrderPlaced: (order: Order) => void
  onTrackOrder: (order: Order) => void
  greenPoints: number
  usePoints: boolean
}) {
  const [step, setStep] = useState(1)
  const [payMode, setPayMode] = useState<'upi' | 'card' | 'cod'>('upi')
  const [upiMethod, setUpiMethod] = useState<'qr' | 'id'>('qr')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  const [orderNo] = useState(() => 'REVIVE-' + Math.floor(10000 + Math.random() * 90000))
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)
  const [address, setAddress] = useState({
    name: 'Priya Sharma', phone: '9820567842',
    flat: 'A-204, Greenview Apts', area: 'Andheri West, Mumbai', pin: '400053',
  })
  const { subtotal, discount, shipping, paymentFee, total } = calculateCartTotals(cart, greenPoints, usePoints, payMode)
  const upiIdValid = /^[\w.-]+@[\w.-]+$/.test(upiId.trim())
  const cardValid =
    card.number.replace(/\s/g, '').length === 16 &&
    card.name.trim().length >= 3 &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry) &&
    /^\d{3}$/.test(card.cvv)
  const paymentValid = payMode === 'cod' || (payMode === 'upi' && (upiMethod === 'qr' || upiIdValid)) || (payMode === 'card' && cardValid)

  const continueToPayment = () => {
    const errors: Record<string, string> = {}
    if (!address.name.trim()) errors.name = 'Enter your full name.'
    if (!/^[6-9]\d{9}$/.test(address.phone)) errors.phone = 'Enter a 10-digit phone number starting with 6, 7, 8 or 9.'
    if (!address.flat.trim()) errors.flat = 'Enter your flat or building.'
    if (!address.area.trim()) errors.area = 'Enter your area and city.'
    if (!/^[1-9]\d{5}$/.test(address.pin)) errors.pin = 'Enter a valid 6-digit pincode that does not start with 0.'
    setAddressErrors(errors)
    if (Object.keys(errors).length === 0) setStep(2)
  }

  const payOptions = [
    { id: 'upi' as const,  label: 'UPI Payment',         sub: 'Google Pay, PhonePe, Paytm', Icon: Smartphone  },
    { id: 'card' as const, label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, RuPay',    Icon: CreditCard  },
    { id: 'cod' as const,  label: 'Cash on Delivery',     sub: '₹25 COD fee applies',        Icon: Banknote    },
  ]

  const steps = ['Delivery', 'Payment', 'Confirm']

  const placeOrder = () => {
    const now = new Date()
    const deliveryDate = new Date(now)
    deliveryDate.setDate(deliveryDate.getDate() + 4)
    const orderItems = cart.map(item => ({ ...item }))
    const earned = orderItems.reduce((sum, item) => sum + item.product.points * item.qty, 0)
    const order: Order = {
      id: orderNo,
      date: now.toISOString(),
      items: orderItems,
      totalPaid: total,
      pointsUsed: (discount / 50) * 100,
      pointsEarned: earned,
      address: { ...address },
      paymentMethod: payOptions.find(option => option.id === payMode)?.label ?? 'UPI Payment',
      status: 'Placed',
      statusStep: 0,
      timelineTimes: [
        now.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }),
        null,
        null,
        null,
        null,
      ],
      estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      ...calculateOrderImpact(orderItems),
    }
    setPlacedOrder(order)
    setStep(3)
    onOrderPlaced(order)
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26,52,9,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="fade-in w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#F5F0E8', maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Progress */}
        {step < 3 && (
          <div className="px-8 pt-7 pb-4">
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ backgroundColor: step > i + 1 ? '#5C8A44' : step === i + 1 ? '#2D5016' : '#D4C5A9', color: step >= i + 1 ? 'white' : '#8B6347' }}>
                      {step > i + 1 ? <Check size={11} strokeWidth={2.5} color="white" /> : i + 1}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: step === i + 1 ? '#1A3409' : '#8B6347' }}>{s}</span>
                  </div>
                  {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: step > i + 1 ? '#5C8A44' : '#D4C5A9' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-8 pb-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="fade-in">
              <h3 className="text-xl font-semibold mb-5" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>Delivery Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', key: 'name' },
                  { label: 'Phone Number', key: 'phone' },
                  { label: 'Flat / Building', key: 'flat' },
                  { label: 'Area & City', key: 'area' },
                  { label: 'PIN Code', key: 'pin' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>{field.label}</label>
                    <input
                      value={(address as Record<string, string>)[field.key]}
                      type="text"
                      inputMode={field.key === 'phone' || field.key === 'pin' ? 'numeric' : undefined}
                      maxLength={field.key === 'phone' ? 10 : field.key === 'pin' ? 6 : undefined}
                      onChange={e => {
                        let value = e.target.value
                        if (field.key === 'phone') value = value.replace(/\D/g, '').slice(0, 10)
                        if (field.key === 'pin') value = value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 6)
                        setAddress({ ...address, [field.key]: value })
                        if (addressErrors[field.key]) setAddressErrors(current => ({ ...current, [field.key]: '' }))
                      }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                      style={{ backgroundColor: '#EDE8DC', border: `1.5px solid ${addressErrors[field.key] ? '#A0522D' : '#D4C5A9'}`, color: '#1A3409', fontFamily: 'var(--font-body)' }}
                      onFocus={e => (e.target.style.borderColor = '#5C8A44')}
                      onBlur={e => (e.target.style.borderColor = addressErrors[field.key] ? '#A0522D' : '#D4C5A9')}
                    />
                    {addressErrors[field.key] && <p className="text-xs mt-1.5" style={{ color: '#A0522D' }}>{addressErrors[field.key]}</p>}
                  </div>
                ))}
              </div>
              <button onClick={continueToPayment} className="w-full mt-6 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2" style={{ backgroundColor: '#2D5016', color: '#F5F0E8', fontFamily: 'var(--font-body)' }}>
                Continue to Payment <ArrowRight size={15} strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="fade-in">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>Payment</h3>
              <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#EDE8DC' }}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: '#8B6347' }}>Subtotal</span>
                  <span style={{ color: '#1A3409' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {usePoints && (
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#5C8A44' }}>Green Points discount</span>
                    <span style={{ color: '#5C8A44' }}>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: '#8B6347' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#5C8A44' : '#1A3409' }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: '#8B6347' }}>Cash on delivery fee</span>
                    <span style={{ color: '#1A3409' }}>₹{paymentFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 mt-2 border-t" style={{ borderColor: '#D4C5A9' }}>
                  <span style={{ color: '#1A3409' }}>Order total</span>
                  <span style={{ color: '#1A3409' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {payOptions.map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setPayMode(opt.id)}
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-colors"
                    style={{ borderColor: payMode === opt.id ? '#5C8A44' : '#D4C5A9', backgroundColor: payMode === opt.id ? '#E8F4E0' : '#EDE8DC' }}
                  >
                    <opt.Icon size={20} strokeWidth={1.5} color={payMode === opt.id ? '#2D5016' : '#8B6347'} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>{opt.label}</p>
                      <p className="text-xs" style={{ color: '#8B6347' }}>{opt.sub}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: payMode === opt.id ? '#2D5016' : '#C5B89A' }}>
                      {payMode === opt.id && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#2D5016' }} />}
                    </div>
                  </div>
                ))}
              </div>

              {payMode === 'upi' && (
                <div className="mb-5">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { id: 'qr' as const, label: 'Scan QR', Icon: QrCode },
                      { id: 'id' as const, label: 'UPI ID', Icon: Smartphone },
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setUpiMethod(method.id)}
                        className="py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border-2"
                        style={{ borderColor: upiMethod === method.id ? '#2D5016' : '#D4C5A9', color: '#1A3409', backgroundColor: upiMethod === method.id ? '#D4EBC8' : '#FAF7F2' }}
                      >
                        <method.Icon size={15} strokeWidth={1.5} /> {method.label}
                      </button>
                    ))}
                  </div>
                  {upiMethod === 'qr' ? (
                    <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(`upi://pay?pa=payments@revive&pn=Revive&am=${total}&cu=INR`)}`}
                        alt={`UPI QR code to pay ₹${total.toLocaleString('en-IN')}`}
                        className="w-36 h-36 mx-auto mb-3 rounded-xl border"
                        style={{ borderColor: '#D4C5A9' }}
                      />
                      <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>Scan with any UPI app</p>
                      <p className="text-xs mt-1" style={{ color: '#8B6347' }}>Pay ₹{total.toLocaleString('en-IN')} to Revive</p>
                    </div>
                  ) : (
                    <>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>Enter UPI ID</label>
                      <input
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                        style={{ backgroundColor: '#EDE8DC', border: `1.5px solid ${upiId && !upiIdValid ? '#A0522D' : '#D4C5A9'}`, color: '#1A3409', fontFamily: 'var(--font-body)' }}
                      />
                      <div className="flex items-center gap-1 mt-2">
                        <Lightbulb size={11} strokeWidth={1.5} color="#8B6347" />
                        <p className="text-xs" style={{ color: '#8B6347' }}>e.g. priya@okaxis or 98205xxxxx@paytm</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {payMode === 'card' && (
                <div className="mb-5 rounded-xl p-4 border" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>Card details</p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#5C8A44' }}>
                      <ShieldCheck size={13} strokeWidth={1.5} /> Secure
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>Card number</label>
                      <input
                        type="text"
                        value={card.number}
                        maxLength={19}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
                          setCard({ ...card, number: digits.replace(/(\d{4})(?=\d)/g, '$1 ') })
                        }}
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                        style={{ backgroundColor: '#EDE8DC', borderColor: '#D4C5A9', color: '#1A3409' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>Name on card</label>
                      <input
                        value={card.name}
                        onChange={e => setCard({ ...card, name: e.target.value })}
                        autoComplete="cc-name"
                        placeholder="Priya Sharma"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                        style={{ backgroundColor: '#EDE8DC', borderColor: '#D4C5A9', color: '#1A3409' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>Expiry date</label>
                        <input
                          type="text"
                          value={card.expiry}
                          maxLength={5}
                          onChange={e => {
                            if (card.expiry.endsWith('/') && e.target.value === card.expiry.slice(0, -1)) {
                              setCard({ ...card, expiry: card.expiry.slice(0, -2) })
                              return
                            }
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                            setCard({ ...card, expiry: digits.length >= 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits })
                          }}
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                          style={{ backgroundColor: '#EDE8DC', borderColor: '#D4C5A9', color: '#1A3409' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>CVV</label>
                        <input
                          type="text"
                          value={card.cvv}
                          maxLength={3}
                          onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                          style={{ backgroundColor: '#EDE8DC', borderColor: '#D4C5A9', color: '#1A3409' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl font-semibold text-sm border-2 flex items-center gap-2" style={{ borderColor: '#D4C5A9', color: '#2D5016', fontFamily: 'var(--font-body)' }}>
                  <ArrowLeft size={14} strokeWidth={2} /> Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={!paymentValid}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#2D5016', color: '#F5F0E8', fontFamily: 'var(--font-body)', opacity: paymentValid ? 1 : 0.5 }}
                >
                  {payMode === 'cod' ? 'Confirm Order' : `Pay ₹${total.toLocaleString('en-IN')}`}
                  <ArrowRight size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="fade-in text-center py-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#D4EBC8' }}>
                <CheckCircle size={36} strokeWidth={1.5} color="#2D5016" />
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>Order Placed!</h3>
              <p className="text-sm mb-1" style={{ color: '#5C8A44' }}>Thank you for shopping sustainably, {address.name.split(' ')[0]}!</p>
              <div className="inline-block px-4 py-2 rounded-xl my-4 text-sm font-mono font-bold" style={{ backgroundColor: '#EDE8DC', color: '#2D5016' }}>
                {orderNo}
              </div>
              <p className="text-sm mb-6" style={{ color: '#8B6347' }}>
                Your order will be delivered to {address.area} within 3–5 days. Updates will be sent to {address.phone}.
              </p>
              <div className="rounded-xl p-4 mb-6 text-left" style={{ backgroundColor: '#E8F4E0' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Leaf size={13} strokeWidth={1.5} color="#2D5016" />
                  <p className="text-xs font-semibold" style={{ color: '#2D5016' }}>You earned with this order</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#5C8A44' }}>Green Points</span>
                  <span className="text-sm font-bold" style={{ color: '#1A3409' }}>+{placedOrder?.pointsEarned ?? 0} pts</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Lightbulb size={11} strokeWidth={1.5} color="#5C8A44" />
                  <p className="text-xs" style={{ color: '#5C8A44' }}>Schedule a recycling pickup to earn even more!</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => placedOrder && onTrackOrder(placedOrder)}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm"
                  style={{ backgroundColor: '#2D5016', color: '#F5F0E8', fontFamily: 'var(--font-body)' }}
                >
                  Track Order
                </button>
                <button onClick={onClose} className="w-full py-3.5 rounded-xl font-semibold text-sm border-2" style={{ borderColor: '#2D5016', color: '#2D5016', fontFamily: 'var(--font-body)' }}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Recycle Modal ──────────────────────────────────────────────────────── */
function RecycleModal({ onClose, onScheduled }: { onClose: () => void; onScheduled: () => void }) {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [slot, setSlot] = useState('')

  const slots = [
    { label: 'Tomorrow, 9–11 AM', sub: 'Doorstep pickup · Free service' },
    { label: 'Tomorrow, 2–4 PM',  sub: 'Doorstep pickup · Free service' },
    { label: 'Day After, 9–11 AM', sub: 'Doorstep pickup · Free service' },
    { label: 'Day After, 4–6 PM', sub: 'Doorstep pickup · Free service' },
  ]

  const totalPts = WASTE_TYPES.filter(w => selected.includes(w.id)).reduce((s, w) => s + w.pts, 0)
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26,52,9,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="fade-in w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="px-7 pt-7 pb-5 border-b flex items-center justify-between" style={{ borderColor: '#D4C5A9' }}>
          <div>
            <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>Schedule Recycling Pickup</h3>
            <p className="text-xs mt-1" style={{ color: '#8B6347' }}>Earn Green Points for every kg recycled</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EDE8DC' }}>
            <X size={15} strokeWidth={1.5} color="#2D5016" />
          </button>
        </div>

        <div className="p-7">
          {step === 1 && (
            <div className="fade-in">
              <p className="text-sm font-semibold mb-4" style={{ color: '#2D5016' }}>What are you recycling?</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {WASTE_TYPES.map(w => (
                  <div
                    key={w.id}
                    onClick={() => toggle(w.id)}
                    className="flex items-center gap-2.5 p-3 rounded-xl cursor-pointer border-2 transition-colors"
                    style={{ borderColor: selected.includes(w.id) ? '#5C8A44' : '#D4C5A9', backgroundColor: selected.includes(w.id) ? '#E8F4E0' : '#EDE8DC' }}
                  >
                    <w.Icon size={18} strokeWidth={1.5} color={selected.includes(w.id) ? '#2D5016' : '#8B6347'} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#1A3409' }}>{w.label}</p>
                      <p className="text-xs" style={{ color: '#5C8A44' }}>+{w.pts} pts/kg</p>
                    </div>
                  </div>
                ))}
              </div>
              {selected.length > 0 && (
                <div className="rounded-xl p-3 mb-4 flex items-center gap-2" style={{ backgroundColor: '#D4EBC8' }}>
                  <Leaf size={14} strokeWidth={1.5} color="#2D5016" />
                  <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>
                    Estimated: {totalPts}+ Green Points per kg
                  </p>
                </div>
              )}
              <button
                onClick={() => setStep(2)}
                disabled={selected.length === 0}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity"
                style={{ backgroundColor: '#2D5016', color: '#F5F0E8', opacity: selected.length === 0 ? 0.5 : 1, fontFamily: 'var(--font-body)' }}
              >
                Select Pickup Time <ArrowRight size={15} strokeWidth={2} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <p className="text-sm font-semibold mb-4" style={{ color: '#2D5016' }}>Choose a pickup slot</p>
              <div className="flex items-center gap-1.5 mb-4">
                <MapPin size={13} strokeWidth={1.5} color="#8B6347" />
                <span className="text-xs" style={{ color: '#8B6347' }}>Andheri West, Mumbai 400053</span>
              </div>
              <div className="space-y-2 mb-6">
                {slots.map(s => (
                  <div
                    key={s.label}
                    onClick={() => setSlot(s.label)}
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-colors"
                    style={{ borderColor: slot === s.label ? '#5C8A44' : '#D4C5A9', backgroundColor: slot === s.label ? '#E8F4E0' : '#EDE8DC' }}
                  >
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: slot === s.label ? '#2D5016' : '#C5B89A' }}>
                      {slot === s.label && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#2D5016' }} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>{s.label}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} strokeWidth={1.5} color="#8B6347" />
                        <p className="text-xs" style={{ color: '#8B6347' }}>{s.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl font-semibold text-sm border-2 flex items-center gap-2" style={{ borderColor: '#D4C5A9', color: '#2D5016' }}>
                  <ArrowLeft size={14} strokeWidth={2} /> Back
                </button>
                <button
                  onClick={() => { onScheduled(); onClose() }}
                  disabled={!slot}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#2D5016', color: '#F5F0E8', opacity: !slot ? 0.5 : 1, fontFamily: 'var(--font-body)' }}
                >
                  Confirm Pickup <Check size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Login ─────────────────────────────────────────────────────────────── */
function LoginPage({ onBack, onLogin, onForgotPassword }: { onBack: () => void; onLogin: (name: string, isNewAccount: boolean) => void; onForgotPassword: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')

  const submit = () => {
    if (mode === 'signup' && name.trim().length < 2) {
      setError('Enter your full name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (mode === 'signup' && !acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }
    setError('')
    onLogin(mode === 'signup' ? name.trim().split(' ')[0] : email.split('@')[0].split(/[._-]/)[0] || 'Member', mode === 'signup')
  }

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode)
    setError('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <button onClick={onBack} className="text-sm font-medium flex items-center gap-1 mb-6" style={{ color: '#5C8A44' }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to shop
      </button>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] rounded-3xl overflow-hidden border shadow-sm" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
        <div className="p-7 sm:p-12 flex flex-col justify-center">
          <div className="w-11 h-11 rounded-full flex items-center justify-center mb-7" style={{ backgroundColor: '#D4EBC8' }}>
            <Leaf size={21} strokeWidth={1.5} color="#2D5016" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#5C8A44' }}>
            {mode === 'login' ? 'Welcome back' : 'Join Revive'}
          </p>
          <h1 className="text-4xl mb-3" style={{ color: '#1A3409' }}>
            {mode === 'login' ? 'Continue your green journey' : 'Create your account'}
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#8B6347' }}>
            {mode === 'login'
              ? 'Sign in to view your orders, manage Green Points, and schedule recycling pickups.'
              : 'Start earning Green Points, tracking your impact, and making everyday choices count.'}
          </p>

          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="fade-in">
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>Full name</label>
                <div className="relative">
                  <User size={16} strokeWidth={1.5} color="#8B6347" className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Priya Sharma"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C5A9', color: '#1A3409' }}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>Email address</label>
              <div className="relative">
                <Mail size={16} strokeWidth={1.5} color="#8B6347" className="absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none border"
                  style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C5A9', color: '#1A3409' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold" style={{ color: '#5C8A44' }}>Password</label>
                {mode === 'login' && <button onClick={onForgotPassword} className="text-xs font-semibold" style={{ color: '#5C8A44' }}>Forgot password?</button>}
              </div>
              <div className="relative">
                <Lock size={16} strokeWidth={1.5} color="#8B6347" className="absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none border"
                  style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C5A9', color: '#1A3409' }}
                />
                <button
                  onClick={() => setShowPassword(value => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} color="#8B6347" /> : <Eye size={16} strokeWidth={1.5} color="#8B6347" />}
                </button>
              </div>
            </div>
            {mode === 'signup' && (
              <div className="fade-in">
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#5C8A44' }}>Confirm password</label>
                <div className="relative">
                  <Lock size={16} strokeWidth={1.5} color="#8B6347" className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none border"
                    style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C5A9', color: '#1A3409' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => mode === 'login' ? setRememberMe(value => !value) : setAcceptTerms(value => !value)}
              className="flex items-start gap-2 text-xs text-left"
              style={{ color: '#4A5C3C' }}
            >
              <span
                className="w-4 h-4 mt-px rounded border flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: (mode === 'login' ? rememberMe : acceptTerms) ? '#2D5016' : 'transparent', borderColor: '#5C8A44' }}
              >
                {(mode === 'login' ? rememberMe : acceptTerms) && <Check size={10} strokeWidth={2.5} color="white" />}
              </span>
              {mode === 'login' ? 'Keep me signed in' : 'I agree to the Terms of Service and Privacy Policy'}
            </button>
            <span className="flex items-center gap-1 text-xs" style={{ color: '#8B6347' }}>
              <ShieldCheck size={12} strokeWidth={1.5} /> Secure {mode === 'login' ? 'login' : 'sign up'}
            </span>
          </div>

          {error && <p className="text-xs mt-4" style={{ color: '#A0522D' }}>{error}</p>}
          <button onClick={submit} className="w-full mt-5 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2" style={{ backgroundColor: '#2D5016', color: '#F5F0E8' }}>
            {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={15} strokeWidth={2} />
          </button>
          <p className="text-xs text-center mt-5" style={{ color: '#8B6347' }}>
            {mode === 'login' ? 'New to Revive?' : 'Already have an account?'}{' '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="font-semibold underline underline-offset-4"
              style={{ color: '#2D5016' }}
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="hidden lg:block relative min-h-[620px]">
          <img
            src="https://images.unsplash.com/photo-1600340053706-32d1278206ef?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=1200"
            alt="Sunlight filtering through a green forest"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,52,9,0.85), rgba(26,52,9,0.08))' }} />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <Leaf size={28} strokeWidth={1.5} color="#D4EBC8" className="mb-4" />
            <blockquote className="text-2xl leading-snug mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Every thoughtful choice gives the planet a little more room to breathe.
            </blockquote>
            <p className="text-sm" style={{ color: '#D4EBC8' }}>Join 12,000+ conscious shoppers across Mumbai</p>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ─── Orders ─────────────────────────────────────────────────────────────── */
function OrdersPage({
  orders,
  onBack,
  onOpenOrder,
  onStartShopping,
}: {
  orders: Order[]
  onBack: () => void
  onOpenOrder: (order: Order) => void
  onStartShopping: () => void
}) {
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: '#5C8A44' }}>
          <ArrowLeft size={14} strokeWidth={1.5} /> Back
        </button>
        <h2 className="text-3xl" style={{ color: '#1A3409' }}>My Orders</h2>
      </div>

      {sortedOrders.length === 0 ? (
        <div className="rounded-2xl border p-8 sm:p-12 text-center" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
          <ShoppingBag size={48} strokeWidth={1} color="#8B6347" className="mx-auto mb-4" />
          <h3 className="text-2xl mb-2" style={{ color: '#1A3409' }}>No orders yet</h3>
          <p className="text-sm mb-6" style={{ color: '#8B6347' }}>Your sustainable finds will appear here after checkout.</p>
          <button onClick={onStartShopping} className="px-7 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#2D5016', color: '#F5F0E8' }}>
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map(order => (
            <button
              key={order.id}
              onClick={() => onOpenOrder(order)}
              className="w-full rounded-2xl border p-5 sm:p-6 text-left transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#8B6347' }}>Order {order.id}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>
                    {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span
                  className="self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: order.status === 'Delivered' ? '#D4EBC8' : '#EDE8DC', color: '#2D5016' }}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-white" style={{ backgroundColor: '#EDE8DC' }}>
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1" style={{ color: '#8B6347' }}>{order.items.reduce((sum, item) => sum + item.qty, 0)} items</p>
                  <p className="text-lg font-bold" style={{ color: '#1A3409' }}>₹{order.totalPaid.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  )
}

function TrackOrderPage({
  order,
  onBack,
  onNeedHelp,
  onReorder,
}: {
  order: Order
  onBack: () => void
  onNeedHelp: () => void
  onReorder: (order: Order) => void
}) {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: '#5C8A44' }}>
          <ArrowLeft size={14} strokeWidth={1.5} /> My Orders
        </button>
        <h2 className="text-2xl sm:text-3xl" style={{ color: '#1A3409' }}>Track Order</h2>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ backgroundColor: '#1A3409' }}>
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#9CC982' }}>{order.id}</p>
          <h3 className="text-2xl mb-1" style={{ color: '#F5F0E8' }}>{order.status}</h3>
          <p className="text-sm" style={{ color: '#A8C496' }}>Estimated delivery: {order.estimatedDelivery}</p>
        </div>
        <Truck size={42} strokeWidth={1.2} color="#9CC982" />
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5">
        <div className="space-y-5">
          <section className="rounded-2xl border p-6 sm:p-8" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
            <h3 className="text-xl mb-7" style={{ color: '#1A3409' }}>Delivery progress</h3>
            <div>
              {ORDER_STEPS.map((label, index) => {
                const isComplete = index <= order.statusStep
                const isCurrent = index === order.statusStep
                return (
                  <div key={label} className="relative flex gap-4 pb-8 last:pb-0">
                    {index < ORDER_STEPS.length - 1 && (
                      <div className="absolute left-[15px] top-8 bottom-0 w-px" style={{ backgroundColor: index < order.statusStep ? '#5C8A44' : '#D4C5A9' }} />
                    )}
                    <div
                      className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                      style={{
                        backgroundColor: isComplete ? '#2D5016' : '#F5F0E8',
                        borderColor: isCurrent ? '#7BAF60' : isComplete ? '#2D5016' : '#D4C5A9',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(123,175,96,0.18)' : 'none',
                      }}
                    >
                      {isComplete ? <Check size={14} strokeWidth={2} color="white" /> : <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4C5A9' }} />}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-semibold" style={{ color: isCurrent ? '#2D5016' : isComplete ? '#1A3409' : '#8B6347' }}>{label}</p>
                      {order.timelineTimes[index] && <p className="text-xs mt-1" style={{ color: '#8B6347' }}>{order.timelineTimes[index]}</p>}
                      {isCurrent && index < ORDER_STEPS.length - 1 && <p className="text-xs mt-1" style={{ color: '#5C8A44' }}>Your order is currently at this step</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
            <div className="px-6 py-5 border-b" style={{ borderColor: '#EDE8DC' }}>
              <h3 className="text-xl" style={{ color: '#1A3409' }}>Order items</h3>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map(item => (
                <div key={item.product.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#EDE8DC' }}>
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug" style={{ color: '#1A3409' }}>{item.product.name}</p>
                    <p className="text-xs mt-1" style={{ color: '#8B6347' }}>Qty {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#2D5016' }}>₹{(item.product.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              ))}
              <div className="pt-4 border-t space-y-2 text-sm" style={{ borderColor: '#EDE8DC' }}>
                <div className="flex justify-between"><span style={{ color: '#8B6347' }}>Points used</span><span style={{ color: '#1A3409' }}>{order.pointsUsed} pts</span></div>
                <div className="flex justify-between"><span style={{ color: '#8B6347' }}>Points earned</span><span style={{ color: '#5C8A44' }}>+{order.pointsEarned} pts</span></div>
                <div className="flex justify-between pt-2 font-bold"><span style={{ color: '#1A3409' }}>Total paid</span><span style={{ color: '#1A3409' }}>₹{order.totalPaid.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border p-6" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} strokeWidth={1.5} color="#5C8A44" />
              <h3 className="text-lg" style={{ color: '#1A3409' }}>Delivery details</h3>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>{order.address.name}</p>
            <p className="text-sm leading-relaxed mt-1" style={{ color: '#8B6347' }}>
              {order.address.flat}<br />{order.address.area} — {order.address.pin}<br />{order.address.phone}
            </p>
            <div className="flex items-center gap-2 mt-5 pt-5 border-t" style={{ borderColor: '#EDE8DC' }}>
              <CreditCard size={17} strokeWidth={1.5} color="#5C8A44" />
              <div>
                <p className="text-xs" style={{ color: '#8B6347' }}>Payment method</p>
                <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>{order.paymentMethod}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl p-6" style={{ backgroundColor: '#D4EBC8' }}>
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={18} strokeWidth={1.5} color="#2D5016" />
              <h3 className="text-lg" style={{ color: '#1A3409' }}>Your order's impact</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}>
                <Waves size={20} strokeWidth={1.5} color="#2D5016" className="mb-2" />
                <p className="text-xl font-bold" style={{ color: '#1A3409' }}>{order.plasticAvoidedKg} kg</p>
                <p className="text-xs" style={{ color: '#5C8A44' }}>Plastic avoided</p>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}>
                <Wind size={20} strokeWidth={1.5} color="#2D5016" className="mb-2" />
                <p className="text-xl font-bold" style={{ color: '#1A3409' }}>{order.co2SavedKg} kg</p>
                <p className="text-xs" style={{ color: '#5C8A44' }}>CO₂ saved</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onNeedHelp} className="py-3.5 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-2" style={{ borderColor: '#2D5016', color: '#2D5016' }}>
              <MessageCircle size={16} strokeWidth={1.5} /> Need help?
            </button>
            <button onClick={() => onReorder(order)} className="py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: '#2D5016', color: '#F5F0E8' }}>
              <RefreshCw size={16} strokeWidth={1.5} /> Reorder
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

type ChatMessage = {
  id: number
  sender: 'support' | 'user'
  text: string
}

function SupportChatPage({ onBack }: { onBack: () => void }) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'support', text: 'Welcome to Revive Support. How can we help you today?' },
  ])
  const [waiting, setWaiting] = useState(false)
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = messageListRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, waiting])

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    setMessages(current => [...current, { id: Date.now(), sender: 'user', text }])
    setDraft('')
    setWaiting(true)
    window.setTimeout(() => {
      const query = text.toLowerCase()
      const reply = query.includes('order')
        ? 'You can track your order in My Orders 📦'
        : query.includes('refund') || query.includes('return')
          ? 'Refunds are processed within 5–7 working days after we receive the item.'
          : query.includes('delivery')
            ? 'Orders are usually delivered within 3–5 days.'
            : query.includes('payment')
              ? 'We accept cards, UPI and cash on delivery.'
              : 'Thanks! Our team will get back to you shortly.'
      setMessages(current => [...current, { id: Date.now() + 1, sender: 'support', text: reply }])
      setWaiting(false)
    }, 1000)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="rounded-2xl border overflow-hidden flex flex-col support-chat" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
        <div className="px-4 sm:px-6 py-4 border-b flex items-center gap-3" style={{ backgroundColor: '#1A3409', borderColor: '#2D5016' }}>
          <button onClick={onBack} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,235,200,0.12)' }} aria-label="Back to order">
            <ArrowLeft size={19} strokeWidth={1.5} color="#D4EBC8" />
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4EBC8' }}>
            <MessageCircle size={19} strokeWidth={1.5} color="#2D5016" />
          </div>
          <div>
            <h2 className="text-xl" style={{ color: '#F5F0E8' }}>Revive Support</h2>
            <p className="text-xs" style={{ color: '#9CC982' }}>Typically replies instantly</p>
          </div>
        </div>

        <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{
                  backgroundColor: message.sender === 'user' ? '#2D5016' : '#EDE8DC',
                  color: message.sender === 'user' ? '#F5F0E8' : '#1A3409',
                  borderBottomRightRadius: message.sender === 'user' ? 4 : undefined,
                  borderBottomLeftRadius: message.sender === 'support' ? 4 : undefined,
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
          {waiting && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: '#EDE8DC', color: '#8B6347' }}>Revive Support is typing…</div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t flex gap-2 sm:gap-3" style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C5A9' }}>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message"
            className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm outline-none border"
            style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9', color: '#1A3409' }}
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="min-w-12 px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: '#2D5016', color: '#F5F0E8', opacity: draft.trim() ? 1 : 0.5 }}
          >
            <Send size={16} strokeWidth={1.5} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </main>
  )
}

function AboutPage({ onShop, onRecycle }: { onShop: () => void; onRecycle: () => void }) {
  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden" style={{ backgroundColor: '#1A3409' }}>
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: '#9CC982' }}>About Revive</p>
            <h1 className="text-4xl sm:text-5xl leading-tight mb-5" style={{ color: '#F5F0E8' }}>
              Making low-waste living feel natural
            </h1>
            <p className="text-sm sm:text-base leading-relaxed mb-7" style={{ color: '#A8C496' }}>
              Revive is a Mumbai-born circular commerce platform connecting thoughtful products, responsible makers, and doorstep recycling in one simple experience. We help households reduce waste without asking them to compromise on quality, beauty, or convenience.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={onShop} className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: '#D4EBC8', color: '#1A3409' }}>
                Explore products <ArrowRight size={15} strokeWidth={2} />
              </button>
              <button onClick={onRecycle} className="px-6 py-3 rounded-xl text-sm font-semibold border flex items-center gap-2" style={{ borderColor: '#5C8A44', color: '#D4EBC8' }}>
                <Recycle size={15} strokeWidth={1.5} /> Schedule a pickup
              </button>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-[560px]">
            <img
              src="https://images.unsplash.com/photo-1526461591544-198d2190f270?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=1100"
              alt="Local Indian artisans working beside handmade clay pots"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#5C8A44' }}>Why we exist</p>
        <h2 className="text-3xl sm:text-4xl mb-6" style={{ color: '#1A3409' }}>Waste is a design problem, not an inevitability</h2>
        <p className="text-base leading-relaxed max-w-3xl mx-auto" style={{ color: '#4A5C3C' }}>
          Mumbai generates thousands of tonnes of solid waste every day, while people who want better alternatives often face confusing claims and inconvenient systems. Revive closes that gap. We carefully assess materials, packaging, durability, and end-of-life options, then pair conscious shopping with a rewards-led recycling service that keeps useful materials in circulation.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              Icon: Leaf,
              title: 'Products with proof',
              text: 'We prioritise durable, low-impact materials and clearly explain what each product saves compared with conventional alternatives.',
            },
            {
              Icon: Users,
              title: 'Local livelihoods',
              text: 'We work with independent makers, women-led groups, and small Indian businesses to bring responsible production closer to home.',
            },
            {
              Icon: Recycle,
              title: 'Circular by design',
              text: 'Our doorstep pickups turn sorted household waste into Green Points, helping materials return to use instead of going to landfill.',
            },
          ].map(value => (
            <article key={value.title} className="rounded-2xl p-7 border" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#D4EBC8' }}>
                <value.Icon size={21} strokeWidth={1.5} color="#2D5016" />
              </div>
              <h3 className="text-xl mb-3" style={{ color: '#1A3409' }}>{value.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#8B6347' }}>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-14 items-center rounded-3xl p-8 sm:p-12" style={{ backgroundColor: '#EDE8DC' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#5C8A44' }}>Our promise</p>
            <h2 className="text-3xl mb-4" style={{ color: '#1A3409' }}>Progress you can see</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#4A5C3C' }}>
              We believe sustainability should be measurable. That is why Revive shows environmental impact at the product and order level, uses plastic-conscious packaging, and rewards verified recycling by weight.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { value: '100%', label: 'plastic-conscious packaging' },
              { value: '6', label: 'waste streams rewarded' },
              { value: 'Mumbai', label: 'our first community' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl p-5" style={{ backgroundColor: '#F5F0E8' }}>
                <p className="text-2xl mb-1" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>{stat.value}</p>
                <p className="text-xs leading-snug" style={{ color: '#8B6347' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [recycleOpen, setRecycleOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [greenPoints, setGreenPoints] = useState(120)
  const [usePoints, setUsePoints] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [activeNav, setActiveNav] = useState('shop')
  const [greenPointsView, setGreenPointsView] = useState(false)
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS)
  const [ordersView, setOrdersView] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loginView, setLoginView] = useState(false)
  const [aboutView, setAboutView] = useState(false)
  const [supportChatView, setSupportChatView] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })
    showToast(`${product.name} added to cart`)
    setIsCartOpen(true)
  }

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.product.id !== id))
    else setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))
  }

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.product.id !== id))

  const handleOrderPlaced = (order: Order) => {
    setOrders(prev => [order, ...prev])
    setGreenPoints(p => p - order.pointsUsed + order.pointsEarned)
    setCart([])
    setUsePoints(false)
    setIsCartOpen(false)
  }

  const openOrders = () => {
    setOrdersView(true)
    setSelectedOrder(null)
    setGreenPointsView(false)
    setLoginView(false)
    setAboutView(false)
    setSupportChatView(false)
    setActiveNav('orders')
    setMobileMenuOpen(false)
  }

  const openShop = () => {
    setOrdersView(false)
    setSelectedOrder(null)
    setGreenPointsView(false)
    setLoginView(false)
    setAboutView(false)
    setSupportChatView(false)
    setActiveNav('shop')
    setMobileMenuOpen(false)
  }

  const reorder = (order: Order) => {
    setCart(prev => {
      const next = [...prev]
      order.items.forEach(orderItem => {
        const existingIndex = next.findIndex(item => item.product.id === orderItem.product.id)
        if (existingIndex >= 0) {
          next[existingIndex] = { ...next[existingIndex], qty: next[existingIndex].qty + orderItem.qty }
        } else {
          next.push({ ...orderItem })
        }
      })
      return next
    })
    showToast('Order items added to your cart')
    setIsCartOpen(true)
  }

  const openAbout = () => {
    setAboutView(true)
    setLoginView(false)
    setOrdersView(false)
    setSelectedOrder(null)
    setGreenPointsView(false)
    setSupportChatView(false)
    setActiveNav('about')
    setMobileMenuOpen(false)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setCustomerName('')
    openShop()
    showToast('You have been logged out')
  }

  const handleScheduled = () => {
    setGreenPoints(p => p + 45)
    showToast('Pickup scheduled! You earned +45 Green Points')
  }

  const openImpact = () => {
    openShop()
    setActiveNav('impact')
    window.setTimeout(() => document.getElementById('environmental-promise')?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  const openProfile = () => {
    if (isLoggedIn) openOrders()
    else {
      setLoginView(true)
      setAboutView(false)
      setOrdersView(false)
      setSelectedOrder(null)
      setGreenPointsView(false)
      setSupportChatView(false)
      setActiveNav('login')
    }
  }

  const handleFooterLink = (link: string) => {
    if (link === 'Schedule Pickup') {
      setRecycleOpen(true)
      return
    }
    if (['How it Works', 'Earn Points', 'Redeem Points', 'Points History', 'Green Leaderboard'].includes(link)) {
      setGreenPointsView(true)
      setOrdersView(false)
      setSelectedOrder(null)
      setAboutView(false)
      setActiveNav('rewards')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (['About Revive', 'Our Mission', 'Sustainability Report'].includes(link)) {
      openAbout()
      return
    }
    if (['All Products', 'Reusable Products', 'Upcycled Goods', 'Plastic-Free', 'Sustainable Living', 'New Arrivals'].includes(link)) {
      const categoryByLink: Record<string, string> = {
        'Reusable Products': 'Reusable', 'Upcycled Goods': 'Upcycled', 'Plastic-Free': 'Plastic-Free', 'Sustainable Living': 'Sustainable',
      }
      setActiveCategory(categoryByLink[link] ?? 'all')
      openShop()
      window.setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 0)
      return
    }
    showToast(`${link} information will be available soon`)
  }

  const filteredProducts = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory)

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen mobile-app-shell" style={{ backgroundColor: '#F5F0E8', fontFamily: 'var(--font-body)' }}>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 z-[60] -translate-x-1/2 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: '#2D5016', color: '#F5F0E8' }}>
          <Leaf size={14} strokeWidth={1.5} color="#9CC982" />
          {toastMsg}
        </div>
      )}

      {/* Announcement Bar */}
      <div className="overflow-hidden py-2.5 text-xs font-semibold tracking-wide" style={{ backgroundColor: '#1A3409', color: '#D4EBC8' }}>
        <div className="announcement-scroll inline-flex gap-16 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-16">
              <span className="inline-flex items-center gap-2"><Leaf size={12} strokeWidth={1.5} color="#7BAF60" /> Free doorstep recycling pickup on orders above ₹499</span>
              <span className="inline-flex items-center gap-2"><Recycle size={12} strokeWidth={1.5} color="#7BAF60" /> Earn 2× Green Points this week on all Plastic-Free products</span>
              <span className="inline-flex items-center gap-2"><Truck size={12} strokeWidth={1.5} color="#7BAF60" /> Next-day delivery across Mumbai · Andheri · Bandra · Thane</span>
              <span className="inline-flex items-center gap-2"><Sprout size={12} strokeWidth={1.5} color="#7BAF60" /> Every purchase plants a tree in Maharashtra forests</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="hidden md:block sticky top-0 z-30 border-b" style={{ backgroundColor: '#F5F0E8', borderColor: '#D4C5A9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={openShop}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2D5016' }}>
                <Leaf size={16} strokeWidth={1.5} color="#D4EBC8" />
              </div>
              <span className="text-xl font-bold" style={{ color: '#1A3409', letterSpacing: '-0.02em' }}>Revive</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7">
              {[
                { id: 'shop', label: 'Shop' },
                { id: 'orders', label: 'My Orders' },
                { id: 'impact', label: 'Our Impact' },
                { id: 'rewards', label: 'Green Points' },
                { id: 'about', label: 'About' },
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.id === 'orders') {
                      openOrders()
                    } else if (link.id === 'about') {
                      openAbout()
                    } else if (link.id === 'impact') {
                      openImpact()
                    } else {
                      setActiveNav(link.id)
                      setOrdersView(false)
                      setSelectedOrder(null)
                      setGreenPointsView(link.id === 'rewards')
                      setLoginView(false)
                      setAboutView(false)
                    }
                  }}
                  className="text-sm font-medium pb-0.5 border-b-2 transition-colors"
                  style={{ color: activeNav === link.id ? '#1A3409' : '#8B6347', borderColor: activeNav === link.id ? '#2D5016' : 'transparent', background: 'none' }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setOrdersView(false); setSelectedOrder(null); setGreenPointsView(true); setLoginView(false); setAboutView(false); setActiveNav('rewards') }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105"
                style={{ backgroundColor: '#D4EBC8', color: '#1A3409' }}
              >
                <Leaf size={12} strokeWidth={1.5} color="#2D5016" />
                {greenPoints} pts
              </button>

              <button
                onClick={() => setRecycleOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors"
                style={{ backgroundColor: '#2D5016', color: '#D4EBC8', fontFamily: 'var(--font-body)' }}
              >
                <Recycle size={13} strokeWidth={1.5} color="#D4EBC8" />
                Recycle &amp; Earn
              </button>

              <button
                onClick={() => {
                  if (isLoggedIn) {
                    openOrders()
                  } else {
                    setLoginView(true)
                    setAboutView(false)
                    setOrdersView(false)
                    setSelectedOrder(null)
                    setGreenPointsView(false)
                    setActiveNav('login')
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border"
                style={{ borderColor: '#D4C5A9', color: '#1A3409' }}
              >
                <User size={14} strokeWidth={1.5} />
                {isLoggedIn ? customerName : 'Log in'}
              </button>

              {isLoggedIn && (
                <button
                  onClick={logout}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold"
                  style={{ color: '#8B6347' }}
                >
                  <LogOut size={14} strokeWidth={1.5} /> Log out
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ color: '#1A3409' }}
              >
                <ShoppingBag size={22} strokeWidth={1.5} color="#1A3409" />
                {cartCount > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#5C8A44', color: 'white' }}>
                    {cartCount}
                  </div>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 rounded-full flex items-center justify-center" style={{ color: '#1A3409' }}>
                {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 border-t" style={{ borderColor: '#D4C5A9' }}>
              <div className="flex flex-col gap-2">
                <button onClick={() => setRecycleOpen(true)} className="w-full text-left py-2.5 px-2 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ color: '#2D5016' }}>
                  <Recycle size={15} strokeWidth={1.5} color="#2D5016" /> Recycle &amp; Earn
                </button>
                <button onClick={openOrders} className="w-full text-left py-2.5 px-2 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ color: '#2D5016' }}>
                  <Package size={15} strokeWidth={1.5} color="#2D5016" /> My Orders
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (isLoggedIn) openOrders()
                    else {
                      setLoginView(true)
                      setAboutView(false)
                      setOrdersView(false)
                      setSelectedOrder(null)
                      setGreenPointsView(false)
                      setActiveNav('login')
                    }
                  }}
                  className="w-full text-left py-2.5 px-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                  style={{ color: '#2D5016' }}
                >
                  <User size={15} strokeWidth={1.5} color="#2D5016" /> {isLoggedIn ? customerName : 'Log in'}
                </button>
                {isLoggedIn && (
                  <button onClick={logout} className="w-full text-left py-2.5 px-2 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ color: '#8B6347' }}>
                    <LogOut size={15} strokeWidth={1.5} color="#8B6347" /> Log out
                  </button>
                )}
                <button onClick={() => { setOrdersView(false); setSelectedOrder(null); setGreenPointsView(true); setLoginView(false); setAboutView(false); setActiveNav('rewards'); setMobileMenuOpen(false) }} className="w-full text-left py-2.5 px-2 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ color: '#2D5016' }}>
                  <Leaf size={15} strokeWidth={1.5} color="#2D5016" /> Green Points: {greenPoints} pts
                </button>
                <button onClick={() => { openImpact(); setMobileMenuOpen(false) }} className="w-full text-left py-2.5 px-2 rounded-lg text-sm flex items-center gap-2" style={{ color: '#8B6347' }}>
                  <Globe size={15} strokeWidth={1.5} color="#8B6347" /> Our Impact
                </button>
                <button onClick={openAbout} className="w-full text-left py-2.5 px-2 rounded-lg text-sm flex items-center gap-2" style={{ color: '#8B6347' }}>
                  <Leaf size={15} strokeWidth={1.5} color="#8B6347" /> About Revive
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Green Points Dashboard ──────────────────────────────────────── */}
      {loginView ? (
        <LoginPage
          onBack={openShop}
          onForgotPassword={() => showToast('Password reset instructions have been sent to your email')}
          onLogin={(name, isNewAccount) => {
            const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
            setCustomerName(formattedName)
            setIsLoggedIn(true)
            openShop()
            showToast(isNewAccount ? `Account created! Welcome, ${formattedName}` : `Welcome back, ${formattedName}`)
          }}
        />
      ) : supportChatView ? (
        <SupportChatPage onBack={() => setSupportChatView(false)} />
      ) : aboutView ? (
        <AboutPage onShop={openShop} onRecycle={() => setRecycleOpen(true)} />
      ) : selectedOrder ? (
        <TrackOrderPage
          order={selectedOrder}
          onBack={() => { setSelectedOrder(null); setOrdersView(true) }}
          onNeedHelp={() => setSupportChatView(true)}
          onReorder={reorder}
        />
      ) : ordersView ? (
        <OrdersPage
          orders={orders}
          onBack={openShop}
          onOpenOrder={setSelectedOrder}
          onStartShopping={openShop}
        />
      ) : greenPointsView ? (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => setGreenPointsView(false)} className="text-sm font-medium flex items-center gap-1" style={{ color: '#5C8A44' }}>
              <ArrowLeft size={14} strokeWidth={1.5} color="#5C8A44" /> Back
            </button>
            <h2 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>Your Green Dashboard</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {[
              { label: 'Green Points Balance', value: `${greenPoints}`, sub: '100 pts = ₹50 off your order', bg: '#2D5016', fg: '#D4EBC8', Icon: Leaf },
              { label: 'Waste Recycled', value: '8.4 kg', sub: 'Through 3 pickups', bg: '#EDE8DC', fg: '#1A3409', Icon: Recycle },
              { label: 'CO₂ Saved', value: '12.6 kg', sub: 'Equivalent to 1 tree', bg: '#EDE8DC', fg: '#1A3409', Icon: Wind },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl p-6" style={{ backgroundColor: stat.bg }}>
                <stat.Icon size={28} strokeWidth={1.5} color={stat.fg} className="mb-2" />
                <div className="text-2xl font-bold mb-1" style={{ color: stat.fg }}>{stat.value}</div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: stat.fg, opacity: 0.9 }}>{stat.label}</div>
                <div className="text-xs" style={{ color: stat.fg, opacity: 0.7 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>Points History</h3>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#D4C5A9' }}>
              {[
                { date: '28 Sep 2026', desc: 'Plastic & Paper Recycling Pickup', type: 'earn', pts: '+60 pts', detail: '4.2 kg plastic, 1.8 kg paper' },
                { date: '24 Sep 2026', desc: 'Order #REVIVE-28471 — Bamboo Cutlery', type: 'earn', pts: '+30 pts', detail: 'Shopping reward' },
                { date: '20 Sep 2026', desc: 'Redeemed at checkout', type: 'redeem', pts: '−100 pts', detail: '100 pts = ₹50 off · Saved ₹50' },
                { date: '15 Sep 2026', desc: 'E-Waste & Clothes Pickup', type: 'earn', pts: '+80 pts', detail: '2.1 kg e-waste, 1.4 kg clothes' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b last:border-0" style={{ borderColor: '#EDE8DC', backgroundColor: i % 2 === 0 ? '#F5F0E8' : '#FAF7F2' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.type === 'earn' ? '#D4EBC8' : '#F2EDE4' }}>
                    {item.type === 'earn'
                      ? <Leaf size={18} strokeWidth={1.5} color="#2D5016" />
                      : <ShoppingBag size={18} strokeWidth={1.5} color="#8B6347" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>{item.desc}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#8B6347' }}>{item.detail} · {item.date}</p>
                  </div>
                  <div className="font-bold text-sm" style={{ color: item.type === 'earn' ? '#2D5016' : '#8B6347' }}>{item.pts}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1A3409' }}>
            <Recycle size={48} strokeWidth={1.5} color="#7BAF60" className="mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#D4EBC8' }}>Earn more Green Points</h3>
            <p className="text-sm mb-6" style={{ color: '#9CC982', maxWidth: 380, margin: '0 auto 24px' }}>
              Schedule a doorstep recycling pickup and earn up to 150+ Green Points per session. Free service across Mumbai.
            </p>
            <button onClick={() => setRecycleOpen(true)} className="px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 mx-auto" style={{ backgroundColor: '#D4EBC8', color: '#1A3409', fontFamily: 'var(--font-body)' }}>
              Schedule Pickup <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </main>
      ) : (
        <>
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
            <div className="relative h-[420px] md:h-[520px] overflow-hidden rounded-t-[16px]">
              <img
                src="https://images.unsplash.com/photo-1766634001794-b3003f486954?w=1800&h=900&fit=crop&auto=format"
                alt="Bright minimal home corner with a woven tote and wooden shelving"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
                <h1 className="text-5xl mb-3 leading-none">Revive</h1>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-5">Give things a second life</p>
                <p className="text-sm sm:text-base leading-relaxed max-w-2xl mb-7">
                  Thoughtful essentials and rewarding recycling for a lighter, more sustainable everyday.
                </p>
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-semibold underline underline-offset-8 decoration-1 transition-opacity hover:opacity-75"
                  >
                    Shop Now
                  </button>
                  <button
                    onClick={() => setRecycleOpen(true)}
                    className="text-sm font-semibold underline underline-offset-8 decoration-1 transition-opacity hover:opacity-75"
                  >
                    Recycle &amp; Earn
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Material Strip ────────────────────────────────────────────── */}
          <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 -mt-5">
            <div className="h-16 overflow-hidden rounded-t-[16px] bg-white shadow-sm border border-black/5 flex items-center">
              <div className="hero-strip-scroll flex items-center whitespace-nowrap">
                {[0, 1].map(group => (
                  <div key={group} aria-hidden={group === 1} className="flex items-center gap-7 pr-7 text-sm font-semibold" style={{ color: '#1A3409' }}>
                    <span>Made in <span style={{ color: '#A0522D' }}>India</span></span><span>○</span>
                    <span>No <span style={{ color: '#A0522D' }}>plastic</span></span><span>○</span>
                    <span><span style={{ color: '#A0522D' }}>Plant-based</span> materials</span><span>○</span>
                    <span><span style={{ color: '#A0522D' }}>Non-toxic</span></span><span>○</span>
                    <span><span style={{ color: '#A0522D' }}>Doorstep</span> pickup</span><span>○</span>
                    <span>Earn <span style={{ color: '#A0522D' }}>points</span> per kilo</span><span>○</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Shop by Category ──────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1A3409', lineHeight: 1.2 }}>
                Shop by<br /><span style={{ color: '#5C8A44' }}>Category</span>
              </h2>
              <p className="text-sm" style={{ color: '#8B6347' }}>168 eco-products</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORY_CARDS.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="group cursor-pointer rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <img src={cat.img} alt={cat.name} className="product-img w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,52,9,0.7) 0%, transparent 55%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs font-semibold mb-0.5" style={{ color: '#9CC982' }}>{cat.count} products</p>
                      <h3 className="text-base font-semibold leading-snug" style={{ fontFamily: 'var(--font-display)', color: '#F5F0E8' }}>{cat.name}</h3>
                      <p className="text-xs mt-1 opacity-80" style={{ color: '#D4EBC8' }}>{cat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Products ──────────────────────────────────────────────────── */}
          <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>
                {activeCategory === 'all' ? 'Featured Products' : activeCategory}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                    style={{ backgroundColor: activeCategory === c.id ? '#2D5016' : 'transparent', color: activeCategory === c.id ? '#D4EBC8' : '#8B6347', borderColor: activeCategory === c.id ? '#2D5016' : '#D4C5A9', fontFamily: 'var(--font-body)' }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} onOpenProduct={setSelectedProduct} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Sprout size={48} strokeWidth={1} color="#D4C5A9" className="mx-auto mb-4" />
                <p className="text-lg font-medium" style={{ color: '#1A3409' }}>No products in this category yet</p>
                <button onClick={() => setActiveCategory('all')} className="mt-4 text-sm font-semibold flex items-center gap-1 mx-auto" style={{ color: '#5C8A44' }}>
                  View all products <ArrowRight size={13} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </section>

          {/* ── Green Points Banner ───────────────────────────────────────── */}
          <section id="environmental-promise" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#1A3409' }}>
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-10 md:p-14">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'rgba(212,235,200,0.15)', color: '#9CC982' }}>
                    <Recycle size={13} strokeWidth={1.5} color="#9CC982" /> Waste-to-Value Model
                  </div>
                  <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)', color: '#F5F0E8', lineHeight: 1.2 }}>
                    Recycle Waste,<br />
                    <span style={{ color: '#9CC982' }}>Earn &amp; Redeem</span>
                  </h2>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: '#A8C496', lineHeight: 1.8 }}>
                    Schedule a free doorstep pickup and we'll collect your recyclable waste. We weigh and process it, then credit Green Points to your account instantly.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { Icon: Recycle,     step: '01', title: 'Schedule Pickup',    desc: 'Choose date & waste type' },
                      { Icon: Scale,       step: '02', title: 'We Collect & Weigh', desc: 'Doorstep, free of cost' },
                      { Icon: Leaf,        step: '03', title: 'Earn Points',         desc: 'Redeem while shopping' },
                    ].map(s => (
                      <div key={s.step}>
                        <s.Icon size={22} strokeWidth={1.5} color="#7BAF60" className="mb-2" />
                        <div className="text-xs font-bold mb-1" style={{ color: '#5C8A44' }}>{s.step}</div>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: '#D4EBC8' }}>{s.title}</div>
                        <div className="text-xs" style={{ color: '#7BAF60' }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setRecycleOpen(true)} className="px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2" style={{ backgroundColor: '#D4EBC8', color: '#1A3409', fontFamily: 'var(--font-body)' }}>
                    Schedule Free Pickup <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
                <div className="relative overflow-hidden hidden md:block" style={{ minHeight: 400 }}>
                  <img
                    src="https://images.unsplash.com/photo-1758599669016-acedd3942ca2?w=700&h=600&fit=crop&auto=format"
                    alt="Community members recycling waste responsibly"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,52,9,0.4) 0%, transparent 50%)' }} />
                  {/* Points-per-kg card */}
                  <div className="absolute top-8 right-8">
                    <div className="rounded-2xl p-4 shadow-xl" style={{ backgroundColor: 'rgba(245,240,232,0.92)', backdropFilter: 'blur(12px)' }}>
                      <p className="text-xs font-bold mb-3" style={{ color: '#1A3409' }}>Points per kg</p>
                      {WASTE_TYPES.map(w => (
                        <div key={w.id} className="flex items-center justify-between gap-5 py-0.5">
                          <div className="flex items-center gap-1.5">
                            <w.Icon size={11} strokeWidth={1.5} color="#5C8A44" />
                            <span className="text-xs" style={{ color: '#4A5C3C' }}>{w.label}</span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: '#2D5016' }}>{w.pts} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Environmental Promise ─────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="rounded-3xl p-10 md:p-14 relative overflow-hidden" style={{ backgroundColor: '#EDE8DC' }}>
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: '#1A3409', lineHeight: 1.2 }}>
                  Every purchase shows<br />its environmental cost
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: '#4A5C3C', lineHeight: 1.8, maxWidth: 480 }}>
                  Before you buy, Revive shows you exactly how much plastic, CO₂, and water each product saves compared to conventional alternatives. Conscious consumption starts with informed choices.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Plastic saved', val: '2.4 kg',  Icon: Waves,    desc: 'avg. per order' },
                    { label: 'CO₂ reduced',   val: '1.8 kg',  Icon: Sprout,   desc: 'avg. per order' },
                    { label: 'Water saved',    val: '340 L',   Icon: Droplets, desc: 'avg. per order' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(245,240,232,0.7)' }}>
                      <s.Icon size={22} strokeWidth={1.5} color="#2D5016" className="mb-2" />
                      <div className="text-xl font-bold" style={{ color: '#1A3409' }}>{s.val}</div>
                      <div className="text-xs font-semibold" style={{ color: '#2D5016' }}>{s.label}</div>
                      <div className="text-xs" style={{ color: '#8B6347' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Testimonials ──────────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <h2 className="text-3xl font-semibold mb-8 text-center" style={{ fontFamily: 'var(--font-display)', color: '#1A3409' }}>
              What Mumbai's Eco Community Says
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { name: 'Ananya Joshi',    initials: 'AJ', role: 'Student, Juhu',     pts: '340', rating: 5, quote: "I've been plastic-free for 6 months thanks to Revive. The bamboo products are gorgeous and so easy to switch to." },
                { name: 'Rohan Mehta',     initials: 'RM', role: 'Designer, Bandra',  pts: '520', rating: 5, quote: "The recycling pickup is brilliant — I earn Green Points and redeem them at checkout. Being eco-conscious has never felt this rewarding." },
                { name: 'Sunita & Family', initials: 'SF', role: 'Household, Powai',  pts: '890', rating: 5, quote: "We've cut household waste by 60% with Revive. My kids love that we're making a real difference." },
              ].map(t => (
                <div key={t.name} className="rounded-2xl p-6 border" style={{ backgroundColor: '#FAF7F2', borderColor: '#EDE8DC' }}>
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={13} strokeWidth={1.5} fill="#2D5016" color="#2D5016" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6 italic" style={{ color: '#4A5C3C', lineHeight: 1.7 }}>"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#D4EBC8', color: '#1A3409' }}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1A3409' }}>{t.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs" style={{ color: '#8B6347' }}>{t.role}</span>
                        <span className="text-xs" style={{ color: '#D4C5A9' }}>·</span>
                        <Leaf size={10} strokeWidth={1.5} color="#5C8A44" />
                        <span className="text-xs font-medium" style={{ color: '#5C8A44' }}>{t.pts} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Newsletter ────────────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="rounded-3xl p-10 md:p-14 text-center" style={{ backgroundColor: '#2D5016' }}>
              <Sprout size={44} strokeWidth={1.5} color="#7BAF60" className="mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: '#F5F0E8', lineHeight: 1.2 }}>
                Join Mumbai's Green Movement
              </h2>
              <p className="text-sm mb-8" style={{ color: '#A8C496', maxWidth: 420, margin: '0 auto 32px' }}>
                Get eco tips, new arrivals, recycling guides, and exclusive Green Point bonus events — straight to your inbox.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'rgba(245,240,232,0.15)', color: '#F5F0E8', border: '1.5px solid rgba(212,235,200,0.3)', fontFamily: 'var(--font-body)' }}
                />
                <button
                  onClick={() => {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
                      showToast('Enter a valid email address')
                      return
                    }
                    setNewsletterEmail('')
                    showToast('You are subscribed to Revive updates')
                  }}
                  className="px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap flex items-center gap-2"
                  style={{ backgroundColor: '#D4EBC8', color: '#1A3409', fontFamily: 'var(--font-body)' }}
                >
                  Subscribe <ArrowRight size={14} strokeWidth={2} color="#1A3409" />
                </button>
              </div>
            </div>
          </section>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <footer className="mt-10 border-t" style={{ backgroundColor: '#1A3409', borderColor: '#2D5016' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
              <div className="grid md:grid-cols-4 gap-10 mb-12">
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4EBC8' }}>
                      <Leaf size={16} strokeWidth={1.5} color="#2D5016" />
                    </div>
                    <span className="text-xl font-bold" style={{ color: '#F5F0E8' }}>Revive</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#7BAF60', lineHeight: 1.7 }}>
                    Mumbai's zero-waste marketplace. Shop sustainable, recycle more, live consciously.
                  </p>
                  <div className="flex gap-3">
                    {[Image, MessageCircle, Briefcase, Play].map((Icon, i) => (
                      <button key={i} onClick={() => showToast('Revive social channel opening soon')} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ backgroundColor: 'rgba(212,235,200,0.1)' }} aria-label="Revive social channel">
                        <Icon size={16} strokeWidth={1.5} color="#9CC982" />
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { title: 'Shop',          links: ['All Products', 'Reusable Products', 'Upcycled Goods', 'Plastic-Free', 'Sustainable Living', 'New Arrivals'] },
                  { title: 'Green Points',  links: ['How it Works', 'Schedule Pickup', 'Earn Points', 'Redeem Points', 'Points History', 'Green Leaderboard'] },
                  { title: 'Company',       links: ['About Revive', 'Our Mission', 'Sustainability Report', 'Careers', 'Press', 'Contact Us'] },
                ].map(col => (
                  <div key={col.title}>
                    <h4 className="text-sm font-bold mb-4" style={{ color: '#D4EBC8' }}>{col.title}</h4>
                    <ul className="space-y-2">
                      {col.links.map(link => (
                        <li key={link}><button onClick={() => handleFooterLink(link)} className="text-sm transition-colors text-left" style={{ color: '#7BAF60' }}>{link}</button></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(212,235,200,0.15)' }}>
                <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#5C8A44' }}>
                  {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Shipping Policy'].map(l => (
                    <button key={l} onClick={() => showToast(`${l} information will be available soon`)} style={{ color: '#5C8A44' }}>{l}</button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {['UPI', 'PhonePe', 'GPay', 'Paytm', 'RuPay'].map(p => (
                    <div key={p} className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: 'rgba(212,235,200,0.1)', color: '#9CC982' }}>{p}</div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-center mt-6" style={{ color: '#3D6B20' }}>
                © 2026 Revive Eco Commerce Pvt Ltd · Made with care in Mumbai · Committed to Zero Waste
              </p>
            </div>
          </footer>
        </>
      )}

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 h-16 border-t mobile-bottom-nav flex items-stretch" style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C5A9' }} aria-label="Mobile navigation">
        {[
          { id: 'home', label: 'Home', Icon: Home, action: () => { openShop(); setActiveNav('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) } },
          { id: 'shop', label: 'Shop', Icon: Leaf, action: () => { openShop(); window.setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 0) } },
          { id: 'cart', label: 'Cart', Icon: ShoppingBag, action: () => setIsCartOpen(true) },
          { id: 'profile', label: 'Profile', Icon: User, action: openProfile },
        ].map(item => {
          const isActive = item.id === 'cart' ? isCartOpen : item.id === 'profile' ? loginView || ordersView || Boolean(selectedOrder) : activeNav === item.id
          return (
            <button key={item.id} onClick={item.action} className="relative flex-1 min-h-16 flex flex-col items-center justify-center gap-1 text-xs font-semibold" style={{ color: isActive ? '#1A3409' : '#8B6347' }}>
              <item.Icon size={21} strokeWidth={1.5} color={isActive ? '#2D5016' : '#8B6347'} />
              {item.label}
              {item.id === 'cart' && cartCount > 0 && <span className="absolute top-1.5 left-1/2 ml-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: '#5C8A44', color: 'white' }}>{cartCount}</span>}
            </button>
          )
        })}
      </nav>

      {/* ── Overlays ─────────────────────────────────────────────────────── */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={p => { addToCart(p); setSelectedProduct(null) }} />
      )}
      <CartSidebar
        cart={cart} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty} onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); setCheckoutOpen(true) }}
        greenPoints={greenPoints} usePoints={usePoints} setUsePoints={setUsePoints}
      />
      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onOrderPlaced={handleOrderPlaced}
          onTrackOrder={order => {
            setCheckoutOpen(false)
            setSelectedOrder(order)
            setOrdersView(false)
            setGreenPointsView(false)
            setLoginView(false)
            setAboutView(false)
            setActiveNav('orders')
          }}
          greenPoints={greenPoints}
          usePoints={usePoints}
        />
      )}
      {recycleOpen && (
        <RecycleModal onClose={() => setRecycleOpen(false)} onScheduled={handleScheduled} />
      )}
    </div>
  )
}
