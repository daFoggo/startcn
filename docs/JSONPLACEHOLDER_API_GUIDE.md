# Hướng dẫn API JSONPlaceholder (JSON Server Features)

JSONPlaceholder được xây dựng dựa trên **JSON Server**, vì vậy nó hỗ trợ rất nhiều tính năng truy vấn mạnh mẽ mà trang chủ không liệt kê. Dưới đây là danh sách đầy đủ các tham số bạn có thể sử dụng.

## 1. Lọc dữ liệu (Filter)
Bạn có thể lọc theo bất kỳ trường nào có trong dữ liệu (ví dụ: `id`, `userId`, `title`, `status`, ...).

*   **Chính xác (Exact Match):**
    `GET /posts?userId=1`
    `GET /posts?id=1`

*   **Lọc lồng nhau (Nested properties):**
    `GET /users?address.city=Zip`

## 2. Phân trang (Pagination)
Sử dụng `_page` và `_per_page` (hoặc `_limit`) để phân trang.

*   **Cú pháp:**
    `GET /posts?_page=1&_per_page=10`

*   **Link Header:**
    API sẽ trả về header `Link` chứa các liên kết đến trang `first`, `prev`, `next`, `last`.

## 3. Sắp xếp (Sorting)
Sử dụng `_sort` và `_order`. Mặc định là tăng dần (`asc`).

*   **Một cột:**
    `GET /posts?_sort=views&_order=asc`

*   **Nhiều cột:**
    `GET /posts?_sort=user,views&_order=desc,asc`

## 4. Cắt dữ liệu (Slice / Range)
Lấy một khoảng dữ liệu xác định bằng `_start`, `_end` hoặc `_limit`.

*   **Từ dòng 20 đến dòng 30:**
    `GET /posts?_start=20&_end=30`

*   **Từ dòng 20 lấy thêm 10 dòng:**
    `GET /posts?_start=20&_limit=10`

> *Lưu ý: Header `X-Total-Count` sẽ được trả về trong response để biết tổng số lượng bản ghi.*

## 5. Toán tử (Operators)
Sử dụng các hậu tố để so sánh dữ liệu.

*   **Lớn hơn / Nhỏ hơn (`_gte`, `_lte`):**
    `GET /posts?views_gte=10&views_lte=20` (Lấy bài viết có view từ 10 đến 20)

*   **Khác (`_ne`):**
    `GET /posts?id_ne=1` (Lấy tất cả trừ id = 1)

*   **Tìm kiếm tương đối (`_like` - Regex):**
    `GET /posts?title_like=server` (Tìm title chứa chữ "server")

## 6. Tìm kiếm toàn văn (Full-text Search)
Tìm kiếm text trên tất cả các trường.

*   **Cú pháp:**
    `GET /posts?q=internet`

## 7. Quan hệ dữ liệu (Relationships)
JSONPlaceholder hỗ trợ join dữ liệu (giống SQL JOIN) thông qua `_embed` và `_expand`.

*   **`_embed` (Lấy dữ liệu con):** Ví dụ lấy bài viết kèm theo các comment của nó.
    `GET /posts?_embed=comments`
    `GET /posts/1?_embed=comments`

*   **`_expand` (Lấy dữ liệu cha):** Ví dụ lấy comment kèm theo thông tin bài viết gốc.
    `GET /comments?_expand=post`
    `GET /comments/1?_expand=post`

---
*Nguồn tham khảo: [JSON Server Documentation](https://github.com/typicode/json-server)*
