import type { SortingStep } from '../types';

export class MergeSortVisualizer {
    private steps: SortingStep[] = [];
    private stepId = 0;

    public sort(array: number[]): SortingStep[] {
        this.steps = [];
        this.stepId = 0;

        // Passo inicial
        this.addStep({
            array: [...array],
            left: 0,
            right: array.length - 1,
            description: 'Estado inicial do array',
            type: 'divide'
        });

        const sortedArray = [...array];
        this.mergeSort(sortedArray, 0, array.length - 1);

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

    private mergeSort(array: number[], left: number, right: number): void {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        // Divisão
        this.addStep({
            array: [...array],
            left,
            right,
            description: `Dividindo array [${left}..${right}] em [${left}..${mid}] e [${mid + 1}..${right}]`,
            type: 'divide',
            highlight: [left, mid, right]
        });

        // Recursão esquerda
        this.mergeSort(array, left, mid);

        // Recursão direita
        this.mergeSort(array, mid + 1, right);

        // Combinação
        this.merge(array, left, mid, right);
    }

    private merge(array: number[], left: number, mid: number, right: number): void {
        const leftArray = array.slice(left, mid + 1);
        const rightArray = array.slice(mid + 1, right + 1);

        this.addStep({
            array: [...array],
            left,
            right,
            description: `Iniciando merge de [${left}..${mid}] e [${mid + 1}..${right}]`,
            type: 'combine',
            highlight: [left, mid, right],
            merging: true
        });

        let i = 0, j = 0, k = left;

        // Merge principal
        while (i < leftArray.length && j < rightArray.length) {
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                this.addStep({
                    array: [...array],
                    left,
                    right,
                    description: `Colocando ${leftArray[i]} na posição ${k}`,
                    type: 'combine',
                    highlight: [k],
                    comparisons: [left + i, mid + 1 + j]
                });
                i++;
            } else {
                array[k] = rightArray[j];
                this.addStep({
                    array: [...array],
                    left,
                    right,
                    description: `Colocando ${rightArray[j]} na posição ${k}`,
                    type: 'combine',
                    highlight: [k],
                    comparisons: [left + i, mid + 1 + j]
                });
                j++;
            }
            k++;
        }

        // Elementos restantes do lado esquerdo
        while (i < leftArray.length) {
            array[k] = leftArray[i];
            this.addStep({
                array: [...array],
                left,
                right,
                description: `Copiando elemento restante ${leftArray[i]} para posição ${k}`,
                type: 'combine',
                highlight: [k]
            });
            i++;
            k++;
        }

        // Elementos restantes do lado direito
        while (j < rightArray.length) {
            array[k] = rightArray[j];
            this.addStep({
                array: [...array],
                left,
                right,
                description: `Copiando elemento restante ${rightArray[j]} para posição ${k}`,
                type: 'combine',
                highlight: [k]
            });
            j++;
            k++;
        }

        this.addStep({
            array: [...array],
            left,
            right,
            description: `Merge concluído para [${left}..${right}]`,
            type: 'combine',
            highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i)
        });
    }

    private addStep(stepData: Omit<SortingStep, 'id' | 'data'>): void {
        this.steps.push({
            id: this.stepId++,
            data: stepData,
            ...stepData
        });
    }
} 