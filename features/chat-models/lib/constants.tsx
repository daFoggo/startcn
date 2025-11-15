import { nanoid } from "nanoid";
import { Gemini } from "@/components/ui/svgs/gemini";
import { Openai } from "@/components/ui/svgs/openai";
import { Qwen } from "@/components/ui/svgs/qwen";

export const SAMPLE_MODELS = [
	{
		value: "gemini-2.0-flash",
		label: "Gemini 2.0 Flash",
		icon: Gemini,
	},
	{
		value: "gpt-4.1-nano",
		label: "GPT-4.1 Nano",
		icon: Openai,
	},
	{
		value: "qwen-3.32b",
		label: "Qwen 3.32B",
		icon: Qwen,
	},
];

export const SAMPLE_MESSAGES = [
	{
		key: nanoid(),
		value: "Xin chào! Tôi có thể giúp gì cho bạn?",
		from: "assistant" as const,
	},
	{
		key: nanoid(),
		value: "Tôi muốn thử tính năng hội thoại này 😄",
		from: "user" as const,
	},
	{
		key: nanoid(),
		value:
			"Tôi đang thử markdown. Bạn có hiển thị được không? \n\n```ts\nconsole.log('Hello World');\n```",
		from: "user" as const,
	},
	{
		key: nanoid(),
		value: `Được chứ! Đây là ví dụ markdown:

**Bold**, _italic_, ~~strike~~

Danh sách:

- A
- B
- C

Code block:

\`\`\`js
function sum(a, b) {
  return a + b;
}
\`\`\`

Math inline: $E = mc^2$

Math block:

$$
a^2 + b^2 = c^2
$$
`,
		from: "assistant" as const,
	},
];
