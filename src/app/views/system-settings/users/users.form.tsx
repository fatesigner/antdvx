import { Field as VeeField } from 'vee-validate';
import { PropType, defineComponent, onMounted, ref } from 'vue';
import { isNullOrUndefined } from '@fatesigner/utils/type-check';
import { TransitionCollapse, XButton, XCombobox } from '@/antdvx';
import { Checkbox, CheckboxGroup, Form, FormItem, Input, InputPassword, Modal, notification } from 'ant-design-vue';

import { sysRoleApi, sysUserApi } from '@/api';
import { createForm } from '@/app/plugins/vee-validate';
import { SysUserInput, SysUserOutput } from '@/api/models';
import { COMMON_STATUS, SEX_STATUS } from '@/app/core/constants';

/**
 * UsersForm
 */
export const UsersForm = defineComponent({
  props: {
    model: {
      type: Object as PropType<SysUserInput>,
      default() {
        return {};
      }
    }
  },
  emits: ['close'],
  setup(props: any, { emit }) {
    const roles = ref([]);

    const isEditting = !isNullOrUndefined(props.model?.ID);

    // 定义表单
    const form = createForm<SysUserInput & { Password: string; ConfirmPassword: string; Roles: number[] }>(
      {
        validateOnMount: false,
        initialValues: props.model,
        validationSchema: {
          Account: 'required',
          Password: isEditting ? 'password' : 'required|password',
          ConfirmPassword: isEditting ? undefined : 'required|confirmed:@Password',
          FirstName: 'required',
          LastName: 'required',
          Roles: 'required',
          Email: 'email',
          Status: 'required'
        }
      },
      async (values) => {
        let errorMessage;
        let userCreated: SysUserOutput;
        if (isEditting) {
          await sysUserApi
            .systemManageUserUpdate({
              sysUserInput: {
                ...props.model,
                ...values
              }
            })
            .catch((err) => {
              errorMessage = err.message;
            });
        } else {
          userCreated = (await sysUserApi
            .systemManageUserRegister({
              registerUserInput: {
                ...props.model,
                ...values
              }
            })
            .then((res) => {
              return res?.data?.Result;
            })
            .catch((err) => {
              errorMessage = err.message;
            })) as any;
        }

        if (!errorMessage) {
          if (values?.Roles) {
            await sysUserApi
              .systemManageUserGrantRole({
                userRoleInput: {
                  ID: userCreated?.ID ?? values?.ID,
                  RoleIds: values?.Roles
                }
              })
              .catch((err) => {
                errorMessage = err.message;
              });
          }

          if (values?.Password) {
            await sysUserApi
              .systemManageUserResetUserPwd({
                changeUserPasswordParm: {
                  Account: values.Account,
                  NewPassword: values.Password
                }
              })
              .catch((err) => {
                errorMessage = err.message;
              });
          }
        }

        if (errorMessage) {
          Modal.error({
            title: errorMessage
          });
        } else {
          if (isEditting) {
            notification.success({ message: 'User Updated success' });
          } else {
            notification.success({ message: 'User Added success' });
          }
          emit('close', true);
        }
      }
    );

    onMounted(() => {
      // Get Roles
      Promise.all([
        sysRoleApi.systemManageRoleOdataAll(),
        isEditting
          ? sysRoleApi.systemManageRoleuserIdRoles({
              userId: props.model?.ID
            })
          : undefined
      ]).then(([res, res2]) => {
        roles.value = res?.data?.Result ?? [];
        if (res2) {
          form.context.resetForm({
            values: {
              ...form.context.values,
              Roles: res2?.data?.Result?.map((x) => x.ID) ?? []
            }
          });
        }
      });
    });

    return {
      isEditting,
      roles,
      form
    };
  },
  render(ctx) {
    return (
      <div class='tw-flex tw-flex-col tw-h-full'>
        <div class='tw-flex-1 tw-overflow-y-auto tw-pt-4 tw-pr-8 tw-pb-4 tw-pl-8'>
          <Form class='tw-max-w-md tw-m-auto tw-pr-8' layout='horizontal' labelAlign='right' labelCol={{ style: { width: '140px' } }}>
            <div class='tw-grid tw-grid-cols-12 tw-gap-4'>
              <FormItem class='tw-col-span-12' label='User Code' required>
                <VeeField
                  name='Account'
                  label='User Code'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          placeholder='Input User Code'
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='First Name' required>
                <VeeField
                  name='FirstName'
                  label='First Name'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          placeholder='Input First Name'
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Last Name' required>
                <VeeField
                  name='LastName'
                  label='Last Name'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          placeholder='Input Last Name'
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='User Gender'>
                <VeeField
                  name='Sex'
                  label='User Gender'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <XCombobox
                          autoBind
                          clearable
                          dataKeyField='value'
                          dataValueField='value'
                          dataTextField='text'
                          placeholder='Select User Gender'
                          options={SEX_STATUS.arr as any}
                          value={field.value}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Phone'>
                <VeeField
                  name='Phone'
                  label='User Phone'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          placeholder='Input User Phone'
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Email'>
                <VeeField
                  name='Email'
                  label='User Email'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <Input
                          class='tw-w-full'
                          value={field.value}
                          placeholder='Input User Email'
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='User Role' required>
                <VeeField
                  name='Roles'
                  label='User Role'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <CheckboxGroup
                          value={field.value}
                          onChange={(e) => {
                            handleChange(e);
                          }}>
                          <div class='tw-flex tw-flex-wrap tw-gap-x-6 tw-gap-y-2'>
                            {ctx.roles.map((x) => (
                              <div>
                                <Checkbox value={x.ID}>{x.Name}</Checkbox>
                              </div>
                            ))}
                          </div>
                        </CheckboxGroup>,
                        /* <XCombobox
                          multiple
                          autoBind
                          clearable
                          dataKeyField='ID'
                          dataValueField='ID'
                          dataTextField='Name'
                          placeholder='Select User Role'
                          optionsLoader={() => {
                            return sysRoleApi.systemManageRoleOdataAll().then((res) => {
                              return res?.data?.Result ?? [];
                            });
                          }}
                          value={field.value}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />, */
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Status' required>
                <VeeField
                  name='Status'
                  label='User Status'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <XCombobox
                          autoBind
                          clearable
                          dataKeyField='value'
                          dataValueField='value'
                          dataTextField='text'
                          placeholder='Select User Status'
                          options={COMMON_STATUS.arr as any}
                          value={field.value}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='User Password' required={!ctx.isEditting}>
                <VeeField
                  name='Password'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <InputPassword
                          class='tw-w-full'
                          allowClear
                          value={field.value}
                          placeholder='Input User Password'
                          onChange={(e) => {
                            handleChange(e);
                            if (ctx.isEditting) {
                              if (e.target.value) {
                                ctx.form.validationSchema.ConfirmPassword = 'required|confirmed:@Password';
                              } else {
                                ctx.form.validationSchema.ConfirmPassword = undefined;
                              }
                            }
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
              <FormItem class='tw-col-span-12' label='Confirm Password' required={!ctx.isEditting}>
                <VeeField
                  name='ConfirmPassword'
                  v-slots={{
                    default({ field, handleChange, meta, errors }) {
                      return [
                        <InputPassword
                          class='tw-w-full'
                          allowClear
                          value={field.value}
                          placeholder='Confirm User Password'
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />,
                        <TransitionCollapse>
                          {meta.touched && !meta.valid && errors.length ? <div class='invalid-message'>{errors[0]}</div> : ''}
                        </TransitionCollapse>
                      ];
                    }
                  }}
                />
              </FormItem>
            </div>
          </Form>
        </div>
        <div class='tw-flex tw-justify-end tw-space-x-2 tw-p-4 tw-border-t tw-border-gray-200'>
          <XButton color='secondary' size='large' type='3d' loading={ctx.form.isSubmitting} onClick={ctx.form.submit}>
            Save
          </XButton>
          <XButton
            size='large'
            type='3d'
            onClick={() => {
              ctx.$emit('close');
            }}>
            Cancel
          </XButton>
        </div>
      </div>
    );
  }
});
