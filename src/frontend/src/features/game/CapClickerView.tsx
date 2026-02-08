import { useCapClickerGame } from './useCapClickerGame';
import { CLICK_UPGRADES, AUTOMATION_UPGRADES } from './upgrades';
import { UpgradeCard } from './components/UpgradeCard';
import { ClickFeedback } from './components/ClickFeedback';
import { SmoothScrollArea } from './components/SmoothScrollArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Zap, TrendingUp } from 'lucide-react';

export function CapClickerView() {
  const {
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
  } = useCapClickerGame();

  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [clickKey, setClickKey] = useState(0);

  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleClick();
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setClickKey((prev) => prev + 1);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/assets/generated/cap-bg.dim_1920x1080.png)' }}
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-900/50 via-orange-800/40 to-amber-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <header className="text-center mb-6 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-50 drop-shadow-2xl mb-2 tracking-tight">
              Cap Clicker
            </h1>
            <p className="text-amber-100/90 text-base sm:text-lg font-medium">Click to collect caps and build your empire!</p>
          </header>

          {/* Main Game Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {/* Left Column - Stats */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="game-panel">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl text-amber-900 flex items-center gap-2 font-bold">
                    <img 
                      src="/assets/generated/cap-icon.dim_256x256.png" 
                      alt="Cap" 
                      className="w-7 h-7 sm:w-8 sm:h-8"
                    />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="stat-highlight">
                    <div className="text-xs sm:text-sm text-amber-800 font-semibold mb-1 uppercase tracking-wide">Total Caps</div>
                    <div className="text-3xl sm:text-4xl font-bold text-amber-900">{formatNumber(totalCaps)}</div>
                  </div>
                  <div className="stat-card">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-700 font-semibold mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Per Click</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-800">+{formatNumber(capsPerClick)}</div>
                  </div>
                  <div className="stat-card">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-700 font-semibold mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Per Second</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-800">+{formatNumber(capsPerSecond)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Center Column - Click Button */}
            <div className="lg:col-span-1 flex items-center justify-center py-4 sm:py-8">
              <div className="relative">
                <Button
                  onClick={handleMainClick}
                  size="lg"
                  className="click-button group"
                >
                  <div className="absolute inset-0 bg-[url('/assets/generated/cap-button.dim_900x300.png')] bg-center bg-contain bg-no-repeat opacity-70 group-hover:opacity-90 transition-opacity duration-200 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <img 
                      src="/assets/generated/cap-icon.dim_256x256.png" 
                      alt="Cap" 
                      className="w-24 h-24 sm:w-28 sm:h-28 mb-2 drop-shadow-2xl motion-safe:group-active:scale-90 transition-transform duration-100"
                    />
                    <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg tracking-wide">CLICK!</span>
                  </div>
                </Button>
                {clickPosition && (
                  <ClickFeedback
                    key={clickKey}
                    x={clickPosition.x}
                    y={clickPosition.y}
                    value={capsPerClick}
                  />
                )}
              </div>
            </div>

            {/* Right Column - Shop */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="game-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl sm:text-2xl text-amber-900 font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                    Click Upgrades
                  </CardTitle>
                  <p className="text-xs text-amber-700 mt-1">Increase caps per click</p>
                </CardHeader>
                <CardContent className="p-0">
                  <SmoothScrollArea className="h-[320px] sm:h-[400px] px-4 sm:px-6 pb-4">
                    <div className="space-y-2.5">
                      {CLICK_UPGRADES.map((upgrade) => {
                        const level = clickUpgradeLevels[upgrade.id] || 0;
                        const cost = getUpgradeCost(upgrade, level);
                        const canAfford = totalCaps >= cost;
                        const isJustPurchased = lastPurchasedUpgrade === upgrade.id;

                        return (
                          <UpgradeCard
                            key={upgrade.id}
                            upgrade={upgrade}
                            level={level}
                            cost={cost}
                            canAfford={canAfford}
                            isJustPurchased={isJustPurchased}
                            onPurchase={() => purchaseClickUpgrade(upgrade.id)}
                          />
                        );
                      })}
                    </div>
                  </SmoothScrollArea>
                </CardContent>
              </Card>

              <Card className="game-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl sm:text-2xl text-amber-900 font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                    Automation
                  </CardTitle>
                  <p className="text-xs text-amber-700 mt-1">Generate caps automatically</p>
                </CardHeader>
                <CardContent className="p-0">
                  <SmoothScrollArea className="h-[320px] sm:h-[400px] px-4 sm:px-6 pb-4">
                    <div className="space-y-2.5">
                      {AUTOMATION_UPGRADES.map((upgrade) => {
                        const level = automationUpgradeLevels[upgrade.id] || 0;
                        const cost = getUpgradeCost(upgrade, level);
                        const canAfford = totalCaps >= cost;
                        const isJustPurchased = lastPurchasedUpgrade === upgrade.id;

                        return (
                          <UpgradeCard
                            key={upgrade.id}
                            upgrade={upgrade}
                            level={level}
                            cost={cost}
                            canAfford={canAfford}
                            isJustPurchased={isJustPurchased}
                            onPurchase={() => purchaseAutomationUpgrade(upgrade.id)}
                          />
                        );
                      })}
                    </div>
                  </SmoothScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-8 sm:mt-12 text-amber-100/80 text-sm">
            © 2026. Built with love using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-amber-100 underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-900/50 rounded-sm"
            >
              caffeine.ai
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
