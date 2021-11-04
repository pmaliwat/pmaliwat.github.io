
/* 

FEATURES
x generate random routine
x start button
x pausing
x preview/count up to next exercise
x restart exercise
x beeps for last few seconds
x countdown to start (so routine doesn't start immediately)
- warmup
- progress bar
- responsive design
- cacheing routine (in case something messes up)
- fast forward/rewind
- translations
- better UX
    - buttons are icons
- admin panel
    - regenerate routine
    - hide/display labels
- full exercise list panel
    - highlight current exercise
    - selectable
- countdown verification to real time
- background images
- background music

BUGS
- restart exercise button shouldn't auto start the repeated exercise, it should pause until you hit continue
- replaying during beepy time, the audio doesn't line up
*/

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
    showDevPanel: false,
    isBeepyTime: false,
};

let routine = new RoutineGenerator({foo: 'bar'});


window.onload = function() {
    app = new Vue({ 
        el: '#vue-skip-container', 
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

                let progressPct = getRoutineProgressTime(this.exerciseIndex, this.routine) / routine.totalRoutineTime;
                
                return "width: " + (progressPct * 100) + '%';
            }
        },
        watch: {
            exerciseIndex: _watchExerciseIndex,
            isPaused: _watchIsPaused
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

/**
 * Called when data.isPaused changes.  Begins the next exercise.
 */
 function _watchIsPaused(currentlyPaused, prev) {
    let audioEl = document.getElementsByTagName('audio');
    if (currentlyPaused) {
        if (audioEl && audioEl[0]) {
            audioEl[0].pause();
        }
    } else {
        if (data.isBeepyTime) {
            if (audioEl && audioEl[0]) {
                audioEl[0].play();
            }
        }
    }

}

function initialize() {
    data.routine = routine.createRoutine();
    data.routine.unshift(['Exercise begins in...', 5])
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

        if (data.timer === 4) {
            let audioEl = document.getElementsByTagName('audio');
            if (audioEl && audioEl[0]) {
                audioEl[0].play();
                data.isBeepyTime = true;
            }
        }

        if (data.timer >= 1) {
            countDown();
        } else {
            data.timer = 0;
            console.log('timer complete: ', data.timer);
            data.isBeepyTime = false;
        }
        updateCountdownLabels();
    }, 1000);
}

function updateCountdownLabels() {
    if (data.timer === 0) {
        proceedToNextExercise();
        data.countdownLabel = `COMPLETE!`
    } else {
        data.countdownLabel = `${data.timer}s`;
    }
}

function proceedToNextExercise() {
    data.exerciseIndex++;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRoutineProgressTime(exerciseIndex, routine) {
    let progressTime = 0;
    for(let i=0; i < exerciseIndex; i++) {
        progressTime += routine[i][1];
    }

    return progressTime;
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
