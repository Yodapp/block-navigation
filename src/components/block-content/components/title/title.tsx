import React from "react";
import type { FunctionComponent } from "react";
import { useContext } from "@wordpress/element";
import { useSelect } from "@wordpress/data";

import styles from "./styles.styl";
import { context } from "@/components/block";

export const Title: FunctionComponent = () => {
	const { id } = useContext(context);

	const block_name = useSelect(
		select => select("core/block-editor").getBlockName(id) || ""
	);

	const block_type = useSelect(select =>
		select("core/blocks").getBlockType(block_name)
	);

	const title = block_type?.title || block_name;

	return <span className={styles.container}>{title}</span>;
};
