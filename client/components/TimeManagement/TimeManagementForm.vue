<!-- Form for changing milestone and time limit (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
    name: 'TimeManagementForm',
    mixins: [BlockForm],
    data() {
        return {
            url: '/api/timemanager',
            method: 'PUT',
            hasBody: true,
            fields: [
                {id: 'milestone', label: 'Milstone', value: ''},
                {id: 'timeLimit', label: 'Time limit', value: ''}
            ],
            title: 'Change milestone and time limit',
            callback: () => {
                const message = 'Successfully changed time management settings!';
                this.$set(this.alerts, message, 'success');
                setTimeout(() => this.$delete(this.alerts, message), 3000);
            }
        };
    }
};
</script>