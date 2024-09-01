import type { MyPasswordsVo } from "@/types/query";
import type { TableData } from "@arco-design/web-vue";

export type PasswordDataType = TableData & Required<MyPasswordsVo>;
