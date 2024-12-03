import "./index.scss";

if (import.meta.env.DEV) {
    import("./import-style.dev.scss");
} else {
    import("./import-style.scss");
}
