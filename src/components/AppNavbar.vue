<template>
    <nav class="navbar">
        <ul class="navbar nav">
            <!-- Tasks-->
            <li class="nav-item">
                <router-link to="/" exact class="nav-link">
                    <i class="">Tasks</i>
                </router-link>
            </li>

            <!-- Analytics-->
            <li class="nav-item">
                <router-link to="/analytics" class="nav-link">
                    <i class="">Analytics</i>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
  import {Vue, Component} from 'vue-property-decorator'
  import users from '@/store/modules/users'

  @Component
  export default class AppNavbar extends Vue {
    get username () {
      return users.username
    }
  }
</script>

<style lang="scss">
    ul.navbar {
        list-style-type: none;
        margin: 0;
        padding: 0;

        li {
            margin: 5px;
            padding: 5px;
            display: inline-block;
        }
    }

    .navbar nav {

    }

    .router-link-active {
        font-weight: bold;
    }

</style>
