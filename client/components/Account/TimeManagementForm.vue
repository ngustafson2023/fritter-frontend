<!-- Form for setting time manager -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'TimeManagementForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/timemanager',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'milestone', label: 'Set frequency (mins) to emphasize session duration', value: '30'},
        {id: 'timeLimit', label: 'Set time limit', value: '60'}
      ],
      title: 'Time Management',
      callback: () => {
        const message = 'Successfully set time management preferences!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
