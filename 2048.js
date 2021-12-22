function choose_index(choices) {
    return Math.floor(Math.random() * choices.length);
}

function choose(choices) {
    const index = choose_index(choices);
    return choices[index];
}

function copy_matrix(matrix) {
    return matrix.map(function (arr) {
        return arr.slice();
    });
}

function equal_matrices(matrix_a, matrix_b) {
    return matrix_a.every((row, i) => {
        const row_orig = matrix_b[i];
        return row.every((val, j) => val === row_orig[j]);
    });
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
        this.moves = 0;
        for (let i = 0; i < this.n_rows; ++i)
            this.board[i] = new Array(this.n_cols);
    }

    copy() {
        const copy = new Game(this.n_rows, this.n_cols);
        copy.board = copy_matrix(this.board);
        copy.score = this.score;
        copy.moves = this.moves;
        return copy;
    }

    initialize() {
        const empty_indices = this.find_empty_indices();
        const first_index = choose_index(empty_indices);
        const first = empty_indices.splice(first_index, 1)[0];
        const second = choose(empty_indices);
        this.spawn(first);
        this.spawn(second);
    }

    spawn(indices = null, value = null) {
        if (value === null)
            // spawn a new random element (1 out of 10 is 4, otherwise 2)
            value = Math.random() < .9 ? 2 : 4;
        if (indices === null) {
            const empty_indices = this.find_empty_indices();
            indices = choose(empty_indices);
        }
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
        const board_orig = copy_matrix(this.board);
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
                throw `${direction} is not a valid Direction enum!`
        }
        if (equal_matrices(this.board, board_orig))
            return false;
        // otherwise, board has changed
        this.moves += 1;
        return true;
    }

    process_line(line) {
        // line must be ordered such that the first element is the last along the swiped direction
        // e.g. Direction.Right for a row would be 3,2,1,0 and Direction.Left would be 0,1,2,3
        const line_out = new Array(line.length);
        let last_val = null;
        let index = 0;
        for (const val of line) {
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

    print() {
        console.log('Score =', this.score);
        console.log('Moves =', this.moves);
        for (const row of this.board) {
            const row_str = [];
            for (const val of row)
                if (val === undefined)
                    row_str.push('   _');
                else
                    row_str.push(val.toString().padStart(4, ' '));
            console.log(row_str.join(' '));
        }
        console.log();
    }
}

class Solver {
    constructor(game, depth = 5) {
        this.game = game;
        this.depth = depth;
    }

    solve() {

    }

    step(game = null, depth = null, moves=null) {
        if (game === null)
            game = this.game;
        if (depth === null)
            depth = this.depth;
        if (moves === null)
            moves = [];
        if (depth === 0)
            return [[moves, game.score]];
        const results = [];
        for (const direction of [Direction.Up, Direction.Down, Direction.Left, Direction.Right]) {
            const game_copy = game.copy();
            const moves_copy = moves.slice();
            moves_copy.push(direction);
            const changed = game_copy.swipe(direction);
            if (!changed) {
                // score of -1 when invalid move encountered
                results.push([moves_copy, -1]);
                continue;
            }
            const empty_indices = game_copy.find_empty_indices();
            scores[direction]
        }
        return results;
    }
}

function run() {
    const n_rows = 4;
    const n_cols = 4;

    const game = new Game(n_rows, n_cols);
    game.print();

    game.initialize();
    game.print();

    // document.addEventListener('keydown', function(event) {
    //     if(event.keyCode === 37) {
    //         alert('Left was pressed');
    //     }
    //     else if(event.key === 'right') {
    //         alert('Right was pressed');
    //     } else {
    //         console.log(event.key);
    //     }
    // });

    const stdin = process.stdin;
    // without this, we would only get streams once enter is pressed
    stdin.setRawMode(true);
    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function (key) {
        const board_orig = copy_matrix(game.board);
        let direction;
        if (key === '\u0003')
            process.exit();
        else if (key === '\u001b[A')
            direction = Direction.Up;
        else if (key === '\u001b[B')
            direction = Direction.Down;
        else if (key === '\u001b[C')
            direction = Direction.Right;
        else if (key === '\u001b[D')
            direction = Direction.Left;
        else
            return;  // invalid input
        const changed = game.swipe(direction);
        if (changed) {
            game.print();
            game.spawn();
            game.print();
        }
    });
}

run();