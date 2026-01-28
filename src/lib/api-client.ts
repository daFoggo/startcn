import ky from "ky";
import { BACKEND_API_URL } from "@/constants/environment";

/**
 * Main API Client
 * Use this for all interactions with our primary backend service.
 * Automatic prefixing with BACKEND_API_URL.
 */
export const mainClient = ky.create({
	prefixUrl: BACKEND_API_URL,
	// hooks: {
	// 	beforeRequest: [
	// 		(request) => {
	// 			// Example: request.headers.set('Authorization', `Bearer ${token}`);
	// 		},
	// 	],
	// },
});

/**
 * Define more Backend services here
 */
// export const aiClient = ky.create({
// 	prefixUrl: AI_BACKEND_API_URL,
// 	// Add hooks here for auth tokens, logging, etc.
// 	hooks: {
// 		beforeRequest: [
// 			(request) => {
// 				// Example: request.headers.set('Authorization', `Bearer ${token}`);
// 			},
// 		],
// 	},
// });
