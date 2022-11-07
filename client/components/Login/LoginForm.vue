<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      setSessionStartTime: true,
      newSessionStartTime: new Date(),
      fields: [
        { id: 'username', label: 'Username', value: '' },
        { id: 'password', label: 'Password', value: '' }
      ],
      title: 'Sign in',
      callback: () => {
        this.$router.push({ name: 'Home' });
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
        try {
          const exists = fetch('/api/timemanager').then(res => {
            if (!res.ok) {
              throw new Error(); // time manager does not exist
            }
            return res.json()
          }).then(res => {
            if (res.timeLimitEnabled === 'true') {
              this.$store.commit('setTimeLimit', parseInt(res.timeLimit));
            } else {
              this.$store.commit('setTimeLimit', null);
            }

            if (res.milestoneEnabled === 'true') {
              this.$store.commit('setMilestone', parseInt(res.milestone));
            } else {
              this.$store.commit('setMilestone', null);
            }
          });
        } catch (e) {
          this.$store.commit('setTimeLimit', null);
          this.$store.commit('setMilestone', null);
        }
      }
    };
  }
};
</script>
