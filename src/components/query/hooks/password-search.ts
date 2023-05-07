import { onMounted, ref, watchEffect } from "vue";

export interface PasswordDataType {
    id: number;
    name: string;
    account: string;
    password: string;
    remark: string;
}

interface StorageType {
    key: string;
    passwordData: PasswordDataType[];
    tablePaginationCurrent: number;
    tablePaginationPageSize: number;
}

const storageName = "PasswordSearch";

export function usePasswordSearch() {
    const key = ref("");
    const passwordData = ref<PasswordDataType[]>([]);
    const tablePaginationCurrent = ref(1);
    const tablePaginationPageSize = ref(20);

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
                if (storage.tablePaginationCurrent) {
                    tablePaginationCurrent.value = storage.tablePaginationCurrent;
                }
                if (storage.tablePaginationPageSize) {
                    tablePaginationPageSize.value = storage.tablePaginationPageSize;
                }
            }
        } catch (ignore) {
        }

        watchEffect(() => {
            const storage: StorageType = {
                key: key.value,
                passwordData: passwordData.value,
                tablePaginationCurrent: tablePaginationCurrent.value,
                tablePaginationPageSize: tablePaginationPageSize.value
            }
            sessionStorage.setItem(storageName, JSON.stringify(storage));
        });
    });

    return {
        key,
        passwordData,
        tablePaginationCurrent,
        tablePaginationPageSize
    }
}