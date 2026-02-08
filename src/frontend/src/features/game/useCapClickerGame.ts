import { useState, useEffect, useCallback, useRef } from 'react';
import { CLICK_UPGRADES, AUTOMATION_UPGRADES, type Upgrade } from './upgrades';

export interface GameState {
  totalCaps: number;
  capsPerClick: number;
  capsPerSecond: number;
  clickUpgradeLevels: Record<string, number>;
  automationUpgradeLevels: Record<string, number>;
}

export function useCapClickerGame() {
  const [totalCaps, setTotalCaps] = useState(0);
  const [capsPerClick, setCapsPerClick] = useState(1);
  const [capsPerSecond, setCapsPerSecond] = useState(0);
  const [clickUpgradeLevels, setClickUpgradeLevels] = useState<Record<string, number>>({});
  const [automationUpgradeLevels, setAutomationUpgradeLevels] = useState<Record<string, number>>({});
  const [lastPurchasedUpgrade, setLastPurchasedUpgrade] = useState<string | null>(null);

  const lastTickRef = useRef<number>(Date.now());

  // Handle clicking the main button
  const handleClick = useCallback(() => {
    setTotalCaps((prev) => prev + capsPerClick);
  }, [capsPerClick]);

  // Calculate current cost for an upgrade
  const getUpgradeCost = useCallback((upgrade: Upgrade, currentLevel: number): number => {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costScaling, currentLevel));
  }, []);

  // Purchase a click upgrade
  const purchaseClickUpgrade = useCallback((upgradeId: string) => {
    const upgrade = CLICK_UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return;

    const currentLevel = clickUpgradeLevels[upgradeId] || 0;
    const cost = getUpgradeCost(upgrade, currentLevel);

    if (totalCaps >= cost) {
      setTotalCaps((prev) => Math.max(0, prev - cost));
      setClickUpgradeLevels((prev) => ({ ...prev, [upgradeId]: currentLevel + 1 }));
      setCapsPerClick((prev) => prev + upgrade.effectPerLevel);
      setLastPurchasedUpgrade(upgradeId);
      setTimeout(() => setLastPurchasedUpgrade(null), 500);
    }
  }, [totalCaps, clickUpgradeLevels, getUpgradeCost]);

  // Purchase an automation upgrade
  const purchaseAutomationUpgrade = useCallback((upgradeId: string) => {
    const upgrade = AUTOMATION_UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return;

    const currentLevel = automationUpgradeLevels[upgradeId] || 0;
    const cost = getUpgradeCost(upgrade, currentLevel);

    if (totalCaps >= cost) {
      setTotalCaps((prev) => Math.max(0, prev - cost));
      setAutomationUpgradeLevels((prev) => ({ ...prev, [upgradeId]: currentLevel + 1 }));
      setCapsPerSecond((prev) => prev + upgrade.effectPerLevel);
      setLastPurchasedUpgrade(upgradeId);
      setTimeout(() => setLastPurchasedUpgrade(null), 500);
    }
  }, [totalCaps, automationUpgradeLevels, getUpgradeCost]);

  // Idle cap generation loop
  useEffect(() => {
    if (capsPerSecond <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setTotalCaps((prev) => prev + capsPerSecond * deltaTime);
    }, 100);

    return () => clearInterval(interval);
  }, [capsPerSecond]);

  return {
    totalCaps,
    capsPerClick,
    capsPerSecond,
    clickUpgradeLevels,
    automationUpgradeLevels,
    lastPurchasedUpgrade,
    handleClick,
    purchaseClickUpgrade,
    purchaseAutomationUpgrade,
    getUpgradeCost,
  };
}
