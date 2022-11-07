<!-- Form for setting milestone and time limit (block style) -->

<template>
    <form @submit.prevent="submit">
        <h3>{{ title }}</h3>
        <article v-if="fields.length">
            <p>Enable Time Limit?</p>
            <label class="switch">
                <input type="checkbox" v-model="isEnabled">
                <span class="slider"></span>
            </label>
            <p>{{ $store.state.timeLimit }}</p>
            <div v-for="field in fields" :key="field.id">
                <label :for="field.id">{{ field.label }}:</label>
                <textarea v-if="field.id === 'content'" :name="field.id" :value="field.value"
                    @input="field.value = $event.target.value" />
                <input v-else :type="field.id === 'password' ? 'password' : 'text'" :name="field.id"
                    :value="field.value" @input="field.value = $event.target.value">
            </div>
        </article>
        <article v-else>
            <p>{{ content }}</p>
        </article>
        <button type="submit">
            {{ title }}
        </button>
        <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </form>
</template>

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
    name: 'TimeManagementForm',
    data() {
        return {
            isEnabled: false,
            url: '/api/timemanager',
            method: 'PUT',
            hasBody: true,
            fields: [
                { id: 'milestone', label: 'Milestone', value: '' },
                { id: 'timeLimit', label: 'Time limit', value: '' }
            ],
            title: 'Set milestone and time limit',
            alerts: {}, // Displays success/error messages encountered during form submission
            callback: () => {
                const message = 'Successfully changed time management settings!';
                this.$set(this.alerts, message, 'success');
                setTimeout(() => this.$delete(this.alerts, message), 3000);
                fetch('/api/timemanager').then(res => res.json()).then(res => {
                    if (res.isEnabled === 'true') {
                        this.$store.commit('setTimeLimit', parseInt(res.timeLimit));
                     } else {
                        this.$store.commit('setTimeLimit', null);
                    }
                });
            }
        };
    },
    
    methods: {
        async submit() {
            /**
              * Submits a form with the specified options from data().
              */
            const options = {
                method: this.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin' // Sends express-session credentials with request
            };
            if (this.hasBody) {
                const fieldsMap = this.fields.map(field => {
                        const { id, value } = field;
                        field.value = '';
                        return [id, value];
                });
                fieldsMap.push(['isEnabled', this.isEnabled.toString()]);
                options.body = JSON.stringify(Object.fromEntries(fieldsMap));
            }

            try {
                const exists = await fetch('/api/timemanager');
                if (!exists.ok) {
                    throw new Error(); // time manager does not exist, create new one
                }
            } catch(e) {
                options.method = 'POST';
            }

            try {
                const r = await fetch(this.url, options);
                if (!r.ok) {
                    // If response is not okay, we throw an error and enter the catch block
                    const res = await r.json();
                    throw new Error(res.error);
                }
                if (this.callback) {
                    this.callback();
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}

/* Following CSS from W3 Schools https://www.w3schools.com/howto/howto_css_switch.asp */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}
</style>