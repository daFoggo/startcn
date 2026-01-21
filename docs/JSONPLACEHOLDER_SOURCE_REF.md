# Nguồn thông tin về _sort và _order

Bạn hoàn toàn đúng khi nhận thấy trang Document chính thức của [JSONPlaceholder Guide](https://jsonplaceholder.typicode.com/guide/) khá sơ sài và **không** liệt kê chi tiết về `_sort` hay `_order`.

Tuy nhiên, lý do chúng ta biết và sử dụng được các tham số này là vì:

**JSONPlaceholder được vận hành bởi [JSON Server](https://github.com/typicode/json-server).**

Cả 2 dự án này đều được tạo bởi cùng một tác giả là **typicode**. JSONPlaceholder thực chất là một phiên bản "demo" online của thư viện `json-server`.

Bạn có thể tìm thấy tài liệu đầy đủ về các tính năng query này tại Repository của `json-server`:
**[JSON Server Documentation - Sort](https://github.com/typicode/json-server?tab=readme-ov-file#sort)**

Trích dẫn từ tài liệu của JSON Server:

> **Sort**
> 
> Add `_sort` and `_order` (ascending order by default)
> 
> `GET /posts?_sort=views&_order=asc`
> `GET /posts/1/comments?_sort=votes&_order=asc`
> 
> For multiple fields, use the following format:
> `GET /posts?_sort=user,views&_order=desc,asc`

Do đó, mặc dù trang hướng dẫn của JSONPlaceholder không ghi, nhưng nó thừa hưởng toàn bộ tính năng của `json-server` bên dưới. Bạn cứ yên tâm sử dụng nhé!
