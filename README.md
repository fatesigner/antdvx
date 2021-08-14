# antdvx

[![npm][npm-image]][npm-url]
[![download][download-image]][download-url]
[![commitizen][commitizen-image]][commitizen-url]

[npm-image]: https://img.shields.io/npm/v/antdvx.svg?style=for-the-badge
[npm-url]: https://npmjs.com/package/antdvx
[download-image]: https://img.shields.io/npm/dw/antdvx.svg?style=for-the-badge&color=green
[download-url]: https://npmjs.com/package/antdvx
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-green.svg?style=for-the-badge
[commitizen-url]: http://commitizen.github.io/cz-cli/

### ant design + typescript + vue3
> 基于 ant design vue 的 Vue3 组件库，包含一些通用模板和服务。

## 安装

```bash
npm i -S antdvx
```

## 示例 [online](https://fatesigner.github.io/antdvx/example/)
```vue
<template>
  <XButton size="small" @click="onClick">button</XButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { XButton } from 'antdvx/components/button';

export default defineComponent({
  components: { XButton },
  setup(){
    const onClick = () => {
      console.log('button click.');
    };
    
    return {
      onClick
    };
  }
});
</script>
```

## 详细文档，待完善...
