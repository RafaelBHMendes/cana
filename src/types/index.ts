// Tipos para os algoritmos de visualização

export interface AlgorithmStep {
    id: number;
    description: string;
    type: 'divide' | 'conquer' | 'combine';
    data: any;
    highlight?: number[];
    pivot?: number;
    comparisons?: number[];
}

export interface SortingStep extends AlgorithmStep {
    array: number[];
    left: number;
    right: number;
    pivotIndex?: number;
    merging?: boolean;
}

export interface ClosestPairStep extends AlgorithmStep {
    points: Point[];
    leftPoints?: Point[];
    rightPoints?: Point[];
    divisionLine?: number;
    currentPair?: [Point, Point];
    minDistance?: number;
    candidatePoints?: Point[];
}

export interface SelectLinearStep extends AlgorithmStep {
    array: number[];
    target: number;
    left: number;
    right: number;
    pivotIndex?: number;
    partitionIndex?: number;
}

export interface Point {
    x: number;
    y: number;
    id: number;
}

export interface AlgorithmState {
    currentStep: number;
    steps: AlgorithmStep[];
    isPlaying: boolean;
    speed: number;
}

export type AlgorithmType = 'mergeSort' | 'quickSort' | 'closestPair' | 'selectLinear';

export interface AlgorithmConfig {
    name: string;
    description: string;
    type: AlgorithmType;
    complexity: string;
} 