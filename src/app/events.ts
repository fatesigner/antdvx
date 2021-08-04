/**
 * events
 * 全局事件
 */

import { createEvent, createReplayEvent } from 'rx-event-hub';

import { IUser } from '@/types/user';
import { ROLES } from '@/app/constants';

// 用户登录
export const login$ = createReplayEvent<IUser<typeof ROLES.keys>>();

// 用户退出
export const logout$ = createEvent<{ expired: boolean; message: string }>();

// 角色切换
export const roleChanged$ = createReplayEvent<keyof typeof ROLES.enum>();
