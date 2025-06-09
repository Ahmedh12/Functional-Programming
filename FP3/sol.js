const fs = require("fs");

class Either {
    static of(x) {
        return new Right(x);
    }

    map(f) {
        throw new Error("map not implemented");
    }

    chain(f) {
        throw new Error("chain is not implemented")
    }
}

class Right extends Either {
    constructor(value) {
        super();
        this.value = value;
    }

    map(f) {
        return new Right(f(this.value));
    }

    chain(f) {
        return f(this.value)
    }
}

class Left extends Either {
    constructor(value) {
        super();
        this.value = value;
    }

    static of(value) {
        return new Left(value);
    }

    map(f) {
        return this;
    }

    chain(f) {
        return this;
    }
}

class Task {
    constructor(fork) {
        this.fork = fork;
    }

    static of(x) {
        return new Task((rej, res) => res(x));
    }

    static rejected(x) {
        return new Task((rej, res) => rej(x))
    }

    map(f) {
        return new Task((rej, res) => {
            return this.fork(rej, x => res(f(x)))
        })
    }
}

const readFile = filename => {
    return new Task((rej, res) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err)
                rej(new Left(`Error reading file: ${err.message}`))
            else
                res(new Right(data))
        });
    });
}


const convert_to_array = str => str.split("\r\n").map(Number)

file_reader = filename => readFile(filename).map(
    either => either.map(convert_to_array)
)


const get_first_array_entry = arr => {
    if (!Array.isArray(arr))
        return Left.of("The input is not an array")

    if (arr.length === 0)
        return Left.of("The array is empty")


    return Right.of(arr[0])
}

const reciprocal = num => {
    if (typeof num !== 'number' || Number.isNaN(num))
        return Left.of("The first array element is not a number")

    if (num == 0)
        return Left.of("1/0 is undefined")

    return Right.of(1 / num)
}

const reciprocal_of_first_array_entry = arr => get_first_array_entry(arr).chain(reciprocal)


const mainPipeline = filename =>
    file_reader(filename).map(
        either => either.chain(reciprocal_of_first_array_entry)
    );

mainPipeline('numbers.txt').fork(
    err => console.error(err),
    either => console.log(either)
);