const { contextBridge, ipcRenderer, clipboard, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // API Giao tiếp mạng
    fetch: (url, cookie, options) => 
        ipcRenderer.invoke('fetch-api', { url, cookie, options }),
    
    // API Tự động hóa trình duyệt
    startBrowserAutomation: (args) => 
        ipcRenderer.send('browser:start-automation', args),
    stopBrowserAutomation: () => ipcRenderer.send('browser:stop-automation'),

    // API Tải file
    downloadVideo: (args) => ipcRenderer.send('download-video', args),
    downloadImage: (args) => ipcRenderer.send('download-image', args),
    selectDownloadDirectory: () => ipcRenderer.invoke('select-download-directory'),

    // Listener cho các sự kiện từ Main Process
    onDownloadComplete: (callback) => {
        const listener = (_event, result) => callback(result);
        ipcRenderer.on('download-complete', listener);
        return () => ipcRenderer.removeListener('download-complete', listener);
    },
    onBrowserLog: (callback) => {
        const listener = (_event, log) => callback(log);
        ipcRenderer.on('browser:log', listener);
        return () => ipcRenderer.removeListener('browser:log', listener);
    },
    onCookieUpdate: (callback) => {
        const listener = (_event, cookie) => callback(cookie);
        ipcRenderer.on('browser:cookie-update', listener);
        return () => ipcRenderer.removeListener('browser:cookie-update', listener);
    },

    // API Tự động cập nhật
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    onUpdateMessage: (callback) => {
        const listener = (_event, message, data) => callback(message, data);
        ipcRenderer.on('update-message', listener);
        return () => ipcRenderer.removeListener('update-message', listener);
    },
    restartAndInstall: () => ipcRenderer.send('restart-and-install'),
    
    // API tiện ích (Thêm 2 dòng này)
    copyText: (text) => clipboard.writeText(text),
    openExternalLink: (url) => shell.openExternal(url),
});