const filterEven = arr => arr.filter( x => x%2 === 0);
const multiplyBy = n => arr => arr.map(x => x * n);
const sumList = arr => arr.reduce((acc, x) => acc + x, 0);
const processPipeline = (arr, fns) => fns.reduce((acc, fn) => fn(acc), arr);


// // Add here all functions to be exposed (for example for testing).
// module.exports ={
//     add
// }

let arr = [1, 2, 3, 4, 5, 6];
let ans = processPipeline(arr, [filterEven, multiplyBy(2.5), sumList]);

console.log(ans); // Output: 28


