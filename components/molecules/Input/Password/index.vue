<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MoleculesInputPassword",
  props: {
    label: {
      type: String,
      default: "Senha",
    },
    value: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: null,
    },
    messageError: {
      type: String,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    linkCta: {
      type: String,
      default: null,
    },
    linkCtaLabel: {
      type: String,
      default: "Clique aqui",
    },
  },
  emits: ["oninput", "onkeyupEnter"],
  data() {
    return {
      passwordVisibility: false,
      inputValue: this.value,
    };
  },
  computed: {
    isMessage() {
      return !!this.message;
    },
    isMessageError() {
      return !!this.messageError;
    },
    messageDefault() {
      if (this.isMessageError) {
        return this.messageError;
      }

      return this.message;
    },
    isActive() {
      return !!this.inputValue;
    },
    iconName() {
      return this.passwordVisibility
        ? "eye"
        : "eye-alt";
    },
    inputType() {
      return this.passwordVisibility ? "text" : "password";
    },
  },
  methods: {
    togglePasswordVisibility() {
      if (this.isDisabled) return;

      this.passwordVisibility = !this.passwordVisibility;
    },
  },
});
</script>

<template>
  <div class="form-common anim-loading">
    <div
      :class="[
        'form-common__label',
        { 'form-common__label--disabled': isDisabled },
        { 'form-common__label--error': isMessageError },
      ]"
    >
      <span>{{ label }}</span>
      <span v-if="linkCta" class="form-common__label--cta">
        <a :href="linkCta" target="_blank" rel="noopener noreferrer">
          {{ linkCtaLabel }}
        </a>
      </span>
    </div>
    <div
      class="form-common__input"
      :class="{
        'form-common__input--error': isMessageError,
        'form-common__input--disabled': isDisabled,
      }"
    >
      <div class="form-common__content">
        <input
          v-model="inputValue"
          :type="inputType"
          :placeholder="label"
          :disabled="isDisabled"
          @input="$emit('oninput', $event.target.value)"
          @keyup.enter="$emit('onkeyupEnter', $event.target.value)"
        />
      </div>
      <div class="form-common__info" @click="togglePasswordVisibility()">
        <AtomsIcon :name="iconName" height="25px" width="25px" />
      </div>
    </div>
    <AtomsTypography
      v-if="isMessage || isMessageError"
      class="form-common__message"
      :class="{
        'form-common__message--error': isMessageError,
        'form-common__message--disabled': isDisabled,
      }"
      type="text-p6"
      weight="regular"
      :text="messageDefault"
    />
  </div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>