"use client";

import { useEffect } from "react";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

const OverviewPage = () => {
	const { setBreadcrumbs } = useBreadcrumbStore();

	useEffect(() => {
		setBreadcrumbs([{ title: "Overview", url: "/dashboard/overview" }]);
	}, [setBreadcrumbs]);

	return <div className="p-6">OverviewPage</div>;
};

export default OverviewPage;
