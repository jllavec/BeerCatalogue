<template>
  <div
    class="modal"
    role="dialog"
  >
    <div
      class="modal__backdrop"
      @click="closeModal"
    />
    <div class="modal__dialog">
      <div class="detail">
        <h1 class="detail__title">
          {{ beer.name }}
        </h1>
        <img
          v-if="beer.image_url"
          class="detail__image"
          :src="beer.image_url"
        >
        <p>
          {{ beer.description }}
        </p>
        <p>
          Tagline: {{ beer.tagline }}
        </p>
        <p>
          First Brewed: {{ beer.first_brewed }}
        </p>
        <p>
          Alcohol: {{ alcoholEmoji(beer) }}
        </p>
        <p>Ingredients: {{ reduceIngredients(beer.ingredients) }}</p>
        <p>Food Pairing:</p>
        <ul class="detail__list">
          <li
            v-for="(food, index) in beer.food_pairing"
            :key="`beer-food-${index}`"
          >
            {{ food }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { alcoholEmoji } from '../../helpers'

export default {
  name: 'Modal',

  props: {
    beer: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    alcoholEmoji,
    closeModal () {
      this.$emit('closeModal')
    },
    reduceIngredients (ingredients) {
      const ingKeys = Object.keys(ingredients)
      const ingMap = ingKeys.map((elem) => ingredients[elem])
      return ingMap.reduce((target, elem) => {
        if (typeof elem === 'string') return target.length === 0 ? elem : `${target} // ${elem}`
        const str = elem.reduce((acc, elemIn) => {
          const ing = `${elemIn.name} (${elemIn.amount.value} ${elemIn.amount.unit})`
          return acc.length === 0 ? ing : `${acc} // ${ing}`
        }, '')

        return target.length === 0 ? str : `${target} // ${str}`
      }, '')
    }
  }
}
</script>

<style lang="scss" scoped src="./ModalComponent.scss" />
