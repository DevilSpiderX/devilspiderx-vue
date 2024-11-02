import fs from "fs";
import type { Plugin } from "vite";

const srcFileRegex = /.+\/src\/(.+\.(vue|tsx|ts))/;
const importMetaFilePathRegex = /import\.meta\.filePath/g;
const importMetaCodeLineNumRegex = /import\.meta\.codeLineNum/;

export function VitePluginCodeLine(): Plugin {
    return {
        name: "vite-plugin-code-line",
        transform(code, id) {
            if (id.indexOf("node_modules") !== -1) {
                return code;
            }

            const idIndex = id.indexOf("?");
            const _id = idIndex === -1 ? id : id.substring(0, idIndex);
            let srcFileExecArray;
            if ((srcFileExecArray = srcFileRegex.exec(_id)) !== null) {
                const absolutePath = srcFileExecArray[0];
                const filePath = srcFileExecArray[1];

                if (importMetaFilePathRegex.exec(code) !== null) {
                    code = code.replaceAll(importMetaFilePathRegex, `"${filePath}"`);
                }

                if (importMetaCodeLineNumRegex.exec(code) !== null) {
                    const lines = fs.readFileSync(absolutePath, "utf-8").split(/\r\n|\n/);
                    const numList: number[] = [];
                    let i = 1;
                    for (const line of lines) {
                        if (importMetaCodeLineNumRegex.exec(line) !== null) {
                            numList.push(i);
                        }
                        i++;
                    }

                    for (const num of numList) {
                        code = code.replace(importMetaCodeLineNumRegex, `${num}`);
                    }
                }
            }

            return code;
        },
    };
}
