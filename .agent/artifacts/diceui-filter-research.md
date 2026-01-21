# DiceUI DataTable Filter Research Document

## Vấn đề hiện tại

Filter badges trong `DataTableFilterMenu` bị "flash and disappear" - xuất hiện rồi biến mất ngay khi apply filter từ clean state. Chỉ sau khi reload trang, badges mới hiển thị ổn định.

## Thông tin cần thu thập từ dự án hoạt động đúng

### 1. Framework/Router Setup
- [ ] Dự án dùng framework gì? (Next.js App Router, Next.js Pages Router, Vite, TanStack Start, etc.)
- [ ] Version của framework?
- [ ] Có dùng SSR không?

### 2. nuqs Configuration
- [ ] Version của `nuqs` package?
- [ ] Có dùng NuqsAdapter không? Loại adapter nào? (next, react-router, tanstack-router, etc.)
- [ ] NuqsAdapter được đặt ở đâu trong component tree?

### 3. useDataTable Hook Options
- [ ] Giá trị `shallow` là gì? (true/false)
- [ ] Giá trị `debounceMs` là gì?
- [ ] Giá trị `throttleMs` là gì?
- [ ] Các options khác được truyền vào?

### 4. DataTableFilterMenu Props
- [ ] Những props nào được truyền vào? (shallow, debounceMs, throttleMs, etc.)
- [ ] Có custom props nào không?

### 5. Route/Page Configuration
- [ ] Có `validateSearch` với Zod schema không?
- [ ] Schema có transform cho `filters` field không?
- [ ] Có `loaderDeps` không? Config thế nào?
- [ ] Data được fetch thế nào? (useQuery, use(promise), loader, etc.)

### 6. URL State sau khi apply filter
- [ ] URL format của `filters` param là gì?
- [ ] Có bị double-encode không? (e.g., `%22%5B...` thay vì `[{...}]`)

## So sánh với setup hiện tại của bạn

### Bạn đang dùng:
- **Framework**: TanStack Start v1.132.0
- **Router**: TanStack Router v1.132.0
- **nuqs**: v2.8.6
- **NuqsAdapter**: `nuqs/adapters/tanstack-router`
- **Zod**: v4.3.5 (⚠️ Major version 4 - có thể có breaking changes)

### Zod Schema cho filters:
```typescript
filters: z.any().optional() // Hiện tại
```

### useDataTable options:
```typescript
{
  shallow: true, // Đã thử cả false
  enableAdvancedFilter: true,
  clearOnDefault: true,
}
```

## Điểm cần chú ý đặc biệt

1. **Zod 4 vs Zod 3**: Hầu hết các dự án hiện tại dùng Zod 3.x. Zod 4 có breaking changes đáng kể. Kiểm tra dự án hoạt động dùng version nào.

2. **TanStack Start**: Đây là meta-framework mới, có thể có edge cases chưa được giải quyết với nuqs integration.

3. **validateSearch + nuqs**: Có thể có conflict giữa TanStack Router's validateSearch transforming URL params và nuqs trying to read/write the same params.

## Câu hỏi cần trả lời

1. Dự án hoạt động có dùng `validateSearch` với Zod schema cho `filters` không? Hay họ để `filters` hoàn toàn do nuqs quản lý?

2. Khi filter được apply, có full page navigation xảy ra không hay chỉ là URL update?

3. Data refetch được trigger bằng cách nào khi filter thay đổi?

## Link tham khảo

- **tablecn (sadmann7)**: https://github.com/sadmann7/table-cn
  - Dự án gốc của DiceUI Table components
  - Dùng Next.js App Router

- **DiceUI Official**: https://www.diceui.com/docs/components/data-table
  - Documentation chính thức

- **nuqs TanStack Router Adapter**: https://nuqs.47ng.com/docs/adapters/tanstack-router
  - Có thể có notes về integration issues

## Giả thuyết chính

Conflict giữa TanStack Router's URL state management (via `validateSearch`) và nuqs's URL state management (via `useQueryState`) khi cả hai đều try to own/transform cùng một URL parameter (`filters`).

**Giải pháp tiềm năng**: Không include `filters` trong TanStack Router's `validateSearch` schema, để nuqs có toàn quyền quản lý parameter này.
