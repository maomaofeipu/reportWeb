
import { seriesLoadScripts, loadLinks } from "../../utils/util";

const dependScripts = [
	"expendPlugins/libs/luckyexcel.umd.js",
];

const dependLinks = [];

export function fileImport(data, isDemo) {
	// 加载 css
	loadLinks(dependLinks);

	// 加载 js 依赖
	seriesLoadScripts(dependScripts, null, () => {
		console.log("## 文件导入插件相关依赖加载完成！");
	});
}
