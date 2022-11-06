<!-- Component that displays the duration of the current session -->

<template>
    <span>{{ hours > 0 ? hours + ':' : ''}}{{ minutes < 10 ? '0' + minutes : minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</span>
</template>

<script>
export default {
    name: 'SessionDuration',
    props:{
        date: {
            required: true
        }
    },
    data: function() {
        return {
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
        }
    }
}
</script>

<style scoped>

</style>