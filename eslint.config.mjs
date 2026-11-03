import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['.claude/**', '.agents/**', '.impeccable/**'],
})
