import { isVNode } from "vue";
import type { DSXMenuIconProps as Props } from ".";

const DSXMenuIcon = ({ icon }: Props) => {
    if (icon && isVNode(icon)) {
        return <span class="icon-wrapper" >{icon}</span>;
    } else if (typeof icon === "string") {
        return <span class="icon-wrapper" innerHTML={icon} />;
    }
};
DSXMenuIcon.props = ["icon"];

export default DSXMenuIcon;