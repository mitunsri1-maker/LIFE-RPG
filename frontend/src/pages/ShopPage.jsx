import React, { useEffect, useState } from 'react';
import { shopApi } from '../api';
import { useAuthStore } from '../store/authStore';
import ShopItem from '../components/ui/ShopItem';
import GoldCounter from '../components/ui/GoldCounter';
import HoloPanel from '../components/hud/HoloPanel';
import { Loader2, ShoppingBag, Sparkles, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const { user, refreshUser } = useAuthStore();

  useEffect(() => {
    shopApi.getItems().then((r) => { setItems(r.data.items); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleBuy = async (id) => {
    setBuyingId(id);
    try {
      const res = await shopApi.buy(id);
      toast.success(res.data.message);
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, owned: true } : item));
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Acquisition protocol rejected.');
    }
    setBuyingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-80 text-cyber-textMuted font-orbitron font-bold">
      <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyber-cyan" /> CONNECTING TO BAZAAR NODE...
    </div>
  );

  const byType = items.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron font-black text-3xl md:text-4xl text-cyber-text tracking-tight flex items-center gap-3 text-glow-gold">
            <span className="w-11 h-11 rounded-xl bg-cyber-amber/15 border border-cyber-amber/40 text-cyber-amber flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,184,77,0.25)]">
              🛒
            </span>
            THE CYBER BAZAAR
          </h1>
          <p className="font-mono text-xs text-cyber-textMuted mt-1">
            EXCHANGE HARVESTED CREDITS FOR 3D HOLOGRAPHIC EQUIPMENT & SKINS
          </p>
        </div>

        <GoldCounter gold={user?.gold || 0} large />
      </div>

      {Object.entries(byType).map(([type, typeItems]) => (
        <div key={type} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="font-orbitron font-bold text-lg text-cyber-text uppercase tracking-wider text-glow-gold">
              {type === 'equipment' ? '⚔️ ARTIFACT EQUIPMENT' : type === 'theme' ? '🎨 NEURAL UI THEMES' : '🏅 PRESTIGE BADGES'}
            </h2>
            <div className="h-0.5 flex-1 bg-cyber-border/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {typeItems.map((item) => (
              <ShopItem key={item.id} item={item} onBuy={handleBuy} isBuying={buyingId === item.id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
