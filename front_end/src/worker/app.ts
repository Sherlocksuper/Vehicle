export const getFileToHistoryWorker = () => {
    return new Worker(new URL('@/worker/transferFileToHistory.worker.ts', import.meta.url), {type: 'module'})
}

export const getHistoryToFileWorker = () => {
    return new Worker(new URL('@/worker/transferHistoryToFile.worker.ts', import.meta.url), {type: 'module'})
}

export const getExportFileWorker = () => {
    return new Worker(new URL('@/worker/exportFile.worker.ts', import.meta.url), {type: 'module'})
}
