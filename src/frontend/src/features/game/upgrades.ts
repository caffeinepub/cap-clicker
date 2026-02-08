export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costScaling: number;
  effectPerLevel: number;
  type: 'click' | 'automation';
}

export const CLICK_UPGRADES: Upgrade[] = [
  {
    id: 'better-finger',
    name: 'Better Finger',
    description: 'Click harder for more caps',
    baseCost: 10,
    costScaling: 1.15,
    effectPerLevel: 1,
    type: 'click',
  },
  {
    id: 'reinforced-thumb',
    name: 'Reinforced Thumb',
    description: 'Double your clicking power',
    baseCost: 100,
    costScaling: 1.2,
    effectPerLevel: 5,
    type: 'click',
  },
  {
    id: 'power-glove',
    name: 'Power Glove',
    description: 'Unleash devastating clicks',
    baseCost: 1000,
    costScaling: 1.25,
    effectPerLevel: 25,
    type: 'click',
  },
  {
    id: 'titanium-fingers',
    name: 'Titanium Fingers',
    description: 'Unbreakable clicking strength',
    baseCost: 10000,
    costScaling: 1.3,
    effectPerLevel: 100,
    type: 'click',
  },
  {
    id: 'quantum-clicker',
    name: 'Quantum Clicker',
    description: 'Click across multiple dimensions',
    baseCost: 100000,
    costScaling: 1.35,
    effectPerLevel: 500,
    type: 'click',
  },
];

export const AUTOMATION_UPGRADES: Upgrade[] = [
  {
    id: 'cap-collector',
    name: 'Cap Collector',
    description: 'Automatically finds caps',
    baseCost: 50,
    costScaling: 1.15,
    effectPerLevel: 1,
    type: 'automation',
  },
  {
    id: 'cap-factory',
    name: 'Cap Factory',
    description: 'Mass produces caps',
    baseCost: 500,
    costScaling: 1.2,
    effectPerLevel: 10,
    type: 'automation',
  },
  {
    id: 'cap-empire',
    name: 'Cap Empire',
    description: 'A global cap operation',
    baseCost: 5000,
    costScaling: 1.25,
    effectPerLevel: 100,
    type: 'automation',
  },
  {
    id: 'cap-megacorp',
    name: 'Cap Megacorp',
    description: 'Dominate the cap industry',
    baseCost: 50000,
    costScaling: 1.3,
    effectPerLevel: 500,
    type: 'automation',
  },
  {
    id: 'cap-singularity',
    name: 'Cap Singularity',
    description: 'Infinite cap generation potential',
    baseCost: 500000,
    costScaling: 1.35,
    effectPerLevel: 2500,
    type: 'automation',
  },
];
