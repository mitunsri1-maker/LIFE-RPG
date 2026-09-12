import React, { useEffect, useState } from 'react';
import { inventoryApi, characterApi } from '../api';
import HoloItem3D from '../components/3d/HoloItem3D';
import PlayerPod3D from '../components/3d/PlayerPod3D';
import HoloButton from '../components/hud/HoloButton';
import HoloPanel from '../components/hud/HoloPanel';
import { soundFX } from '../utils/soundFX';
import { Loader2, Shield, ShieldCheck, Backpack, Terminal, Sparkles, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [equippingId, setEquippingId] = useState(null);

  useEffect(() => {
    Promise.all([
      inventoryApi.get(),
      characterApi.get().catch(() => ({ data: null })),
    ]).then(([invRes, charRes]) => {
      setInventory(invRes.data.inventory);
      if (charRes?.data) setCharacter(charRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
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
    <div className="flex items-center justify-center h-80 text-cyber-textMuted font-orbitron font-bold">
      <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyber-cyan" /> SCANNING VAULT INVENTORY...
    </div>
  );

  const equippedItems = inventory.filter((i) => Boolean(i.equipped));

  // Equipment slots matching typical RPG loadouts
  const loadoutSlots = [
    { slot: 'HEAD', key: 'hat', item: equippedItems.find((i) => (i.name || '').toLowerCase().includes('hat') || (i.name || '').toLowerCase().includes('chip')) },
    { slot: 'BODY', key: 'armor', item: equippedItems.find((i) => (i.name || '').toLowerCase().includes('armor') || (i.type === 'equipment' && !(i.name || '').toLowerCase().includes('sword') && !(i.name || '').toLowerCase().includes('boot') && !(i.name || '').toLowerCase().includes('hat') && !(i.name || '').toLowerCase().includes('bead'))) },
    { slot: 'ARMS', key: 'sword', item: equippedItems.find((i) => (i.name || '').toLowerCase().includes('sword')) },
    { slot: 'CORE', key: 'beads', item: equippedItems.find((i) => (i.name || '').toLowerCase().includes('bead') || (i.name || '').toLowerCase().includes('tome')) },
    { slot: 'LEGS', key: 'boots', item: equippedItems.find((i) => (i.name || '').toLowerCase().includes('boot')) },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-cyber-text tracking-tight flex items-center gap-3 text-glow-cyan">
          <span className="w-11 h-11 rounded-xl bg-cyber-violet/15 border border-cyber-violet/40 text-cyber-violet flex items-center justify-center text-xl shadow-[0_0_15px_rgba(139,92,246,0.25)]">
            🎒
          </span>
          TACTICAL LOADOUT & VAULT
        </h1>
        <p className="font-mono text-xs text-cyber-textMuted mt-1">
          EQUIP GEAR // BIO-CYBERNETIC ARTIFACT MATRIX
        </p>
      </div>

      {/* RPG Loadout Chamber */}
      <div className="glass-card zero-g-float border border-cyber-cyan/40 rounded-2xl p-6 md:p-8 shadow-glass-depth relative overflow-hidden cyber-corner-tl">
        <div className="flex items-center justify-between border-b border-cyber-border/25 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyber-cyan" />
            <span className="font-orbitron font-bold text-sm text-cyber-text tracking-wider uppercase">
              OPERATIVE EQUIPMENT SLOTS
            </span>
          </div>
          <span className="font-mono text-xs text-cyber-green city-glass px-2.5 py-0.5 rounded border border-cyber-green/40">
            {equippedItems.length} SLOTS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Slots: HEAD, BODY */}
          <div className="lg:col-span-3 space-y-4">
            {loadoutSlots.slice(0, 2).map(({ slot, item }) => (
              <div
                key={slot}
                className={clsx(
                  'city-glass p-3.5 rounded-xl border transition-all',
                  item ? 'border-cyber-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-cyber-border/30 opacity-60'
                )}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyber-cyan mb-1">
                  <span>[{slot}]</span>
                  <span className={item ? 'text-cyber-green' : 'text-cyber-muted'}>{item ? 'ACTIVE' : 'EMPTY'}</span>
                </div>
                {item ? (
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="font-orbitron font-bold text-xs text-cyber-text truncate">{item.name}</p>
                    <button
                      onClick={() => handleEquip(item.id)}
                      className="text-[10px] font-mono text-cyber-coral hover:underline shrink-0 cursor-pointer"
                    >
                      UNEQUIP
                    </button>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-cyber-muted/60 mt-1">No artifact mounted</p>
                )}
              </div>
            ))}
          </div>

          {/* Center 3D Operative Hologram */}
          <div className="lg:col-span-6 city-glass border border-cyber-cyan/35 rounded-xl p-2 flex flex-col items-center justify-center shadow-inner">
            <PlayerPod3D
              level={character?.user?.level || 1}
              username={character?.user?.username || 'OPERATIVE'}
              stats={character?.stats || {}}
              height="260px"
            />
          </div>

          {/* Right Slots: ARMS, CORE, LEGS */}
          <div className="lg:col-span-3 space-y-4">
            {loadoutSlots.slice(2, 5).map(({ slot, item }) => (
              <div
                key={slot}
                className={clsx(
                  'city-glass p-3.5 rounded-xl border transition-all',
                  item ? 'border-cyber-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-cyber-border/30 opacity-60'
                )}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyber-cyan mb-1">
                  <span>[{slot}]</span>
                  <span className={item ? 'text-cyber-green' : 'text-cyber-muted'}>{item ? 'ACTIVE' : 'EMPTY'}</span>
                </div>
                {item ? (
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="font-orbitron font-bold text-xs text-cyber-text truncate">{item.name}</p>
                    <button
                      onClick={() => handleEquip(item.id)}
                      className="text-[10px] font-mono text-cyber-coral hover:underline shrink-0 cursor-pointer"
                    >
                      UNEQUIP
                    </button>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-cyber-muted/60 mt-1">No artifact mounted</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vault Inventory Storage */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-orbitron font-bold text-lg text-cyber-text uppercase tracking-wider text-glow-cyan">
            📦 VAULT ARTIFACT BUFFER ({inventory.length})
          </h2>
          <div className="h-0.5 flex-1 bg-cyber-border/30" />
        </div>

        {inventory.length === 0 ? (
          <div className="city-glass border border-dashed border-cyber-border/40 rounded-2xl p-12 text-center space-y-3 shadow-glass-depth">
            <div className="text-4xl">📦</div>
            <h3 className="font-orbitron font-bold text-xl text-cyber-text">VAULT INVENTORY IS EMPTY</h3>
            <p className="font-body text-xs text-cyber-textMuted max-w-md mx-auto">
              You have not acquired any artifacts yet. Complete quests to harvest credits and visit The Cyber Bazaar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  'relative glass-card zero-g-float p-5 flex flex-col justify-between transition-all duration-300 overflow-hidden cyber-corner-tl',
                  item.equipped
                    ? 'border-cyber-green/50 shadow-[0_0_20px_rgba(0,255,157,0.2)] bg-cyber-navy/50'
                    : 'hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:-translate-y-1'
                )}
              >
                <div>
                  {/* 3D Holographic Artifact preview */}
                  <div className="city-glass-elevated border border-cyber-border/30 rounded-lg p-2 mb-3 relative">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider mb-1">
                      <span className="text-cyber-textMuted">{item.type}</span>
                      {item.equipped && (
                        <span className="text-cyber-green bg-cyber-green/20 px-2 py-0.5 rounded-full border border-cyber-green font-bold">
                          EQUIPPED
                        </span>
                      )}
                    </div>
                    <HoloItem3D type={item.type} name={item.name} height="120px" />
                  </div>

                  <h3 className="font-orbitron font-bold text-base text-cyber-text leading-snug">{item.name}</h3>
                  <p className="font-body text-xs text-cyber-textMuted mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-cyber-border/25">
                  <button
                    onClick={() => handleEquip(item.id)}
                    disabled={equippingId === item.id}
                    className={clsx(
                      'w-full flex items-center justify-center gap-1.5 font-orbitron font-bold text-xs uppercase py-2.5 rounded-lg border transition-all cursor-pointer',
                      item.equipped
                        ? 'bg-cyber-green/20 text-cyber-green border-cyber-green shadow-holo-green hover:bg-cyber-coral/20 hover:text-cyber-coral hover:border-cyber-coral'
                        : 'city-glass text-cyber-cyan border-cyber-cyan/50 hover:bg-cyber-cyan hover:text-cyber-bg hover:shadow-holo-cyan'
                    )}
                  >
                    {item.equipped ? (
                      <>
                        <ShieldCheck className="w-4 h-4 stroke-[3]" /> EQUIPPED (CLICK TO REMOVE)
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
    </div>
  );
}
