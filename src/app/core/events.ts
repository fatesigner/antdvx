/**
 * events
 * 全局事件
 */

import { createEvent, createReplayEvent } from 'rx-event-hub';

import { RoleType, UserType } from '@/app/core/types';

/**
 * 用户登录事件
 */
export const login$ = createReplayEvent<UserType>();

/**
 * 用户退出事件
 */
export const logout$ = createEvent<{ expired: boolean; message: string }>();

/**
 * 角色切换事件
 */
export const roleChanged$ = createReplayEvent<RoleType>();
