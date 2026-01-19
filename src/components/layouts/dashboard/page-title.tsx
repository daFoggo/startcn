interface PageTitleProps {
	title: string;
	subTitle?: string;
}
export const PageTitle = ({ title, subTitle }: PageTitleProps) => {
	return (
		<div className="flex items-center gap-2">
			<div className="flex flex-col items-start">
				<p className="font-bold text-xl">{title}</p>
				{subTitle && <p className="text-muted-foreground">{subTitle}</p>}
			</div>
		</div>
	);
};
