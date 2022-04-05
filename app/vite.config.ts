/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { presetAttributify, presetIcons } from 'unocss'
import presetWind from '@unocss/preset-wind'
import { presetTypography } from '@unocss/preset-typography'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),

    // https://github.com/antfu/unocss
    Unocss({
      shortcuts: [
        ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
        ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
        ['dash-divider', 'border-t-1 border-dashed flex-grow height-0 mx-2'],
      ],
      presets: [
        presetWind(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
        }),
        presetTypography(),
      ],
      variants: [
        (matcher) => {
          const match = matcher.match(/my-last-(?<type>even|odd):(?<rest>.+)/)
          if (match === null || match.groups === undefined)
            return matcher
          return {
            matcher: match.groups.rest,
            selector: s => `${s}:nth-last-child(${match.groups!.type})`,
          }
        },
      ],
    }),
  ],

  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
    ],
  },
})
