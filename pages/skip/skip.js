
/* 

FEATURES
x generate random routine
x start button
x pausing
x preview/count up to next exercise
x restart exercise
- progress bar
- beeps for last few seconds
- translations
- better UX
    - buttons are icons
- admin panel
    - regenerate routine
    - hide/display labels
- full exercise list panel
- countdown verification to real time
- background images
- background music

*/

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

const REST_TIME_SECS = 3; // 10
const SKIP_TIME_SECS = 5; // 30
const ALT_EXC_TIME_SECS = 5; // 30
const FULL_REST_TIME_SECS = 5; // 30

let alternateExercises = [...ALTERNATE_EXERCISES]; // clone!

let countdownTimeout;
let totalRoutineTime = 0;

let data = {
    timer: 5,
    countdownLabel: '',
    exerciseLabel: '',
    exercise: "skip",
    exerciseIndex: 0,
    routine: [],
    isPaused: true,
    routineStarted: false,
    progressTime: 0,
    showDevPanel: false
};


window.onload = function() {
    app = new Vue({ 
        el: '#skip-container', 
        data: data,
        computed: {
            startButtonLabel: function() {
                return this.isPaused ? (this.routineStarted ? 'Continue' : 'Start') : 'Pause';
            },
            nextExerciseLabel: function() {
                return 'Up Next: ' + (this.routine[this.exerciseIndex+1] ? this.routine[this.exerciseIndex+1][0] : 'Last exercise!');
            },
            progressBarStyle: function() {
                if (!this.routine || this.routine.length < 1) {
                    return 0;
                }

                let progressPct = getRoutineProgressTime(this.exerciseIndex, this.routine) / getTotalRoutineTime(this.routine);
                
                return "width: " + (progressPct * 100) + '%';
            }
        },
        watch: {
            exerciseIndex: _watchExerciseIndex
        },
        methods: {
            restartExercise: function() {
                if (countdownTimeout) {
                    window.clearTimeout(countdownTimeout);
                }
                this.isPaused = false;
                beginExercise();
            },
            togglePause: function() {
                if (!this.routineStarted) {
                    this.routineStarted = true;
                    this.isPaused = false;
                    beginExercise();
                } else {
                    if (this.isPaused) {
                        this.isPaused = false;
                        countDown();
                    } else {
                        this.isPaused = true;
                        if (countdownTimeout) {
                            window.clearTimeout(countdownTimeout);
                        }
                    }
                }
            },
            toggleDevPanel: function() {
                this.showDevPanel = !this.showDevPanel
            }
        }
    });
    initialize();
};

/**
 * Called when data.exerciseIndex changes.  Begins the next exercise.
 */
function _watchExerciseIndex() {
    console.log('exerciseIndex changed')
    beginExercise();
}

function initialize() {
    data.routine = createRoutine();
}

function beginExercise() {
    if (data.exerciseIndex >= data.routine.length) {
        console.log('No more excercises!');
        data.exerciseLabel = 'COMPLETED WORKOUT!!!';
    } else {
        let exercise = data.routine[data.exerciseIndex];
        data.timer = exercise[1];
        data.exerciseLabel = exercise[0];
        countDown();
    }
}

function countDown() {
    updateCountdownLabels();
    countdownTimeout = window.setTimeout(function() {
        data.timer--;

        if (data.timer >= 1) {
            countDown();
        } else {
            data.timer = 0;
            console.log('timer complete: ', data.timer);
        }
        updateCountdownLabels();
    }, 1000);
}

function updateCountdownLabels() {
    if (data.timer === 0) {
        proceedToNextExercise();
        data.countdownLabel = `COMPLETE!`
    } else if (data.timer <=3) {
        data.countdownLabel = `${data.timer} secs left!`
    } else {
        data.countdownLabel = `${data.timer} secs`;
    }
}

function recalculateProgress() {

}

function proceedToNextExercise() {
    data.exerciseIndex++;
}

function getRandomAltExercise() {
    let idx = getRandomInt(alternateExercises.length);
    let altExercise = alternateExercises[idx];
    alternateExercises.splice(idx, 1);
    return altExercise;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Set includes: 30s skip, 10s rest, 30s alt exercise, 10 rest, 30s skip, 10s rest (2mins)
 * Repeat set 3x (6min)
 */
 function createSet() {
    let set = [];

    set.push(
        ['skip', SKIP_TIME_SECS], 
        ['rest', REST_TIME_SECS],
        [getRandomAltExercise(), ALT_EXC_TIME_SECS],
        ['rest', REST_TIME_SECS],
        ['skip', SKIP_TIME_SECS],
        ['rest', REST_TIME_SECS],
    );
    return set;
}

/**
 * Routine includes 3-4 sets (6 mins x 3 to 4 sets = 18 to 24 mins)
 * @returns 
 */
function createRoutine() {
    let fullRest = ['full rest', FULL_REST_TIME_SECS]
    let completeRoutine = [];

    completeRoutine.push(
        ...createSet(),
        ...createSet(),
        ...createSet(), 
        fullRest,
        ...createSet(),
        ...createSet(),
        ...createSet(), 
        fullRest,
        ...createSet(),
        ...createSet(),
        ...createSet(),
        fullRest,
        ...createSet(),
        ...createSet(),
        ...createSet(), 
    );

    getTotalRoutineTime(completeRoutine);

    return completeRoutine;
}

function getRoutineProgressTime(exerciseIndex, routine) {
    let progressTime = 0;
    for(let i=0; i < exerciseIndex; i++) {
        progressTime += routine[i][1];
    }

    return progressTime;
}

function getTotalRoutineTime(routine) {
    if (totalRoutineTime > 0) {
        return totalRoutineTime;
    }

    let time = 0;
    for (let i=0; i < routine.length; i++) {
        time += routine[i][1];
    }

    totalRoutineTime = time;
    return totalRoutineTime;
}

/*
https://www.youtube.com/watch?v=TeThU_Xyl0c&t=21s
1m skip freestyle
30s airsquats
1m jump run in place
30s high knees
1m skip freestyle
30s jumping lunges
1m skip mummy kicks
30s hand over hand pushups
*/


/*

https://www.youtube.com/watch?v=D9UxBKoPC7s

pattern: 30s skip, 10s rest, 20s alt exercise

30s skip
10s rest
20s pop air squats (1m)
rest 10s 
30s skip
rest 10s (50s)

x3 = 5m30s

rear knee lunge + knee drive
pushups
shoulder taps
swimmers
narrow pushups
mountain climbers
toe touches
high knees
*/
