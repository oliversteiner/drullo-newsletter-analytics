<template>
  <div class="app-navbar">
    <div class="">
      <nav class="navbar">
        <ul class="navbar nav">
          <!-- Tasks-->
          <li class="nav-item">
            <router-link to="/" exact class="nav-link">
              <i class="">{{ $t('Tasks') }}</i>
            </router-link>
          </li>

          <!-- Analytics-->
          <li class="nav-item">
            <router-link to="/analytics" class="nav-link">
              <i class="">{{ $t('Analytics') }}</i>
            </router-link>

            <!-- Subscribers-->
          </li>

          <li class="nav-item">
            <router-link to="/subscribers" class="nav-link">
              <i class="">{{ $t('Subscribers') }}</i>
            </router-link>
          </li>
          <!-- Developer-->
          <li class="nav-item">
            <router-link to="/develop" class="nav-link">
              <i class="">{{ $t('Development') }}</i>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import users from '@/store/modules/UsersModule'

@Component
export default class AppNavbar extends Vue {
  get username() {
    return users.username
  }
}
</script>

<style lang="scss">
.app-navbar {
  .fixed-header {
    position: fixed;
    // fixing the position takes it out of html flow - knows
    // nothing about where to locate itself except by browser
    // coordinates
    left: 0; // top left corner should start at leftmost spot
    top: 0; // top left corner should start at topmost spot
    width: 100vw; // take up the full browser width
    z-index: 300; // high z index so other content scrolls underneath
    height: 50px; // define height for content
    background-color: #3e3e3e;
  }

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

  .router-link-active {
    font-weight: bold;
  }
}
</style>
