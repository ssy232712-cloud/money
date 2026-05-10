import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  ShoppingCart, 
  Receipt as ReceiptIcon, 
  RotateCcw, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { Product, CartItem, Receipt } from './types';
import { PRODUCT_POOL } from './constants';

const INITIAL_WALLET_MAX = 50000;

export default function App() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [userChangeInput, setUserChangeInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: 'none', message: '' });
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize App
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomStart = Math.floor(Math.random() * (INITIAL_WALLET_MAX / 1000 - 10) + 10) * 1000;
    setWalletBalance(randomStart);
    generateNewProducts();
    setCart([]);
    setShowReceipt(false);
    setCurrentReceipt(null);
    setUserChangeInput('');
    setFeedback({ type: 'none', message: '' });
  };

  const generateNewProducts = () => {
    const newProducts: Product[] = Array.from({ length: 8 }).map((_, i) => {
      const template = PRODUCT_POOL[Math.floor(Math.random() * PRODUCT_POOL.length)];
      return {
        id: `prod-${Date.now()}-${i}`,
        name: template.name,
        price: Math.floor((Math.random() * (template.maxPrice - template.minPrice) + template.minPrice) / 100) * 100,
        category: template.category,
        icon: template.icon,
      };
    });
    setProducts(newProducts);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(p => p.id === productId ? { ...p, quantity: p.quantity - 1 } : p);
      }
      return prev.filter(p => p.id !== productId);
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handlePurchase = () => {
    if (cart.length === 0) return;
    
    if (cartTotal > walletBalance) {
      showNotification('잔액이 부족합니다! 물건을 덜어내주세요.');
      return;
    }

    const receipt: Receipt = {
      items: [...cart],
      totalPrice: cartTotal,
      paidAmount: walletBalance,
      expectedChange: walletBalance - cartTotal,
      timestamp: new Date(),
    };

    setCurrentReceipt(receipt);
    setShowReceipt(true);
    setUserChangeInput('');
    setFeedback({ type: 'none', message: '' });
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const checkChange = () => {
    if (!currentReceipt) return;
    const inputVal = parseInt(userChangeInput);
    if (isNaN(inputVal)) return;

    if (inputVal === currentReceipt.expectedChange) {
      setFeedback({ type: 'success', message: '정답입니다! 거스름돈이 정확해요.' });
      // Finalize wallet after correct calculation
      setTimeout(() => {
        setWalletBalance(currentReceipt.expectedChange);
        setCart([]);
        setShowReceipt(false);
        generateNewProducts();
        showNotification('구매가 완료되었습니다!');
      }, 2000);
    } else {
      setFeedback({ type: 'error', message: '거스름돈을 다시 계산해보세요.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] font-sans text-[#5D4037] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FFD93D] border-b-4 border-[#FBC02D] shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-inner text-2xl">
            💰
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#5D4037]">나의 지갑 시뮬레이션</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={resetGame}
            className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-6 py-2.5 rounded-full font-bold shadow-lg transform active:scale-95 transition-all border-b-4 border-[#D32F2F] text-sm"
          >
            새 지갑 받기
          </button>
          <button 
            onClick={generateNewProducts}
            className="bg-[#4D96FF] hover:bg-[#1E88E5] text-white px-6 py-2.5 rounded-full font-bold shadow-lg transform active:scale-95 transition-all border-b-4 border-[#1565C0] text-sm"
          >
            상점 물건 바꾸기
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        {/* Left Side: Market / Wallet Status */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          {/* Wallet Balance Card */}
          <motion.div 
            className="bg-white border-4 border-[#6BCB77] rounded-[32px] p-8 shadow-xl relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl pointer-events-none">💵</div>
            <p className="text-[#388E3C] font-bold text-lg mb-2 uppercase tracking-widest">현재 내 지갑</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black text-[#2E7D32]">{walletBalance.toLocaleString()}</span>
              <span className="text-3xl font-bold text-[#2E7D32]">원</span>
            </div>
          </motion.div>

          {/* Market Items Grid */}
          <div className="flex-1 bg-[#E3F2FD] rounded-[40px] border-4 border-[#4D96FF] p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#1565C0] mb-8 flex items-center gap-2">
              <span>🛒</span> 오늘의 추천 물품
            </h2>
            <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => addToCart(product)}
                  className="bg-white p-5 rounded-2xl border-2 border-transparent hover:border-[#4D96FF] cursor-pointer shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="text-lg font-bold text-gray-700 mb-1">{product.name}</div>
                  <div className="text-2xl font-black text-[#1565C0] group-hover:scale-105 transition-transform">
                    {product.price.toLocaleString()}원
                  </div>
                  <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-[#4D96FF] text-white p-1 rounded-full">
                      <Plus size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Receipt & Activity */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          {/* Shopping Cart / Receipt Box */}
          <div className="bg-white flex-1 border-4 border-[#BDBDBD] rounded-2xl shadow-xl flex flex-col transform rotate-1 relative min-h-[400px]">
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                <h3 className="text-2xl font-mono font-bold text-gray-800 uppercase tracking-widest">영 수 증 (RECEIPT)</h3>
                <p className="text-sm text-gray-500 font-mono">
                  {currentReceipt ? currentReceipt.timestamp.toLocaleString() : new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="space-y-4 font-mono text-lg flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {cart.length === 0 ? (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-center italic mt-10"
                    >
                      상점에서 물건을 선택해주세요
                    </motion.p>
                  ) : (
                    cart.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex justify-between items-center group"
                      >
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                            className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                          <span>{item.name} × {item.quantity}</span>
                        </div>
                        <span className="font-bold">{(item.price * item.quantity).toLocaleString()}원</span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
                <div className="flex justify-between items-center text-3xl font-black text-gray-900">
                  <span>합계 금액:</span>
                  <span>{cartTotal.toLocaleString()}원</span>
                </div>
              </div>
              
              {!showReceipt && (
                <button 
                  onClick={handlePurchase}
                  disabled={cart.length === 0 || cartTotal > walletBalance}
                  className="mt-6 w-full bg-[#388E3C] hover:bg-[#2E7D32] text-white py-4 rounded-xl font-black text-xl shadow-lg border-b-4 border-[#1B5E20] disabled:opacity-50 transition-all active:scale-95"
                >
                  구매 하기
                </button>
              )}
            </div>
            {/* Receipt Bottom Jagged Edge */}
            <div className="h-4 w-full bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle at 10px 0, transparent 10px, white 10px)', backgroundSize: '20px 20px', backgroundPosition: '-10px 0' }}></div>
          </div>

          {/* Calculation Activity */}
          <AnimatePresence>
            {showReceipt && currentReceipt && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-[#FF8A65] p-8 rounded-[32px] border-4 border-[#E64A19] shadow-xl text-white"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black flex items-center gap-2 tracking-tight">✏️ 직접 계산해봐요!</h3>
                  <button 
                    onClick={() => setShowReceipt(false)}
                    className="bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">거스름돈 퀴즈</p>
                    <p className="text-lg font-medium italic">
                      지갑에서 <span className="underline decoration-2 underline-offset-4">{walletBalance.toLocaleString()}원</span>을 냈어요. 
                      받아야 할 거스름돈은 얼마인가요?
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        value={userChangeInput}
                        onChange={(e) => {
                          setUserChangeInput(e.target.value);
                          setFeedback({ type: 'none', message: '' });
                        }}
                        disabled={feedback.type === 'success'}
                        placeholder="금액 입력" 
                        className="w-full rounded-2xl p-5 text-4xl font-black text-[#5D4037] focus:ring-4 focus:ring-[#FFD93D] outline-none border-none shadow-inner"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-bold text-[#5D4037]/40 pointer-events-none">원</span>
                    </div>
                    <button 
                      onClick={checkChange}
                      disabled={feedback.type === 'success'}
                      className="bg-[#FFE082] text-[#5D4037] px-10 font-black text-xl rounded-2xl hover:bg-white transition-colors border-b-4 border-[#FFD54F] active:border-b-0 active:translate-y-1"
                    >
                      확인
                    </button>
                  </div>

                  <div className="h-10 flex items-center justify-center">
                    {feedback.type !== 'none' && (
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`px-6 py-2 rounded-full font-bold text-lg shadow-sm ${feedback.type === 'success' ? 'bg-[#4CAF50] text-white' : 'bg-[#FFEB3B] text-[#5D4037]'}`}
                      >
                        {feedback.type === 'success' ? '✨ 정답입니다! 거스름돈을 정확히 계산했어요! ✨' : '다시 한번 계산해볼까요? 할 수 있어요!'}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="bg-[#5D4037] text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl border-4 border-[#FFD93D]">
              <AlertCircle size={20} className="text-[#FFD93D]" />
              <span className="font-bold text-lg">{notification}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center text-[#5D4037] opacity-60 text-sm font-bold mt-12 border-t-4 border-[#FBC02D]/10">
        <p>&copy; 2026 슬기로운 소비생활 • 나만의 지갑 시뮬레이션</p>
      </footer>
    </div>
  );
}
