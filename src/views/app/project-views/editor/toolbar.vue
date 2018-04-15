<template>
  <v-toolbar dense>
    <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
      <div style="width: 150px" class="mr-3" slot="activator">
        <v-select dense flat solo :items="headerSizes" label="Select" single-line :value="header" @input="setValue('header', $event)"></v-select>
      </div>
      <span>Text style</span>
    </v-tooltip>

    <v-btn-toggle class="transparent elevation-0 mr-3">
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn flat :class="activeClass('bold')" @click="toggleBoolean('bold')" slot="activator">
          <v-icon>format_bold</v-icon>
        </v-btn>
        <span>Bold</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn flat :class="activeClass('italic')" @click="toggleBoolean('italic')" slot="activator">
          <v-icon>format_italic</v-icon>
        </v-btn>
        <span>Italic</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn flat :class="activeClass('underline')" @click="toggleBoolean('underline')" slot="activator">
          <v-icon>format_underlined</v-icon>
        </v-btn>
        <span>Underlined</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn flat :class="activeClass('strike')" @click="toggleBoolean('strike')" slot="activator">
          <v-icon>format_strikethrough</v-icon>
        </v-btn>
        <span>Strikethrough</span>
      </v-tooltip>
    </v-btn-toggle>

    <v-btn-toggle class="transparent elevation-0 mr-3">
      <v-menu nudge-top="-36">
        <v-btn flat slot="activator">
          <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
            <v-icon slot="activator" :style="{ 'color': color ? color : '' }">format_color_text</v-icon>
            Text color
          </v-tooltip>
        </v-btn>
        <v-card>
          <kms-color-picker class="elevation-0" style="width: 245px" :value="color" @input="setValue('color', $event.hex)">kek</kms-color-picker>
          <v-card-actions>
            <v-btn block small flat @click="setValue('color', DEFAULT)">Default</v-btn>
            <v-btn block small flat>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-menu nudge-top="-36">
        <v-btn flat slot="activator">
          <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
            <v-icon slot="activator" :style="{ 'color': background ? background : '' }">format_color_fill</v-icon>
            Text background
          </v-tooltip>
        </v-btn>
        <v-card>
          <kms-color-picker class="elevation-0" style="width: 245px" :value="background" @input="setValue('background', $event.hex)">kek</kms-color-picker>
          <v-card-actions>
            <v-btn block small flat @click="setValue('background', DEFAULT)">Default</v-btn>
            <v-btn block small flat>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-btn-toggle>

    <v-btn-toggle class="transparent elevation-0 mr-3">
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat :class="activeClass(list === 'ordered')" @click="setValueOrToggle('list', 'ordered')">
          <v-icon>format_list_numbered</v-icon>
        </v-btn>
        <span>Ordered list</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat :class="activeClass(list === 'bullet')" @click="setValueOrToggle('list', 'bullet')">
          <v-icon>format_list_bulleted</v-icon>
        </v-btn>
        <span>Bulleted list</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat @click="setNumberValue('indent', INDENT_MIN, INDENT_MAX, false)">
          <v-icon>format_indent_decrease</v-icon>
        </v-btn>
        <span>Decrease indent</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat @click="setNumberValue('indent', INDENT_MIN, INDENT_MAX, true)">
          <v-icon>format_indent_increase</v-icon>
        </v-btn>
        <span>Increase indent</span>
      </v-tooltip>
    </v-btn-toggle>

    <v-btn-toggle class="transparent elevation-0 mr-3">
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat @click="setValue('align', DEFAULT)">
          <v-icon>format_align_left</v-icon>
        </v-btn>
        <span>Left</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat :class="activeClass(align === 'center')" @click="setValueOrToggle('align', 'center')">
          <v-icon>format_align_center</v-icon>
        </v-btn>
        <span>Center</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat :class="activeClass(align === 'right')" @click="setValueOrToggle('align', 'right')">
          <v-icon>format_align_right</v-icon>
        </v-btn>
        <span>Right</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat :class="activeClass(align === 'justify')" @click="setValueOrToggle('align', 'justify')">
          <v-icon>format_align_justify</v-icon>
        </v-btn>
        <span>Justify</span>
      </v-tooltip>
    </v-btn-toggle>

    <v-btn-toggle class="transparent elevation-0 mr-3">
      <!-- <v-btn flat>
        <v-icon>insert_link</v-icon>
      </v-btn>
      <v-btn flat>
        <v-icon>insert_photo</v-icon>
      </v-btn> -->
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat :class="activeClass('blockquote')" @click="toggleBoolean('blockquote')">
          <v-icon>format_quote</v-icon>
        </v-btn>
        <span>Quote</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="TOOLTIP_DELAY">
        <v-btn slot="activator" flat :class="activeClass('code-block')" @click="toggleBoolean('code-block')">
          <v-icon>code</v-icon>
        </v-btn>
        <span>Code block</span>
      </v-tooltip>
    </v-btn-toggle>

    <v-btn-toggle class="transparent elevation-0 mr-3">
      <v-btn flat @click="clearFormat">
        <v-icon>format_clear</v-icon>
      </v-btn>
    </v-btn-toggle>

    <slot></slot>
  </v-toolbar>
