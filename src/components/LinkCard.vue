<script setup lang="ts">
import { inject } from 'vue';
import { Link } from 'src/models/Link';

interface Props {
  link: Link;
}

const globalVars: GlobalVars = inject('globalVars')!!;

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'onLinkClick', link: Link): void;
}>();

/**
 * 友情链接点击事件点击事件
 */
const onLinkClick = () => {
  emit('onLinkClick', props.link);
};
</script>

<template>
  <q-card
    class="link-card pointer"
    :flat="$q.dark.isActive"
    :bordered="$q.dark.isActive"
    @click="onLinkClick"
    :style="{ width: globalVars.isSmallWindow ? '100%' : '' }"
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img v-if="link.logo" :src="link.logo" :alt="link.displayName" />
          <div v-else class="text-logo-div bg-primary">{{ link.displayName[0] }}</div>
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ link.displayName }}</q-item-label>
        <q-item-label caption> {{ link.description }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<style scoped>
.text-logo-div {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  font-size:.8em;
}
</style>
