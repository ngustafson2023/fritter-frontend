<!-- Component that displays the duration of the current session -->

<template>
    <span class="duration" v-bind:class="{emphasized: isEmphasized}">Session Duration: {{ hours > 0 ? hours + ':' : ''}}{{ minutes < 10 ? '0' + minutes : minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</span>
</template>

<script>
export default {
    name: 'SessionDuration',
    props:{
        date: {
            required: true
        },
        timeLimit: {
            required: true
        },
        milestone: {
            required: true
        }
    },
    data: function() {
        return {
            isEmphasized: false,
            interval: null,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            intervals: {
                second: 1000,
                minute: 1000 * 60,
                hour: 1000 * 60 * 60,
                day: 1000 * 60 * 60 * 24
            }
        }
    },
    mounted() {
        this.interval = setInterval(() => {
            if (this.date) {
                this.updateDiffs();
            } else {
                this.clearDiffs();
            }
            if (this.timeLimit) {
                this.checkTimeLimit();
            }
            if (this.milestone) {
                this.checkEmphasis();
            }

        }, 1000);
    },
    destroyed() {
        clearInterval(this.interval);
    },
    methods: {
        updateDiffs() {
            const dateObj = new Date(this.date);
            let diff = Math.abs(Date.now() - dateObj.getTime());
            this.days = Math.floor(diff / this.intervals.day);
            diff -= this.days * this.intervals.day;
            this.hours = Math.floor(diff / this.intervals.hour);
            diff -= this.hours * this.intervals.hour;
            this.minutes = Math.floor(diff / this.intervals.minute);
            diff -= this.minutes * this.intervals.minute;
            this.seconds = Math.floor(diff / this.intervals.second);
        },
        clearDiffs() {
            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
        },
        checkTimeLimit() {
            const totalMinutes = (this.days * 24 * 60) + (this.hours * 60) + this.minutes;
            if (parseInt(this.timeLimit) === totalMinutes) {
                this.$store.commit('alert', {
                    message: 'Time limit reached', status: 'error'
                });
                fetch('/api/users/session', {method: 'DELETE'}).then(res => {
                    this.$store.commit('setSessionStartTime', null);
                    this.$store.commit('setUsername', null);
                    this.$router.push({name: 'Login'});
                });
            }
        },
        checkEmphasis(){
            const totalMinutes = (this.days * 24 * 60) + (this.hours * 60) + this.minutes;
            if (this.milestone && totalMinutes % this.milestone === 0 && this.seconds === 0) {
                // start emphasis interval
                this.isEmphasized = true;
            } else if (this.milestone && totalMinutes % this.milestone === 0 && this.seconds === 3) {
                // end emphasis interval
                this.isEmphasized = false;
            }
        }
    }
}
</script>

<style scoped>
.emphasized {
    color: green;
}

span {
    font-size: larger;
    font-weight: bold;
}
</style>