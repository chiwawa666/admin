import { getPrivateCode } from "@/api/user";
import { Message } from "element-ui";

// 获取私钥,设置时间，五分钟内秘钥有效
export function getPrivateCodeApi(data) {
  return new Promise((resolve, reject) => {
    getPrivateCode(data)
      .then((res) => {
        localStorage.setItem("privateCodeTime", new Date().getTime());
        localStorage.setItem("privateCode", JSON.parse(res.result).values);
        Message({
          message: "获取成功！",
          type: "success",
          duration: 5 * 1000,
        });
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        Message({
          message: "获取失败,请重试",
          type: "error",
          duration: 5 * 1000,
        });
      })
  })
}