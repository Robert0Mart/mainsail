import Vue from 'vue'
import Vuetify from 'vuetify'
import { Touch, Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
    directives: { Touch, Ripple },
})

export default new Vuetify({
   theme: {
        dark: true,
        options: { customProperties: true },
        themes: {
            dark: {
                primary: '#00e5ff',    // Neon Cyan (Cor principal)
                secondary: '#d500f9',  // Neon Purple
                accent: '#ffff00',     // Neon Yellow
                error: '#ff1744',      // Neon Red
                info: '#2979ff',       // Bright Blue
                success: '#00e676',    // Neon Green
                warning: '#ffea00',    // Bright Yellow
            }
        }
    },
    icons: {
        iconfont: 'mdiSvg',
    },
    breakpoint: {
        mobileBreakpoint: 768,
    },
})
