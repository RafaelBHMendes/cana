import type { SelectLinearStep } from '../types';

export class SelectLinearVisualizer {
    private steps: SelectLinearStep[] = [];
    private stepId = 0;

    public select(array: number[], k: number): SelectLinearStep[] {
        this.steps = [];
        this.stepId = 0;

        if (k < 1 || k > array.length) {
            this.addStep({
                array: [...array],
                target: k,
                left: 0,
                right: array.length - 1,
                description: `k=${k} inválido. Deve estar entre 1 e ${array.length}`,
                type: 'divide'
            });
            return this.steps;
        }

        // Passo inicial
        this.addStep({
            array: [...array],
            target: k,
            left: 0,
            right: array.length - 1,
            description: `Iniciando busca pelo ${k}º menor elemento`,
            type: 'divide'
        });

        const workArray = [...array];
        this.selectRec(workArray, 0, array.length - 1, k - 1); // k-1 porque trabalhamos com índices base 0

        return this.steps;
    }

    private selectRec(array: number[], left: number, right: number, k: number): number {
        if (left === right) {
            this.addStep({
                array: [...array],
                target: k + 1,
                left,
                right,
                description: `Elemento encontrado: ${array[left]} na posição ${left}`,
                type: 'combine',
                highlight: [left]
            });
            return array[left];
        }

        this.addStep({
            array: [...array],
            target: k + 1,
            left,
            right,
            description: `Buscando ${k + 1}º menor elemento no subarray [${left}..${right}]`,
            type: 'divide',
            highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i)
        });

        // Dividir em grupos de 5 e encontrar mediana das medianas
        const medianOfMedians = this.findMedianOfMedians(array, left, right);

        this.addStep({
            array: [...array],
            target: k + 1,
            left,
            right,
            pivotIndex: medianOfMedians,
            description: `Mediana das medianas escolhida: ${array[medianOfMedians]} (posição ${medianOfMedians})`,
            type: 'divide',
            highlight: [medianOfMedians]
        });

        // Particionar usando a mediana das medianas como pivô
        const pivotIndex = this.partition(array, left, right, medianOfMedians);

        this.addStep({
            array: [...array],
            target: k + 1,
            left,
            right,
            pivotIndex,
            partitionIndex: pivotIndex,
            description: `Partição concluída. Pivô ${array[pivotIndex]} na posição ${pivotIndex}`,
            type: 'combine',
            highlight: [pivotIndex]
        });

        if (k === pivotIndex) {
            this.addStep({
                array: [...array],
                target: k + 1,
                left,
                right,
                pivotIndex,
                description: `Elemento encontrado! ${array[pivotIndex]} é o ${k + 1}º menor`,
                type: 'combine',
                highlight: [pivotIndex]
            });
            return array[pivotIndex];
        } else if (k < pivotIndex) {
            this.addStep({
                array: [...array],
                target: k + 1,
                left,
                right: pivotIndex - 1,
                description: `Elemento está à esquerda. Buscando em [${left}..${pivotIndex - 1}]`,
                type: 'divide',
                highlight: Array.from({ length: pivotIndex - left }, (_, i) => left + i)
            });
            return this.selectRec(array, left, pivotIndex - 1, k);
        } else {
            this.addStep({
                array: [...array],
                target: k + 1,
                left: pivotIndex + 1,
                right,
                description: `Elemento está à direita. Buscando em [${pivotIndex + 1}..${right}]`,
                type: 'divide',
                highlight: Array.from({ length: right - pivotIndex }, (_, i) => pivotIndex + 1 + i)
            });
            return this.selectRec(array, pivotIndex + 1, right, k);
        }
    }

    private findMedianOfMedians(array: number[], left: number, right: number): number {
        const n = right - left + 1;
        const medians: number[] = [];

        // Dividir em grupos de 5 e encontrar mediana de cada grupo
        for (let i = left; i <= right; i += 5) {
            const groupEnd = Math.min(i + 4, right);
            const groupSize = groupEnd - i + 1;

            this.addStep({
                array: [...array],
                target: 0,
                left: i,
                right: groupEnd,
                description: `Analisando grupo [${i}..${groupEnd}] com ${groupSize} elementos`,
                type: 'conquer',
                highlight: Array.from({ length: groupSize }, (_, j) => i + j)
            });

            const median = this.findMedianOfGroup(array, i, groupEnd);
            medians.push(median);
        }

        this.addStep({
            array: [...array],
            target: 0,
            left,
            right,
            description: `Encontradas ${medians.length} medianas dos grupos`,
            type: 'conquer'
        });

        // Se temos poucos elementos, retorna a mediana diretamente
        if (medians.length <= 5) {
            const sortedMedians = [...medians].sort((a, b) => a - b);
            const medianValue = sortedMedians[Math.floor(sortedMedians.length / 2)];
            return array.indexOf(medianValue, left);
        }

        // Recursivamente encontrar mediana das medianas
        const medianArray = [...medians];
        const medianOfMediansValue = this.selectRec(medianArray, 0, medians.length - 1, Math.floor(medians.length / 2));
        return array.indexOf(medianOfMediansValue, left);
    }

    private findMedianOfGroup(array: number[], left: number, right: number): number {
        // Ordenação por inserção para grupos pequenos
        for (let i = left + 1; i <= right; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= left && array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }
            array[j + 1] = key;
        }

        const medianIndex = left + Math.floor((right - left) / 2);
        return array[medianIndex];
    }

    private partition(array: number[], left: number, right: number, pivotIndex: number): number {
        const pivotValue = array[pivotIndex];

        // Move pivô para o final
        this.swap(array, pivotIndex, right);

        this.addStep({
            array: [...array],
            target: 0,
            left,
            right,
            pivotIndex: right,
            description: `Movendo pivô ${pivotValue} para o final`,
            type: 'combine',
            highlight: [right]
        });

        let storeIndex = left;

        for (let i = left; i < right; i++) {
            this.addStep({
                array: [...array],
                target: 0,
                left,
                right,
                pivotIndex: right,
                description: `Comparando ${array[i]} com pivô ${pivotValue}`,
                type: 'combine',
                comparisons: [i, right]
            });

            if (array[i] <= pivotValue) {
                this.swap(array, i, storeIndex);

                if (i !== storeIndex) {
                    this.addStep({
                        array: [...array],
                        target: 0,
                        left,
                        right,
                        pivotIndex: right,
                        description: `${array[storeIndex]} ≤ ${pivotValue}, trocando posições ${i} e ${storeIndex}`,
                        type: 'combine',
                        highlight: [storeIndex, i]
                    });
                }

                storeIndex++;
            }
        }

        // Move pivô para sua posição final
        this.swap(array, storeIndex, right);

        return storeIndex;
    }

    private swap(array: number[], i: number, j: number): void {
        if (i !== j) {
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private addStep(stepData: Omit<SelectLinearStep, 'id' | 'data'>): void {
        this.steps.push({
            id: this.stepId++,
            data: stepData,
            ...stepData
        });
    }
} 