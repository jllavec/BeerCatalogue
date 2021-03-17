<template>
  <div class="header">
    <BeerMug class="header__image" />
    <p class="header__title">
      Beer Catalogue
    </p>
  </div>
</template>

<script>
import BeerMug from '../../assets/images/beer-svgrepo-com.svg'
export default {
  name: 'Header',

  components: {
    BeerMug
  }
}
</script>

<style lang="scss" scoped src="./HeaderComponent.scss" />
