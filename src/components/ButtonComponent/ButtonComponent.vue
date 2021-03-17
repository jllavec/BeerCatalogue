<template>
  <button
    class="button"
    :disabled="disabled"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'ButtonComponent',

  props: {
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped src="./ButtonComponent.scss"  />
