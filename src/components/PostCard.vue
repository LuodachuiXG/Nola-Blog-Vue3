<script setup lang="ts">
import { Post } from 'src/models/Post';
import { Tag } from 'src/models/Tag';
import { Category } from 'src/models/Category';
import { formatTime, getActualUrl } from 'src/utils/Utils';
import { inject } from 'vue';

interface Props {
  post: Post;
}

const globalVars: GlobalVars = inject('globalVars')!!;

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'onPostClick', post: Post): void;
  (e: 'onTagClick', tag: Tag): void;
  (e: 'onCategoryClick', category: Category): void;
}>();

/**
 * 文章点击事件
 */
const onPostClick = () => {
  emit('onPostClick', props.post);
};

/**
 * 分类点击事件
 * @param category 分类
 */
const onCategoryClick = (category: Category) => {
  emit('onCategoryClick', category);
};

/**
 * 标签点击事件
 * @param tag 标签
 */
const onTagClick = (tag: Tag) => {
  emit('onTagClick', tag);
};
</script>

<template>
  <q-card
    class="post-card"
    :flat="$q.dark.isActive"
    :bordered="$q.dark.isActive"
    style="height: 350px"
    :style="{ width: globalVars.isSmallWindow ? '100%' : '240px' }"
  >
    <q-img
      @click="onPostClick"
      class="pointer post-cover"
      v-if="
        post.cover ||
        (!post.cover &&
          post.category &&
          post.category.unifiedCover &&
          post.category.cover)
      "
      :src="getActualUrl(post.cover ? post.cover : post.category?.cover!!)"
      style="height: 180px"
      fit="cover"
    />

    <q-card-section>
      <div class="post-info-div">
        <div class="post-create-time text-grey text-caption">
          {{ formatTime(post.createTime)}}
        </div>
      </div>
      <div class="text-h6 q-mb-xs pointer" @click="onPostClick">
        <q-icon
          name="keyboard_double_arrow_up"
          v-if="post.pinned"
          style="margin-top: -2px"
          color="red"
        />
        <q-icon name="lock" v-if="post.encrypted" style="margin-top: -2px" />
        {{ post.title }}
      </div>
      <div class="text-caption text-grey excerpt">
        {{ post.encrypted ? '这是一篇加密文章' : post.excerpt }}
      </div>
    </q-card-section>
    <q-card-section
      style="position: absolute; bottom: 0; width: 100%"
      v-if="post.category || post.tags.length > 0"
    >
      <q-scroll-area class="post-category-area">
        <div class="row no-wrap">
          <q-chip
            square
            class="pointer"
            v-if="post.category"
            @click="onCategoryClick(post.category)"
          >
            <q-avatar icon="book" color="primary" text-color="white" />
            <span style="margin-left: 5px">{{
              post.category.displayName
            }}</span>
          </q-chip>
          <q-chip
            class="pointer"
            square
            color="primary"
            text-color="white"
            icon="bookmark"
            v-for="(tag, index) in post.tags"
            :key="index"
            @click="onTagClick(tag)"
          >
            {{ tag.displayName }}
          </q-chip>
        </div>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.post-card:hover .post-cover:deep(img) {
  transform: scale(1.1) rotate(1deg);
  filter: brightness(1.1);
}

.post-cover:deep(img) {
  transition: all 0.4s ease-in-out;
}

.excerpt {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.post-category-area {
  height: 40px;
  max-width: 1000px;
  margin-left: -5px;
}

.post-info-div {
  text-align: left;
}
</style>
