"use client";

import Link from "next/link";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

export const DashboardBreadcrumb = () => {
	const { breadcrumbs } = useBreadcrumbStore();

	if (breadcrumbs.length === 0) {
		return (
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/dashboard">Dashboard</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{breadcrumbs.map((item, index) => {
					const isLast = index === breadcrumbs.length - 1;

					return (
						<Fragment key={`${item.url}-${index}`}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast || !item.url ? (
									<BreadcrumbPage className="font-semibold">{item.title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={item.url}>{item.title}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
