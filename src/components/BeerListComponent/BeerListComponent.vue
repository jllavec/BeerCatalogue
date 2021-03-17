<template>
  <div
    class="beer-list"
  >
    <div class="beer-list__display-selector">
      <ButtonComponent
        class="button beer-list__gallery-trigger"
        :label="gallery ? 'Show List' : 'Show Gallery'"
        @click.native="changeDisplayMode"
      />
      <ButtonComponent
        :label="favShow ? 'Hide Favs' : 'Show Favs'"
        class="button"
        @click.native="showFavs"
      />
    </div>
    <ul :class="{ 'beer-list--gallery': gallery }">
      <li
        v-for="(beer, index) in beerList"
        :key="`beer-${index}`"
        class="beer-list__element"
        @click="showDetail(beer)"
      >
        <p class="beer-list__element-title">
          Name: {{ beer.name }}
        </p>
        <p>
          Tagline: {{ beer.tagline }}
        </p>
        <p>
          {{ beer.first_brewed }}
        </p>
        <p class="beer-list__element-emoji">
          {{ alcoholEmoji(beer) }}
        </p>
        <Star
          class="beer-list__element-fav"
          :class="{'beer-list__element-fav--selected': beer.isFav}"
          @click.stop="setFav(beer)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { alcoholEmoji } from '../../helpers'

import Star from '../../assets/images/Five-pointed_star.svg'

import ButtonComponent from '../ButtonComponent/ButtonComponent'

export default {
  name: 'BeerList',

  components: {
    ButtonComponent,
    Star
  },

  props: {
    beerList: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      search: '',
      gallery: false,
      favShow: false
    }
  },

  methods: {
    alcoholEmoji,
    changeDisplayMode () {
      this.gallery = !this.gallery
    },
    showDetail (element) {
      this.$emit('displayModal', element)
    },
    setFav (beer) {
      this.$emit('setFav', beer)
    },
    showFavs () {
      this.favShow = !this.favShow
      this.$emit('hidePaginator', this.favShow)
    }
  }
}
</script>

<style lang="scss" scoped src="./BeerListComponent.scss"  />
