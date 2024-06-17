import { Message, TableData } from "@arco-design/web-vue";
import { computed, onMounted, ref, watchEffect } from "vue";
import { get_paging as getApi } from "@/scripts/http/query-api";

export interface PasswordDataType extends TableData {
    id: number;
    name: string;
    account: string;
    password: string;
    remark: string;
}

interface StorageType {
    key: string;
    passwordData: PasswordDataType[];
    tablePaginationTotal: number;
    tablePaginationCurrent: number;
    tablePaginationPageSize: number;
}

const storageName = "PasswordSearch";

export function usePasswordSearch() {
    const key = ref("");
    const passwordData = ref<PasswordDataType[]>([]);
    const tablePaginationTotal = ref(0);
    const tablePaginationCurrent = ref(1);
    const tablePaginationPageSize = ref(20);
    const tablePaginationPageCount = computed(() =>
        Math.ceil(tablePaginationTotal.value / tablePaginationPageSize.value),
    );
    const searching = ref(false);

    onMounted(() => {
        try {
            const str = sessionStorage.getItem(storageName);
            if (str) {
                const storage: StorageType = JSON.parse(str);
                if (typeof storage !== "object") {
                    throw "No Object";
                }
                if (storage.key) {
                    key.value = storage.key;
                }
                if (storage.passwordData) {
                    passwordData.value = storage.passwordData;
                }
                if (storage.tablePaginationTotal) {
                    tablePaginationTotal.value = storage.tablePaginationTotal;
                }
                if (storage.tablePaginationCurrent) {
                    tablePaginationCurrent.value = storage.tablePaginationCurrent;
                }
                if (storage.tablePaginationPageSize) {
                    tablePaginationPageSize.value = storage.tablePaginationPageSize;
                }
            }
        } catch (ignore) {}

        watchEffect(() => {
            const storage: StorageType = {
                key: key.value,
                passwordData: passwordData.value,
                tablePaginationTotal: tablePaginationTotal.value,
                tablePaginationCurrent: tablePaginationCurrent.value,
                tablePaginationPageSize: tablePaginationPageSize.value,
            };
            sessionStorage.setItem(storageName, JSON.stringify(storage));
        });
    });

    /**
     * 搜索
     *
     * @param page 查询的页数，从0开始
     */
    async function search(page?: number) {
        searching.value = true;
        const length = tablePaginationPageSize.value;
        let setPageFlag = false;
        if (page === undefined) {
            page = tablePaginationCurrent.value - 1;
        } else {
            setPageFlag = true;
        }

        try {
            const resp = await getApi(key.value, length, page);
            if (import.meta.env.DEV) {
                console.log("(password-search):", resp);
            }

            if (resp.code === 0) {
                passwordData.value = resp.data;
                tablePaginationTotal.value = resp.dataCount ?? resp.data.length;
                if (setPageFlag) {
                    tablePaginationCurrent.value = page + 1;
                }
                return Promise.resolve();
            } else {
                const error = new Error(`code not equals 0,code=${resp.code}`);
                error.name = `${resp.code}`;
                clear();
                return Promise.reject(error);
            }
        } catch (error) {
            Message.error("查询出现错误");
            clear();
            return Promise.reject(error);
        } finally {
            searching.value = false;
        }
    }

    function clear() {
        passwordData.value = [];
        tablePaginationTotal.value = 0;
        tablePaginationCurrent.value = 1;
    }

    return {
        key,
        passwordData,
        tablePaginationTotal,
        tablePaginationCurrent,
        tablePaginationPageSize,
        tablePaginationPageCount,
        searching,
        search,
    };
}
