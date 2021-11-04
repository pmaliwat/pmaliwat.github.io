const SKIP_MODIFIERS = [
    'doubles',
    'crosses',
    'run in place',
    'mummy kicks'
];

const ALTERNATE_EXERCISES = [
    'air squats',
    'high knees',
    'jumping lunges',
    'hand over hand pushups',
    'rear knee lunge + knee drive',
    'pushups',
    'shoulder taps',
    'swimmers',
    'narrow pushups',
    'mountain climbers',
    'toe touches (abs)',
    'high knees',
];

// ORIGINAL TIMES
// const REST_TIME_SECS = 10;
// const SKIP_TIME_SECS = 30;
// const ALT_EXC_TIME_SECS = 30;
// const FULL_REST_TIME_SECS = 30;

const REST_TIME_SECS = 13;
const SKIP_TIME_SECS = 15;
const ALT_EXC_TIME_SECS = 15;
const FULL_XREST_TIME_SECS = 15;

class RoutineGenerator {
    #completeRoutine = [];
    alternateExercises = [...ALTERNATE_EXERCISES]; // clone!

    constructor(config) {
        // TODO: Add config logic
    }

    get totalRoutineTime() {
        let totalRoutineTime = 0;
        for (let i=0; i < this.#completeRoutine.length; i++) {
            totalRoutineTime += this.#completeRoutine[i][1];
        }
    
        totalRoutineTime = totalRoutineTime;
        return totalRoutineTime;
    }

    createRoutine() {
        console.log('CREATED ROUTINE!');

        let fullRest = ['full rest', FULL_XREST_TIME_SECS]
        let completeRoutine = [];

        // TODO: should be a for-loop given the config of how many rounds
        completeRoutine.push(
            ...this.#createSet(),
            ...this.#createSet(),
            ...this.#createSet(), 
            fullRest,
            ...this.#createSet(),
            ...this.#createSet(),
            ...this.#createSet(), 
            fullRest,
            ...this.#createSet(),
            ...this.#createSet(),
            ...this.#createSet(),
            fullRest,
            ...this.#createSet(),
            ...this.#createSet(),
            ...this.#createSet(), 
        );

        return this.#completeRoutine = completeRoutine;
    }

    /**
     * Set includes: 30s skip, 10s rest, 30s alt exercise, 10 rest, 30s skip, 10s rest (2mins)
     * Repeat set 3x (6min)
     */
    #createSet() {
        let set = [];

        set.push(
            ['skip', SKIP_TIME_SECS], 
            ['rest', REST_TIME_SECS],
            [this.#getRandomAltExercise(), ALT_EXC_TIME_SECS],
            ['rest', REST_TIME_SECS],
            ['skip', SKIP_TIME_SECS],
            ['rest', REST_TIME_SECS],
        );
        return set;
    }

    #getRandomAltExercise() {
        let idx = getRandomInt(this.alternateExercises.length);
        let altExercise = this.alternateExercises[idx];
        this.alternateExercises.splice(idx, 1);
        return altExercise;
    }
}