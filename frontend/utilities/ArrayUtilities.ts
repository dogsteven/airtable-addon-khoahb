export function groupBy<T, U>(array: T[], accessor: (value: T) => U): Map<U, T[]> {
    return array.reduce((accumulation, element) => {
        const accessorKey = accessor(element)
        for (const key of accumulation.keys()) {
            if (key == accessorKey) {
                accumulation.get(key).push(element)
                return accumulation
            }
        }

        accumulation.set(accessorKey, [element])
        return accumulation
    }, new Map<U, T[]>());
}

export function reduceBy<T, U, K>(grouped: Map<U, T[]>, reducer: (accumulation: K, element: T) => K, initialValue: K): Map<U, K> {
    const newGrouped = new Map<U, K>()
    for (const key of grouped.keys()) {
        newGrouped.set(key, grouped.get(key).reduce(reducer, initialValue))
    }
    return newGrouped
}