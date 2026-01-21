import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
	dsn: "https://7ab0bbbbc07fabd12c9df3c3b22b4df6@o4507204274094080.ingest.us.sentry.io/4510747309441024",

	// Setting this option to true will send default PII data to Sentry.
	// For example, automatic IP address collection on events
	sendDefaultPii: true,
});
