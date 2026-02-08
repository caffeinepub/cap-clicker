import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock } from 'lucide-react';
import type { Upgrade } from '../upgrades';

interface UpgradeCardProps {
  upgrade: Upgrade;
  level: number;
  cost: number;
  canAfford: boolean;
  isJustPurchased: boolean;
  onPurchase: () => void;
}

export function UpgradeCard({
  upgrade,
  level,
  cost,
  canAfford,
  isJustPurchased,
  onPurchase,
}: UpgradeCardProps) {
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
    <Card 
      className={`upgrade-card ${
        isJustPurchased 
          ? 'upgrade-card-purchased' 
          : canAfford 
          ? 'upgrade-card-affordable' 
          : 'upgrade-card-locked'
      }`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="font-bold text-amber-900 text-sm sm:text-base leading-tight">{upgrade.name}</h3>
              {level > 0 && (
                <Badge variant="secondary" className="text-xs font-semibold bg-amber-200 text-amber-900 hover:bg-amber-200 border-amber-300">
                  Lv {level}
                </Badge>
              )}
              {isJustPurchased && (
                <Badge className="text-xs font-semibold bg-green-600 text-white hover:bg-green-600 border-green-700 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Purchased!
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-amber-700/90 mb-2.5 leading-relaxed">{upgrade.description}</p>
            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
              <span className="text-amber-700 font-medium">
                +{formatNumber(upgrade.effectPerLevel)} {upgrade.type === 'click' ? 'per click' : '/sec'}
              </span>
              <div className="flex items-center gap-1.5">
                {!canAfford && <Lock className="w-3 h-3 text-red-600" />}
                <span className={`font-bold ${canAfford ? 'text-green-700' : 'text-red-600'}`}>
                  {formatNumber(cost)}
                </span>
                <img 
                  src="/assets/generated/cap-icon.dim_256x256.png" 
                  alt="caps" 
                  className="w-3.5 h-3.5 inline-block"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={onPurchase}
            disabled={!canAfford}
            size="sm"
            className={`shrink-0 font-semibold transition-all duration-200 ${
              canAfford
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
            }`}
          >
            Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
