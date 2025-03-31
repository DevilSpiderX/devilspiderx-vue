import type { Plugin } from "vite";

const srcFileRegex = /^.+\/src\/([^?]+\.(vue|tsx|ts)$)/;
const importMetaFilePathRegex = /import\.meta\.filePath/g;
const importMetaCodeLineNumRegex = /import\.meta\.codeLineNum/;
const importMetaCodeLineNumRegexG = /import\.meta\.codeLineNum/g;

export function VitePluginCodeLine(): Plugin {
    return {
        name: "vite-plugin-code-line",
        enforce: "pre",
        transform(code, id) {
            if (id.indexOf("node_modules") !== -1) {
                return code;
            }

            const srcFileExecArray = srcFileRegex.exec(id);
            if (srcFileExecArray === null) {
                return code;
            }

            //转换import.meta.filePath为当前文件相对于/src的路径
            if (importMetaFilePathRegex.exec(code) !== null) {
                const filePath = srcFileExecArray[1];
                code = code.replaceAll(importMetaFilePathRegex, `"${filePath}"`);
            }

            //转换import.meta.codeLineNum为所在行号
            if (importMetaCodeLineNumRegex.exec(code) !== null) {
                const lines = code.split(/\r\n|\n|\r/);
                const numList: number[] = [];
                let i = 1;
                for (const line of lines) {
                    while (importMetaCodeLineNumRegexG.exec(line) !== null) {
                        numList.push(i);
                    }
                    i++;
                }

                for (const num of numList) {
                    code = code.replace(importMetaCodeLineNumRegex, `${num}`);
                }
            }

            return code;
        },
    };
}
