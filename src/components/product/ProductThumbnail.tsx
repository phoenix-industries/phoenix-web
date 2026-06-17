import { createSignal, Show } from "solid-js";
import PackageIcon from "lucide-solid/icons/package";

export type PostCardImageProps = {
	id?: string | null;
	src?: string | null;
	alt?: string;
	class?: string;
};

export function ProductThumbnail(props: PostCardImageProps) {
	const [error, setError] = createSignal(false);
	if (props.id && !props.src) {
		props.src = `/thumbnails/${props.id}`;
	}
	return (
		<Show
			when={props.src && !error()}
			fallback={
				<PackageIcon
					class={`text-primary p-5 max-w-48 size-full object-contain ${props.class ?? ""}`}
				/>
			}
		>
			<img
				src={props.src ?? undefined}
				alt={props.alt}
				class={`size-full object-contain ${props.class}`}
				onError={() => setError(true)}
				loading="lazy"
				decoding="async"
			/>
		</Show>
	);
}
export default ProductThumbnail;
