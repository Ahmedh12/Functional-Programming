import * as R from 'ramda'

export function add(a, b) {
    return a + b
}
export function isDivisable(n) {
    return x => x % n === 0;
}

export function multiplyBy(n) {
    return x => n * x;
}

export function sum(n) {
    return x => n + x;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

//(Number,Number) -> ([Number]->[Number])
export const multiply_add = (x, y) => arr => R.map(R.compose(sum(y), multiplyBy(x)), arr)

//Number -> ([Number]->[Number])
export const filter_divisable = z => arr => R.filter(isDivisable(z), arr)

//(Number,Number,Number) -> ([Number]->[Number])
export const pipeline_block = (x, y, z) => R.compose(multiply_add(x, y), filter_divisable(z))

//[Number]-> Number
export const Array_sum = arr => R.reduce(add, 0, arr)


const pipeline = (...args) => {
    const blocks = R.splitEvery(3, args)
    blocks.reverse();
    return R.compose(
        Array_sum,
        ...blocks.map(([x,y,z]) => pipeline_block(x,y,z))
    )
}
const output = pipeline(3, 3, 2, 3, 10, -2)(numbers)


console.log("Result of pipeline processing:", output);

