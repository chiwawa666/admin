import { getToken } from '@/utils/auth'
/**
 * 文件导出
 * @param fileUrl 接口地址
 * @param text 命名
 * @return 无
 */
export function getBlob(fileUrl, fileName) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', process.env.VUE_APP_BASE_API + fileUrl, true);
        //监听进度事件
        xhr.addEventListener(
            'progress',
            function (evt) {
            },
            false
        );
        xhr.setRequestHeader('Authorization', getToken())
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {

                saveFile(xhr.response, fileName)
                resolve(xhr.response);
            }
        };
        xhr.send();
    });
}

/**
 * 文件下载
 * @param blob 文件
 * @param fileName 命名
 * @return 无
 */
export function saveFile(blob, fileName) {
    // ie的下载
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        // 非ie的下载
        const link = document.createElement('a');
        const body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}