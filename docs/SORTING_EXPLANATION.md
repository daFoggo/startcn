# Tại sao Sorting hoạt động? (Giải thích chi tiết)

Bạn thắc mắc tại sao trên URL trình duyệt thấy `?sort=title.desc` mà API (JSONPlaceholder) vẫn hiểu và sort đúng, dù documentation nói API cần `_sort` và `_order`.

Câu trả lời nằm ở **"Lớp Dịch vụ" (Service Layer)** của bạn đã âm thầm thực hiện việc **Phiên dịch (Translation)**.

Dưới đây là hành trình của dữ liệu từ lúc bạn Click đến lúc gọi API:

## 1. Tại Trình duyệt (UI Level)
*   **Hành động**: Bạn click vào header cột "Title".
*   **DiceUI (Table)**: Cập nhật state nội bộ thành `[{ id: 'title', desc: true }]`.
*   **Parser (`src/lib/parsers.ts`)**: Chuyển đổi object đó thành chuỗi ngắn gọn cho URL:
    *   **Kết quả trên URL**: `http://localhost...?sort=title.desc`
    *   *Lưu ý: Đây là định dạng riêng của Frontend ứng dụng này, API chưa hề biết gì về nó.*

## 2. Tại Router & Schema
*   **TanStack Router**: Đọc `?sort=title.desc` từ URL.
*   **Schema (`schemas.ts`)**: Validate chuỗi này hợp lệ.

## 3. Tại Service (Nơi phép màu xảy ra)
Đây là khúc quan trọng nhất. Trong file `src/features/posts/services/post.services.ts`, chúng ta có đoạn code này:

```typescript
// Sort
if (data.sort) {
    // data.sort đang là "title.desc"
    const fields: string[] = [];
    const orders: string[] = [];

    // 1. Cắt chuỗi "title.desc"
    const sorts = data.sort.split(","); 
    for (const sortItem of sorts) {
        const [field, order] = sortItem.split("."); // field="title", order="desc"
        if (field) {
            fields.push(field);
            orders.push(order || "asc");
        }
    }

    // 2. Map sang ngôn ngữ của JSONPlaceholder
    if (fields.length > 0) {
        searchParams.set("_sort", fields.join(","));  // -> _sort=title
        searchParams.set("_order", orders.join(",")); // -> _order=desc
    }
}
```

## 4. Cuối cùng: Gọi API
*   Client `ky` sẽ lấy các params đã được set lại ở bước 3 để gọi đi.
*   **Thực tế API được gọi là**: 
    `GET https://jsonplaceholder.typicode.com/posts?_sort=title&_order=desc`

## Tóm lại
1.  **Frontend URL**: Dùng format `field.dir` (Ví dụ: `title.desc`) -> Để URL đẹp, ngắn gọn, dễ đọc.
2.  **Backend API**: Dùng format `_sort=field&_order=dir`.
3.  **Hàm `getPosts`**: Đóng vai trò là "Người phiên dịch" giữa 2 ngôn ngữ này.

Vì vậy, việc bạn thấy URL browser khác với Doc API là hoàn toàn bình thường và là một **Best Practice** (Tách biệt UI State và API Implementation). Bạn có thể đổi Backend sang SQL, Firebase, hay gì đó khác thì cũng chỉ cần sửa file `service`, URL của người dùng không bị ảnh hưởng.
