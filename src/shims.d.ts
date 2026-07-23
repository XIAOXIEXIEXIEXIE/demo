declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "ant-design-vue" {
  import type { DefineComponent, Plugin } from "vue";
  export const Table: DefineComponent;
  export const Button: DefineComponent;
  export const Tag: DefineComponent;
  export const Popconfirm: DefineComponent;
  export const ConfigProvider: DefineComponent;
  export const message: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
}

declare module "ant-design-vue/dist/reset.css";
