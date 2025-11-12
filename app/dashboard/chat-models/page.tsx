"use client";

import { useEffect } from "react";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

const ChatModelsPage = () => {
	const { setBreadcrumbs } = useBreadcrumbStore();

	useEffect(() => {
		setBreadcrumbs([{ title: "Chat Models", url: "/dashboard/chat-models" }]);
	}, [setBreadcrumbs]);

	return <div>ChatModelsPage</div>;
};

export default ChatModelsPage;
