function choose(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function choose_index(choices) {
    return Math.floor(Math.random() * choices.length);
}

// Direction enum
const Direction = {
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4,
}

class Game {
    constructor(n_rows, n_cols) {
        this.n_rows = n_rows;
        this.n_cols = n_cols;
        this.board = new Array(this.n_rows)
        this.score = 0;
        // console.log('yote', this.board);
        for (let i = 0; i < this.n_rows; ++i) {
            // this.board[i] = [];
            // console.log('A', this.board[i]);
            this.board[i] = new Array(this.n_cols);
            // for (let j = 0; j < this.n_cols; ++j) {
            //     console.log('J', i, j, this.board);
            //     this.board[i][j] = null;
            // }
            // console.log('B', this.board[i]);
        }
        // console.log('yeet', this.board);
        console.log('yeet', JSON.parse(JSON.stringify(this.board)));
    }

    initialize() {
        const empty_indices = this.find_empty_indices();
        const first_index = choose_index(empty_indices);
        const first = empty_indices.splice(first_index, 1)[0];
        const second = choose(empty_indices);
        console.log('first ', first);
        console.log('second ', second);
        this.spawn(first);
        this.spawn(second);
    }

    spawn(indices = null, value = null) {
        if (value === null)
            // spawn a new random element (1 out of 10 is 4, otherwise 2)
            value = Math.random() < .9 ? 2 : 4;
        console.log('x', indices);
        if (indices === null) {
            const empty_indices = this.find_empty_indices();
            let indices = choose(empty_indices);
            console.log('y', indices, empty_indices);
        }
        console.log('z', indices);
        this.board[indices[0]][indices[1]] = value;
    }

    find_empty_indices() {
        const empty_indices = [];
        for (let i = 0; i < this.n_rows; ++i)
            for (let j = 0; j < this.n_cols; ++j)
                if (this.board[i][j] === undefined)
                    empty_indices.push([i, j]);
        return empty_indices;
    }

    swipe(direction) {
        switch (direction) {
            case Direction.Up:
            case Direction.Down:
                // iterate over columns
                for (let j = 0; j < this.n_cols; ++j) {
                    const line = [];
                    for (let i = 0; i < this.n_rows; ++i)
                        if (direction === Direction.Up)
                            line[i] = this.board[i][j];
                        else
                            line[i] = this.board[this.n_rows - 1 - i][j];
                    const line_processed = this.process_line(line);
                    for (let i = 0; i < this.n_rows; ++i)
                        if (direction === Direction.Up)
                            this.board[i][j] = line_processed[i];
                        else
                            this.board[this.n_rows - 1 - i][j] = line_processed[i];
                }
                break;
            case Direction.Left:
            case Direction.Right:
                // iterate over rows
                for (let i = 0; i < this.n_rows; ++i) {
                    let line = this.board[i];
                    if (direction === Direction.Right) {
                        line = [...line]; // copy
                        line.reverse();
                    }
                    let line_processed = this.process_line(line);
                    if (direction === Direction.Right)
                        line_processed.reverse();
                    this.board[i] = line_processed;
                }
                break;
            default:
                throw `${direction} is not a valid Direction enum!'`
        }
    }

    process_line(line) {
        // line must be ordered such that the first element is the last along the swiped direction
        // e.g. Direction.Right for a row would be 3,2,1,0 and Direction.Left would be 0,1,2,3
        const line_out = [];
        let last_val = null;
        let index = 0;
        for (const val in line) {
            if (val === undefined)
                continue
            if (last_val === val) {
                line_out[index - 1] += val;
                this.score += val + val;
                last_val = null;
            } else {
                line_out[index++] = val;
                last_val = val;
            }
        }
        return line_out;
    }
}

// async function run() {
//     const n_rows = 4;
//     const n_cols = 4;
//
//     await console.log('P');
//     const game = await new Game(n_rows, n_cols);
//     await console.log('board', game.board);
//     await console.log('score', game.score);
//
//     await console.log('A');
//     await game.initialize();
//     await console.log('board', game.board);
//     await console.log('score', game.score);
//
//     await console.log('B');
//     await game.swipe(Direction.Down);
//     await game.spawn();
//     await console.log('board', game.board);
//     await console.log('score', game.score);
//
//     await console.log('C');
//     await game.swipe(Direction.Up);
//     await game.spawn();
//     await console.log('board', game.board);
//     await console.log('score', game.score);
//
//     await console.log('D');
//     await game.swipe(Direction.Right);
//     await game.spawn();
//     await console.log('board', game.board);
//     await console.log('score', game.score);
//
//     await console.log('E');
//     await game.swipe(Direction.Left);
//     await game.spawn();
//     await console.log('board', game.board);
//     await console.log('score', game.score);
// }
//
// (async () => {
//     await run().then(() => {
//         console.log('Done!');
//     });
// })();

function run() {
    const n_rows = 4;
    const n_cols = 4;

    console.log('P');
    const game = new Game(n_rows, n_cols);
    console.log('board', game.board);
    console.log('score', game.score);

    console.log('A');
    game.initialize();
    console.log('board', game.board);
    console.log('score', game.score);

    console.log('B');
    game.swipe(Direction.Down);
    // game.spawn();
    console.log('board', game.board);
    console.log('score', game.score);

    // console.log('C');
    // game.swipe(Direction.Up);
    // game.spawn();
    // console.log('board', game.board);
    // console.log('score', game.score);
    //
    // console.log('D');
    // game.swipe(Direction.Right);
    // game.spawn();
    // console.log('board', game.board);
    // console.log('score', game.score);
    //
    // console.log('E');
    // game.swipe(Direction.Left);
    // game.spawn();
    // console.log('board', game.board);
    // console.log('score', game.score);
}

run();