</template>
<script>
import _ from 'lodash'
import { Compact } from 'vue-color'

const DEFAULT = false
const INDENT_MAX = 8
const INDENT_MIN = 0
const TOOLTIP_DELAY = 600

export default {
  name: 'kms-app-project-editor-toolbar',
  props: {
    'value': {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    'kms-color-picker': Compact
  },
  data: () => ({
    DEFAULT,
    INDENT_MAX,
    INDENT_MIN,
    TOOLTIP_DELAY,

    headerSizes: [
      { text: 'Heading 1', value: 1 },
      { text: 'Heading 2', value: 2 },
      { text: 'Heading 3', value: 3 },
      { text: 'Heading 4', value: 4 },
      { text: 'Heading 5', value: 5 },
      { text: 'Heading 6', value: 6 },
      { text: 'Paragraph', value: false }
    ]
  }),

  computed: {
    bold () {
      return _.has(this.value, 'bold') ? this.value.bold : DEFAULT
    },
    italic () {
      return _.has(this.value, 'italic') ? this.value.italic : DEFAULT
    },
    underline () {
      return _.has(this.value, 'underline') ? this.value.underline : DEFAULT
    },
    strike () {
      return _.has(this.value, 'strike') ? this.value.strike : DEFAULT
    },
    color () {
      return _.has(this.value, 'color') ? this.value.color : DEFAULT
    },
    background () {
      return _.has(this.value, 'background') ? this.value.background : DEFAULT
    },
    list () {
      return _.has(this.value, 'list') ? this.value.list : DEFAULT
    },
    indent () {
      return _.has(this.value, 'indent') ? this.value.indent : DEFAULT
    },
    blockquote () {
      return _.has(this.value, 'blockquote') ? this.value.blockquote : DEFAULT
    },
    align () {
      return _.has(this.value, 'align') ? this.value.align : DEFAULT
    },
    code () {
      return _.has(this.value, 'code') ? this.value.code : DEFAULT
    },
    'code-block' () {
      return _.has(this.value, 'code-block') ? this.value['code-block'] : DEFAULT
    },
    header () {
      return _.has(this.value, 'header') ? this.value.header : DEFAULT
    }
  },

  methods: {
    activeClass (format) {
      return (_.isString(format) && this[format]) || (_.isBoolean(format) && format) ? ['btn--active'] : false
    },
    toggleBoolean (format) {
      this.$emit('input', { format, value: !this[format] })
    },
    setValue (format, value) {
      this.$emit('input', { format, value })
    },
    setValueOrToggle (format, value) {
      this.$emit('input', { format, value: this[format] === value ? DEFAULT : value })
    },
    setNumberValue (format, min = 0, max = 10, increase = null) {
      var value = _.isNumber(this[format]) ? this[format] : min

      if (increase === true && value < max) {
        value++
      } else if (increase === false && value > min) {
        value--
      }

      // Reset value to default if it has minimal value
      value = value === min ? DEFAULT : value

      this.$emit('input', {
        format,
        value
      })
    },
    clearFormat () {
      this.$emit('clearFormat')
    }
  }
}
</script>
<style scoped>
.btn-toggle .btn {
  opacity: 0.8;
}
</style>
