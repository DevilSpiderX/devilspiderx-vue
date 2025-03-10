import { useAppConfigs } from "@/stores/AppConfigsStore";
import { computed } from "vue";

export function useModalWidth() {
    const appConfigs = useAppConfigs();

    const width = computed(() => {
        const winWidth = appConfigs.client.width;
        if (winWidth < 576) {
            //xs [0, 576)
            return "90%";
        } else if (winWidth < 768) {
            //sm [576, 768)
            return "83.3%";
        } else if (winWidth < 992) {
            //md [768, 992)
            return "62.5%";
        } else if (winWidth < 1200) {
            //lg [992, 1200)
            return "48%";
        } else if (winWidth < 1600) {
            //xl [1200, 1600)
            return "40%";
        } else {
            //xxl [1600, ∞)
            return "30%";
        }
    });

    return {
        width,
    };
}
