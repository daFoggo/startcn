# Hướng dẫn Toàn diện về DiceUI Data Table (Trong dự án StartCN)

Tài liệu này giải thích chi tiết về kiến trúc, cách hoạt động và quy trình tích hợp của **DiceUI Data Table** trong dự án này. Đây là hướng dẫn dành cho lập trình viên muốn hiểu sâu về cách quản lý trạng thái bảng (table state) đồng bộ với URL và Server-side rendering (SSR).

---

## 1. Tổng quan & Triết lý Thiết kế

DiceUI Data Table không chỉ là một component hiển thị dữ liệu `props` xuống UI. Nó là một hệ thống **"URL-First"**.

### Cách tiếp cận truyền thống vs DiceUI
*   **Truyền thống**: Bạn dùng `useState` để lưu `page`, `sort`, `filter`. Khi F5 reload lại trang, trạng thái này mất đi. Bạn phải code logic phức tạp để đồng bộ nó với URL nếu muốn share link.
*   **DiceUI (Pattern hiện tại)**: **URL chính là State**.
    *   Bạn không bao giờ `setPage(2)`.
    *   Thay vào đó, component bảng sẽ cập nhật URL thành `?page=2`.
    *   Ứng dụng lắng nghe URL thay đổi -> Dữ liệu mới được fetch.

### Luồng dữ liệu (Data Flow)
Mô hình hoạt động của bảng trong dự án này như sau:

```mermaid
graph TD
    User(Người dùng) --Click Next Page--> TableUI(Component Bảng)
    TableUI --useDataTable--> URL[URL Browser (?page=2)]
    URL --TanStack Router--> SearchParams[Biến Search Params]
    SearchParams --React Query--> QueryKey[Query Key thay đổi]
    QueryKey --Trigger--> API(Gọi API Fetch Page 2)
    API --Trả dữ liệu--> Cache(TanStack Query Cache)
    Cache --Render--> TableUI
```

**Điều quan trọng nhất**: Bảng (Table) không trực tiếp gọi API. Bảng chỉ thay đổi URL. URL thay đổi sẽ kích hoạt việc gọi API.

---

## 2. Các Thành phần Cốt lõi

### 2.1. `useDataTable` Hook
Đây là "bộ não" của bảng. Nó nằm tại `src/hooks/use-data-table.ts`.
*   **Nhiệm vụ**: Kết nối thư viện `nuqs` (quản lý URL search params) với `tanstack-table`.
*   **Cơ chế**: Nó tự động map các state của bảng (sorting, filtering, pagination) thành các query string trên URL.
    *   Ví dụ: Sort cột "Title" tăng dần -> URL thêm `?sort=title.asc`
    *   Filter cột "Status" là active -> URL thêm `?status=active`

### 2.2. Components Giao diện (`src/components/data-table`)
*   `DataTable`: Wrapper chính.
*   `DataTableToolbar`: Chứa ô search, nút filter.
*   `DataTablePagination`: Chân trang (nút Next/Prev, chọn số dòng/trang).
*   `DataTableColumnHeader`: Header cột có chức năng sort/hide.

---

## 3. Hướng dẫn Tích hợp Server-Side (Quan trọng)

Để bảng hoạt động mượt mà với API (Server-side Pagination/Sorting/Filtering), bạn cần thực hiện ĐẦY ĐỦ 4 bước sau. Thiếu 1 bước sẽ dẫn đến việc bảng không lọc được hoặc không chuyển trang được.

### Bước 1: Định nghĩa Schema cho URL (Search Params)
Trước hết, bạn cần định nghĩa "URL trông như thế nào" bằng Zod.

```typescript
// features/posts/search-schema.ts
import { z } from "zod";

export const postsSearchSchema = z.object({
  page: z.number().default(1).catch(1),      // Luôn có mặc định
  perPage: z.number().default(10).catch(10), // Luôn có mặc định
  sort: z.string().optional(),               // Ví dụ: "title.desc"
  title: z.string().optional(),              // Filter theo title
});
```

