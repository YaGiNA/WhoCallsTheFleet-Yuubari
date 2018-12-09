import fs from 'fs-extra'
import path from 'path'
import getDistPath from 'koot/utils/get-dist-path'
import getClientFilePath from 'koot/utils/get-client-file-path'
// const readFile = require('koot/utils/read-client-file')

const pathDist = getDistPath()
const manifestLastModified = new Map()

export default {
    manifest: (template, state) => {
        const localeId = state.localeId
        const filename = `manifest-${localeId}.json`
        if (!manifestLastModified.has(localeId))
            manifestLastModified.set(localeId, fs.statSync(path.join(pathDist, 'public', filename)).mtime.valueOf())
        return `<link rel="manifest" href="/${filename}?${manifestLastModified.get(localeId) || ''}">`
    },

    svgIcons: `<div class="hide">${__SVG_SYMBOLS__}</div>`,

    definePath: `<script>`
        + `window.__CRITICAL_EXTRA_OLD_IE_FILENAME__ = "${getClientFilePath('polyfill.js')}";`
        + `window.__SERVICE_WORKER_FILENAME__ = "${getClientFilePath('service-worker.js')}";`
        + `</script>`,
}
