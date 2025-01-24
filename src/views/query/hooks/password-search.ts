import { get_paging as getApi } from "@/api/query-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import type { MyPasswordsVo } from "@/types/query.ts";
import { Message } from "@arco-design/web-vue";
import { computed, onMounted, ref, watchEffect } from "vue";

const logger = getLogger(import.meta.filePath);

interface StorageType {
    key: string;
    passwordData: MyPasswordsVo[];
    tablePaginationTotal: number;
    tablePaginationCurrent: number;
    tablePaginationPageSize: number;
}

const storageName = "PasswordSearch";

export function usePasswordSearch() {
    const key = ref("");
    const passwordData = ref<MyPasswordsVo[]>([]);
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
            logger.set(import.meta.codeLineNum).debug("(password-search):", resp);

            passwordData.value = resp.list;
            tablePaginationTotal.value = resp.total;
            if (setPageFlag) {
                tablePaginationCurrent.value = page + 1;
            }
            return Promise.resolve();
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
