<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MoleculesAvatarIcon",
  props: {
    state: {
      type: String,
      default: "default",
      validator: (value: string) =>
        ["default", "hover", "pressed", "disabled"].includes(value),
    },
    size: {
      type: String,
      default: "small",
      validator: (value: string) => ["small", "extra-small"].includes(value),
    },
    hasNotification: {
      type: Boolean,
      default: true,
    },
    bgColorNotification: {
      type: String,
      default: "var(--succes-colors-500)", // token
    },
    userImage: {
      type: String,
      default: "",
    },
    nameUser: {
      type: String,
      default: "Lorem Ipsum",
    },
    file: {
      type: [Object, Array, String, File],
      default: null,
    },
    accept: {
      type: String,
      default: "image/*",
    },
  },
  emits: ["click", "input"],
  data() {
    return {
      imageSrc: null as string | ArrayBuffer | null,
    };
  },
  computed: {
    userInitials(): string {
      const nameParts = this.nameUser?.split(" ");
      const firstInitial = nameParts[0]?.charAt(0)?.toUpperCase() || "";

      if (nameParts.length >= 2) {
        const secondInitial = nameParts[1]?.charAt(0)?.toUpperCase() || "";
        return `${firstInitial}${secondInitial}`;
      }
      return `${firstInitial}${nameParts[0]?.charAt(1)?.toUpperCase() || ""}`;
    },
  },
  methods: {
    renderImage(file: File) {
      if (file.size > 5242880) return; // 5MB limit
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
        const base64Image = (reader.result as string).split(",")[1];
        this.$emit("input", base64Image);
      };
      reader.readAsDataURL(file);
    },
  },
});
</script>

<template>
  <div class="avatar-wrapper" @click="$emit('click')">
    <input
      ref="inputImage"
      class="input-image"
      type="file"
      hidden
      :accept="accept"
      @input="renderImage(($event.target as HTMLInputElement).files?.[0])"
    />

    <!-- Badge de notificação -->
    <div
      v-if="hasNotification"
      :class="['avatar-notification', size, state]"
      :style="{ backgroundColor: bgColorNotification }"
    />

    <!-- Avatar com imagem -->
    <div v-if="imageSrc || userImage" :class="['avatar', size, state]">
      <div class="avatar-image">
        <img :src="imageSrc || userImage" alt="imagem do usuário" />
      </div>
    </div>

    <!-- Avatar com iniciais -->
    <div v-else :class="['avatar', size, state]">
      <div class="initials">
        <AtomsTypography
          type="text-p4"
          weight="medium"
          :text="userInitials"
          color="var(--white)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "styles.module.scss";
</style>
