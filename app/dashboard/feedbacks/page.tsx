"use client";

import { useEffect } from "react";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

const FeedbacksPage = () => {
	const { setBreadcrumbs } = useBreadcrumbStore();

	useEffect(() => {
		setBreadcrumbs([{ title: "Feedbacks", url: "/dashboard/feedbacks" }]);
	}, [setBreadcrumbs]);
  
	return <div>FeedbacksPage</div>;
};

export default FeedbacksPage;
