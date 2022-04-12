import ace from 'ace-builds';
import { defineComponent, onMounted, ref, watch } from 'vue';

import styles from './code-editor.module.less';

/**
 * Code 编辑器
 */
export const CodeEditor = defineComponent({
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
  setup(props, { emit }) {
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
      editor.on('change', () => emit('update:value', editor?.getValue()));
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
  },
  render() {
    return <div class={styles.editor} ref='aceRef' />;
  }
});
