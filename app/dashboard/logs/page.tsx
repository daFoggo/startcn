"use client";

import { useEffect } from "react";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

const LogsPage = () => {
	const { setBreadcrumbs } = useBreadcrumbStore();

	useEffect(() => {
		setBreadcrumbs([{ title: "Logs", url: "/dashboard/logs" }]);
	}, [setBreadcrumbs]);

	return <div>LogsPage</div>;
};

export default LogsPage;
