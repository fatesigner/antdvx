/**
 * store
 */

import { createStore } from 'antdvx/helpers';

const _dampingCoefficient = 0.9066;
const _duration = 1000;
const _intervalTime = 100;
let _speed: number;
let _interval: any;
let _timeout: any;

export const ProgressBarStore = createStore(
  {
    percent: 0,
    show: false,
    height: '3px',
    color: 'darkorange'
  },
  function (state) {
    const dismiss = () => {
      if (state.show) {
        if (_interval) {
          clearInterval(_interval);
          _interval = null;
        }
        // 立即设置进度到完成
        state.percent = 100;
        setTimeout(() => {
          state.show = false;
          setTimeout(() => {
            state.percent = 0;
          }, 200);
        }, 200);
      } else {
        if (_timeout) {
          clearTimeout(_timeout);
          _timeout = null;
        }
      }
    };

    const present = () => {
      if (_timeout) {
        clearTimeout(_timeout);
        _timeout = null;
      }
      _timeout = setTimeout(() => {
        state.show = true;
        if (_interval) {
          clearInterval(_interval);
          state.percent = 0;
        }
        _speed = 100 / (_duration / _intervalTime);
        _interval = setInterval(() => {
          _speed = parseFloat((_speed * _dampingCoefficient).toFixed(6));
          state.percent = state.percent + _speed;
          if (state.percent >= 100) {
            dismiss();
          }
        }, _intervalTime);
      }, 100);
    };

    const update = (payload) => {
      state = Object.assign({}, state, payload);
    };

    return {
      present,
      dismiss,
      update
    };
  }
);
