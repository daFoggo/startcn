import ky from "ky";

export const kyClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL, // optional
  timeout: 30_000,
  retry: {
    limit: 2,
    methods: ["get", "post", "put"],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        // Inject token nếu có
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("ACCESS_TOKEN")
            : null;

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Auto-refresh token khi bị 401
        if (response.status === 401) {
          // refresh token ở đây
          // const newToken = await refreshToken();
          // localStorage.setItem("ACCESS_TOKEN", newToken);
          // return kyClient(_request); // retry
        }
      },
    ],
  },
});
