<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account Management</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
      <LogoutForm />
      <DeleteAccountForm />
    </section>
    <section>
      <header>
        <h2>Time Management</h2>
      </header>
      <TimeManagementForm />
      <FeedForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import TimeManagementForm from '@/components/TimeManagement/TimeManagementForm.vue';
import FeedForm from '@/components/Feed/FeedForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    TimeManagementForm,
    FeedForm
  }
};
</script>
