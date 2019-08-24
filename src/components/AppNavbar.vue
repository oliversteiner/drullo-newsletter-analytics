<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <ul class="nav navbar-nav pull-xs-right">


        <!-- Tasks-->
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="">Tasks</i>
          </router-link>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import users from '@/store/modules/users';

@Component
export default class AppNavbar extends Vue {
  get username() {
    return users.username;
  }
}
</script>
