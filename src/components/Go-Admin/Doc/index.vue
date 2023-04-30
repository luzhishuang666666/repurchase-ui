<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'GoAdminDoc',
  data() {
    return {

    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
