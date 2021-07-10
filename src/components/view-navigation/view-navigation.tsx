import React, { FunctionComponent } from "react";
import { Fragment, useEffect, useCallback, useRef } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { FixedSizeList as List } from "react-window";

import styles from "./view-navigation.styl";
import { store_slug } from "@/store";
import { Block } from "../block";
import { Toolbar } from "./toolbar";
import { useBlockIds, useScrollTo } from "./utils";

interface Props {
	container_width: number;
	container_height: number;
}

export const ViewNavigation: FunctionComponent<Props> = props => {
	const { container_height, container_width } = props;

	const $root = useRef(document.querySelector("#editor > *"));

	const $list = useRef(null);

	const block_ids = useBlockIds();

	const is_detached = useSelect(select => select(store_slug).isDetached());

	const moving_block = useSelect(select =>
		select(store_slug).getMovingBlock()
	);

	const moving_type = useSelect(select => select(store_slug).getMovingType());

	const { resetMoving } = useDispatch(store_slug);

	const onDrop = useCallback(resetMoving, [resetMoving]);

	const tab_height = is_detached ? 0 : 50;

	useScrollTo({ block_ids, $list: $list.current });

	useEffect(() => {
		const onDropHandler = () => onDrop();

		if (moving_block) {
			document.addEventListener("drop", onDropHandler);
			// WP 5.7 seems to stop the propagation of the drop event in #editor
			$root.current?.addEventListener("drop", onDropHandler);
		} else {
			document.removeEventListener("drop", onDropHandler);
			$root.current?.removeEventListener("drop", onDropHandler);
		}
	}, [moving_block]);

	return (
		<Fragment>
			{moving_type === "by_click" && <Toolbar />}

			<div className={styles.container}>
				{block_ids.length === 0 ? (
					<span className={styles.no_blocks}>
						{__("There are no blocks.")}
					</span>
				) : (
					<List
						className={styles.content}
						outerRef={$list}
						height={container_height - tab_height}
						width={container_width}
						itemCount={block_ids.length}
						itemSize={52}
						itemKey={index => block_ids[index]}
						itemData={{ block_ids }}
						overscanCount={20}
					>
						{Block}
					</List>
				)}
			</div>
		</Fragment>
	);
};
