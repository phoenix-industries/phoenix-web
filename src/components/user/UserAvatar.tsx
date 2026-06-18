import { createSignal, Show } from "solid-js";
import UserIcon from "lucide-solid/icons/user";

export type UserAvatarProps = {
	id?: string | null;
	src?: string | null;
	alt?: string;
	class?: string;
};

export function UserAvatar(props: UserAvatarProps) {
	const [error, setError] = createSignal(false);
	const src = () =>
		props.src || (props.id ? `/thumbnails/${props.id}` : undefined);
	return (
		<Show
			when={src() && !error()}
			fallback={
				<UserIcon
					class={`p-5 max-w-48 size-full object-contain ${props.class ?? ""}`}
				/>
			}
		>
			<img
				src={src()}
				alt={props.alt}
				class={`size-full object-contain ${props.class}`}
				onError={() => setError(true)}
				loading="lazy"
				decoding="async"
			/>
		</Show>
	);
}
export default UserAvatar;
