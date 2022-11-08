<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in or Register
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section v-if="$store.state.username">
      <header>
        <div class="left">
          <h2 v-if="$store.state.isRecommendedEnabled">
            Your Feed (includes Recommended Content)
            <!-- <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span> -->
          </h2>
          <h2 v-else>
            Your Feed (without Recommended Content)
          </h2>
        </div>
        <!-- <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div> -->
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
          :refreshFreets="refreshFreets"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm},
  data() {
    return {
      followedUsers: []
    }
  },
  mounted() {
    //collect followed users
    
    fetch('/api/follows').then(res => res.json()).then(res => {
      this.$store.commit('setFollowedUsers', res.map(el => el.followingId));
    });
    //this.allFreets();
    this.generateRecommendedFreets();
    this.refreshFreets();
  },
  methods: {
    refreshFreets() {
      fetch('/api/freets').then(res => res.json()).then(res => {
        const newFreets = res.filter(el => {
          if (this.$store.state.isRecommendedEnabled) {
            return this.$store.state.followedUsers.includes(el.author) ||
              el.author === this.$store.state.username ||
              this.$store.state.recommendedFreets.includes(el._id);
          } else {
            return this.$store.state.followedUsers.includes(el.author) ||
              el.author === this.$store.state.username;
          }
        });
        this.$store.commit('setFreets', newFreets);
      });
    },
    allFreets() {
      fetch('/api/freets').then(res => res.json()).then(res => {
        this.$store.commit('setFreets', res);
      });
    },
    generateRecommendedFreets() {
      //recommendation alg: the most recent half of all Freets
      fetch('/api/freets').then(res => res.json()).then(res => {
        const newRecommendedFreets = res.map(el => el._id).slice(0, Math.floor(res.length / 2));
        this.$store.commit('setRecommendedFreets', newRecommendedFreets);
      });
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
