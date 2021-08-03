<template>
  <div :class="$style.editor" ref="aceRef" />
</template>

<script lang="ts">
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-textmate';
//import 'ace-builds/src-noconflict/theme-solarized_light';
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'CodeEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'javascript'
    },
    theme: {
      tyle: String,
      default: 'textmate'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:value'],
  setup(props, context) {
    const aceRef = ref<HTMLElement>(null);

    let editor = null;

    onMounted(() => {
      editor = ace.edit(aceRef.value, {
        maxLines: Infinity,
        useWorker: false,
        mode: `ace/mode/${props.language}`,
        theme: `ace/theme/${props.theme}`,
        value: props.value,
        readOnly: props.readonly,
        fontSize: 12,
        tabSize: 2
      });
      editor.on('change', () => context.emit('update:value', editor?.getValue()));
    });

    watch(
      () => props.value,
      (val) => {
        if (editor) {
          const currentPosition = editor?.selection.getCursor();
          editor.setValue(val);
          editor.clearSelection();
          editor.gotoLine(currentPosition.row + 1, currentPosition.column, true);
        }
      }
    );

    return {
      aceRef
    };
  }
});
</script>

<style lang="scss" module>
.editor {
  width: 100%;
  min-height: 350px;
}
</style>
