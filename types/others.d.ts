type Block = import("wordpress__blocks").BlockInstance;

type BlockId = Block["clientId"];

interface DropArea {
	id: BlockId;
	level: number;
}

type ValueOf<T> = T[keyof T];

// CSS modules
declare module "*.styl" {
	const styles: { [className: string]: string };
	export default styles;
}