### Bước 2: Cập nhật API Service để nhận Parameter
API cần biết URL đang có gì để query database tương ứng.

```typescript
// features/posts/services/post.services.ts
import { createServerFn } from "@tanstack/react-start";
import { postsSearchSchema } from "../search-schema";

export const getPosts = createServerFn({ method: "GET" })
  .validator((data) => postsSearchSchema.parse(data)) // Validate input nhận vào
  .handler(async ({ data }) => {
    // data ở đây chính là { page: 1, perPage: 10, ... }
    
    // Convert sang query string mà Backend hiểu (ví dụ json-server)
    const params = new URLSearchParams();
    params.set("_page", data.page.toString());
    params.set("_limit", data.perPage.toString()); // Json server dùng _limit
    if (data.sort) {
        const [field, order] = data.sort.split('.');
        params.set("_sort", field);
        params.set("_order", order);
    }
    
    // Gọi Client
    const res = await fetch(`.../posts?${params.toString()}`);
    return res.json();
  });
```

### Bước 3: Cấu hình Route (TanStack Router)
Route đóng vai trò trung gian: Lấy URL -> Validate -> Truyền vào Loader.

```typescript
// routes/posts/index.tsx
export const Route = createFileRoute("/posts")({
  // 1. Validate URL. Nếu sai định dạng -> tự sửa về mặc định
  validateSearch: (search) => postsSearchSchema.parse(search),
  
  // 2. Bảo Router reload khi các params này thay đổi
  loaderDeps: ({ search }) => ({ 
      page: search.page, 
      perPage: search.perPage,
      sort: search.sort 
  }),

  // 3. Prefetch dữ liệu dựa trên params
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions(deps));
  },
});
```

### Bước 4: Kết nối tại UI Component
Cuối cùng, lấy `search params` từ Router và truyền vào Query và Table.

```tsx
function PostsPage() {
  // Lấy params hiện tại từ URL (Đã được validate ở Route)
  const search = Route.useSearch();
  
  // Truyền params vào query để fetch đúng trang
  const { data } = useQuery(postsQueryOptions(search));

  return (
    <DataTable 
      data={data.items} 
      pageCount={data.pageCount} // Quan trọng: Báo cho table biết tổng số trang
      // ...
    />
  );
}
```

---

## 4. Giải thích các file có sẵn trong project

*   `src/components/ui/table.tsx`: Component hiển thị HTML `<table>` cơ bản (shadcn/ui).
*   `src/components/data-table/*.tsx`: Các component nâng cao của DiceUI bổ sung tính năng cho table (Pagination, Filter Toolbar).
*   `src/hooks/use-data-table.ts`: Hook quan trọng nhất. Nó sử dụng `nuqs` để sync state với URL.

## 5. Các lỗi thường gặp (Troubleshooting)

1.  **Chuyển trang nhưng dữ liệu không đổi?**
    *   Nguyên nhân: `useQuery` chưa nhận `search params` vào `queryKey`.
    *   Fix: Đảm bảo `postsQueryOptions` có nhận đối số `params` và `queryKey: ['posts', params]`.

2.  **F5 mất bộ lọc?**
    *   Nguyên nhân: Do `validateSearch` trong Route bị cấu hình sai hoặc thiếu, khiến URL bị reset.
    *   Fix: Kiểm tra `validateSearch` trong file Route.

3.  **Table báo lỗi `pageCount`?**
    *   Nguyên nhân: API trả về không có thông tin tổng số trang (metadata).
    *   Fix: API phải trả về tổng số item hoặc số trang để Table tính toán nút "Next" có được enable hay không.

---

Tài liệu này giúp bạn hiểu rõ "Dòng chảy dữ liệu" (Data Flow) của Table trong hệ thống. Hãy tuân thủ mô hình **URL là State** để tránh các bug không đồng bộ dữ liệu.
