import React, { useEffect, useState } from 'react';
import { inventoryApi } from '../api';
import HoloItem3D from '../components/3d/HoloItem3D';
import HoloButton from '../components/hud/HoloButton';
import HoloPanel from '../components/hud/HoloPanel';
import { soundFX } from '../utils/soundFX';
import { Loader2, Shield, ShieldCheck, Backpack, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equippingId, setEquippingId] = useState(null);

  useEffect(() => {
    inventoryApi.get().then((r) => { setInventory(r.data.inventory); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleEquip = async (id) => {
    setEquippingId(id);
    try {
      const res = await inventoryApi.equip(id);
      const { equipped } = res.data;
      soundFX.playPurchase();
      setInventory((prev) => prev.map((item) => {
        if (item.id === id) return { ...item, equipped };
        if (item.type === prev.find((i) => i.id === id)?.type) return { ...item, equipped: false };
        return item;
      }));
      toast.success(equipped ? 'Artifact equipped to operative matrix!' : 'Artifact unequipped.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Equip protocol failed.');
    }
    setEquippingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-80 text-cyber-muted font-orbitron font-bold">
      <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyber-cyan" /> SCANNING VAULT INVENTORY...
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-cyber-text tracking-tight flex items-center gap-3">
          <span className="w-10 h-10 rounded bg-cyber-purple/20 border-2 border-cyber-purple text-cyber-purple flex items-center justify-center text-xl shadow-holo-purple">
            🎒
          </span>
          EQUIPMENT MATRIX & VAULT
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          MANAGE ACQUIRED HOLOGRAPHIC GEAR, SKINS, AND PRESTIGE BADGES
        </p>
      </div>

      {inventory.length === 0 ? (
        <div className="bg-cyber-panel/80 border-2 border-dashed border-cyber-border/50 rounded-xl p-12 text-center space-y-3">
          <div className="text-4xl">📦</div>
          <h3 className="font-orbitron font-bold text-xl text-cyber-text">VAULT INVENTORY IS EMPTY</h3>
          <p className="font-body text-xs text-cyber-muted max-w-md mx-auto">
            You have not acquired any artifacts yet. Complete quests to harvest credits and visit The Cyber Bazaar!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className={clsx(
                'relative bg-cyber-panel/85 backdrop-blur-md border-2 rounded-lg p-5 flex flex-col justify-between transition-all duration-150 overflow-hidden cyber-corner-tl',
                item.equipped
                  ? 'border-cyber-green shadow-holo-green bg-cyber-panel2/60'
                  : 'border-cyber-border/50 hover:border-cyber-cyan hover:shadow-holo-cyan'
              )}
            >
              <div>
                {/* 3D Holographic Artifact preview */}
                <div className="bg-cyber-bg/90 border border-cyber-border/30 rounded-lg p-2 mb-3 relative">
                  <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider mb-1">
                    <span className="text-cyber-muted">{item.type}</span>
                    {item.equipped && (
                      <span className="text-cyber-green bg-cyber-green/20 px-1.5 py-0.5 rounded border border-cyber-green">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <HoloItem3D type={item.type} name={item.name} height="120px" />
                </div>

                <h3 className="font-orbitron font-bold text-base text-cyber-text leading-snug">{item.name}</h3>
                <p className="font-body text-xs text-cyber-muted mt-1 leading-relaxed line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyber-border/30">
                <button
                  onClick={() => handleEquip(item.id)}
                  disabled={equippingId === item.id}
                  className={clsx(
                    'w-full flex items-center justify-center gap-1.5 font-orbitron font-bold text-xs uppercase py-2.5 rounded border-2 transition-all cursor-pointer',
                    item.equipped
                      ? 'bg-cyber-green/20 text-cyber-green border-cyber-green shadow-holo-green'
                      : 'bg-cyber-bg text-cyber-text border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan'
                  )}
                >
                  {item.equipped ? (
                    <>
                      <ShieldCheck className="w-4 h-4 stroke-[3]" /> EQUIPPED
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" /> EQUIP ARTIFACT
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
