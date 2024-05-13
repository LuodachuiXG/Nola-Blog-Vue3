<script setup lang="ts">
import { inject } from 'vue';
import { Diary } from 'src/models/Diary';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { formatTime } from '../utils/Utils';

interface Props {
  diary: Diary;
}

const globalVars: GlobalVars = inject('globalVars')!!;

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'onDiaryClick', diary: Diary): void;
}>();

/**
 * 日志点击事件
 */
const onPostClick = () => {
  emit('onDiaryClick', props.diary);
};
</script>

<template>
  <q-card
    :flat="$q.dark.isActive"
    :bordered="$q.dark.isActive"
    style="height: 280px;"
    :style="{ width: globalVars.isSmallWindow ? '100%' : '350px' }"
  >
    <q-card-section>
      <div class="text-grey text-caption" style="margin-left: 20px;margin-bottom: 10px">
        {{ formatTime(diary.createTime) }}
      </div>
      <q-scroll-area class="diary-area">
        <MdPreview
          class="md-preview"
          :modelValue="diary.content"
          preview-theme="default"
          :theme="$q.dark.isActive ? 'dark' : 'light'"
        />
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.md-preview {
  width: 100%;
}

.diary-area {
  height: 210px;
}
</style>
