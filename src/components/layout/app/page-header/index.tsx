import { useMatches } from "@tanstack/react-router";

/**
 * Component quản lý Header cho các trang Dashboard.
 * Tự động đồng bộ tiêu đề (title) hoặc render các thành phần tùy chỉnh dựa trên staticData của Route hiện tại.
 */
export const AppPageHeader = () => {
	const matches = useMatches();

	const headerSource = [...matches]
		.reverse()
		.find(
			(match) =>
				match.staticData?.header ||
				match.staticData?.getTitle ||
				match.staticData?.hideHeader,
		);

	const staticData = headerSource?.staticData;
	if (!staticData) return null;

	const shouldHide = staticData.header?.hide ?? staticData.hideHeader;
	if (shouldHide) return null;

	if (staticData.header?.render) {
		return (
			<div className="flex w-full items-center">
				{staticData.header.render()}
			</div>
		);
	}

	const customTitle =
		typeof staticData.header?.title === "function"
			? staticData.header.title()
			: staticData.header?.title;

	const title = customTitle ?? staticData.getTitle?.();
	if (!title) return null;

	return (
		<div className="flex items-center">
			<p className="text-xl font-semibold text-foreground">{title}</p>
		</div>
	);
};
