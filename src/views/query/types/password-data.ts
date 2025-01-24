import type { MyPasswordsVo } from "@/types/query.ts";
import type { TableData } from "@arco-design/web-vue";

export type DataType = Required<MyPasswordsVo>;
export type PasswordDataType = TableData & DataType;
