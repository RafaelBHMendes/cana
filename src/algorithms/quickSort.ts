import type { SortingStep } from '../types';

export type PivotStrategy = 'random' | 'median-of-three';

export class QuickSortVisualizer {
    private steps: SortingStep[] = [];
    private stepId = 0;
    private pivotStrategy: PivotStrategy;

    constructor(pivotStrategy: PivotStrategy = 'random') {
        this.pivotStrategy = pivotStrategy;
    }

    public sort(array: number[]): SortingStep[] {
        this.steps = [];
        this.stepId = 0;

        // Passo inicial
        this.addStep({
            array: [...array],
            left: 0,
            right: array.length - 1,
            description: `Iniciando Quick Sort com estratégia de pivô: ${this.pivotStrategy}`,
            type: 'divide'
        });

        const sortedArray = [...array];
        this.quickSort(sortedArray, 0, array.length - 1);

        // Passo final
        this.addStep({
            array: sortedArray,
            left: 0,
            right: array.length - 1,
            description: 'Array ordenado finalizado',
            type: 'combine'
        });

        return this.steps;
    }

    private quickSort(array: number[], left: number, right: number): void {
        if (left >= right) return;

        // Escolha do pivô
        const pivotIndex = this.choosePivot(array, left, right);

        this.addStep({
            array: [...array],
            left,
            right,
            pivotIndex,
            description: `Pivô escolhido: ${array[pivotIndex]} (posição ${pivotIndex})`,
            type: 'divide',
            highlight: [pivotIndex]
        });

        // Particionamento
        const newPivotIndex = this.partition(array, left, right, pivotIndex);

        this.addStep({
            array: [...array],
            left,
            right,
            pivotIndex: newPivotIndex,
            description: `Particionamento concluído. Pivô ${array[newPivotIndex]} agora na posição ${newPivotIndex}`,
            type: 'combine',
            highlight: [newPivotIndex]
        });

        // Recursão esquerda
        if (newPivotIndex > left) {
            this.addStep({
                array: [...array],
                left,
                right: newPivotIndex - 1,
                description: `Ordenando subarray esquerdo [${left}..${newPivotIndex - 1}]`,
                type: 'divide',
                highlight: Array.from({ length: newPivotIndex - left }, (_, i) => left + i)
            });
            this.quickSort(array, left, newPivotIndex - 1);
        }

        // Recursão direita
        if (newPivotIndex < right) {
            this.addStep({
                array: [...array],
                left: newPivotIndex + 1,
                right,
                description: `Ordenando subarray direito [${newPivotIndex + 1}..${right}]`,
                type: 'divide',
                highlight: Array.from({ length: right - newPivotIndex }, (_, i) => newPivotIndex + 1 + i)
            });
            this.quickSort(array, newPivotIndex + 1, right);
        }
    }

    private choosePivot(array: number[], left: number, right: number): number {
        if (this.pivotStrategy === 'random') {
            return Math.floor(Math.random() * (right - left + 1)) + left;
        } else {
            // Median-of-three
            const mid = Math.floor((left + right) / 2);
            const candidates = [
                { index: left, value: array[left] },
                { index: mid, value: array[mid] },
                { index: right, value: array[right] }
            ];

            candidates.sort((a, b) => a.value - b.value);

            this.addStep({
                array: [...array],
                left,
                right,
                description: `Median-of-three: comparando posições ${left}, ${mid}, ${right}`,
                type: 'divide',
                comparisons: [left, mid, right]
            });

            return candidates[1].index; // Mediana
        }
    }

    private partition(array: number[], left: number, right: number, pivotIndex: number): number {
        const pivotValue = array[pivotIndex];

        // Move o pivô para o final
        this.swap(array, pivotIndex, right);

        this.addStep({
            array: [...array],
            left,
            right,
            pivotIndex: right,
            description: `Movendo pivô ${pivotValue} para o final (posição ${right})`,
            type: 'combine',
            highlight: [right]
        });

        let storeIndex = left;

        for (let i = left; i < right; i++) {
            this.addStep({
                array: [...array],
                left,
                right,
                pivotIndex: right,
                description: `Comparando ${array[i]} com pivô ${pivotValue}`,
                type: 'combine',
                comparisons: [i, right],
                highlight: [storeIndex]
            });

            if (array[i] < pivotValue) {
                this.swap(array, i, storeIndex);

                this.addStep({
                    array: [...array],
                    left,
                    right,
                    pivotIndex: right,
                    description: `${array[storeIndex]} < ${pivotValue}, trocando posições ${i} e ${storeIndex}`,
                    type: 'combine',
                    highlight: [storeIndex, i]
                });

                storeIndex++;
            }
        }

        // Move o pivô para sua posição final
        this.swap(array, storeIndex, right);

        return storeIndex;
    }

    private swap(array: number[], i: number, j: number): void {
        [array[i], array[j]] = [array[j], array[i]];
    }

    private addStep(stepData: Omit<SortingStep, 'id' | 'data'>): void {
        this.steps.push({
            id: this.stepId++,
            data: stepData,
            ...stepData
        });
    }
} 