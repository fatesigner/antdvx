/**
 * events
 * 全局事件
 */

import { createEvent, createReplayEvent } from 'rx-event-hub';

import { IUser } from '@/app/types/user';
import { ROLES } from '@/app/core/constants';

/**
 * 用户登录事件
 */
export const login$ = createReplayEvent<IUser<typeof ROLES.keys>>();

/**
 * 用户退出事件
 */
export const logout$ = createEvent<{ expired: boolean; message: string }>();

/**
 * 角色切换事件
 */
export const roleChanged$ = createReplayEvent<keyof typeof ROLES.enum>();
