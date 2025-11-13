# Hướng dẫn Tailwind CSS

## Framework đang sử dụng

Project này đang sử dụng **Tailwind CSS v4.1.3** - một utility-first CSS framework.

## Website chính thức

📚 **Tài liệu chính thức**: https://tailwindcss.com

## Giải thích className trong code

Ví dụ từ `App.tsx`:
```tsx
className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col gap-3"
```

### Phân tích từng phần:

1. **`fixed`** - Position fixed (giống `position: fixed` trong CSS)
   - Docs: https://tailwindcss.com/docs/position#fixed

2. **`top-4`** - Top spacing 4 (1rem = 16px)
   - Docs: https://tailwindcss.com/docs/top-right-bottom-left
   - `top-4` = `top: 1rem` (16px)
   - `top-6` = `top: 1.5rem` (24px)

3. **`right-4`** - Right spacing 4
   - Tương tự như `top-4`

4. **`md:top-6`** - Responsive breakpoint
   - `md:` = Medium screen (≥768px)
   - Trên màn hình ≥768px, dùng `top-6` thay vì `top-4`
   - Docs: https://tailwindcss.com/docs/responsive-design

5. **`z-50`** - Z-index 50
   - Docs: https://tailwindcss.com/docs/z-index

6. **`flex`** - Display flex
   - Docs: https://tailwindcss.com/docs/display#flex

7. **`flex-col`** - Flex direction column
   - Docs: https://tailwindcss.com/docs/flex-direction

8. **`gap-3`** - Gap spacing 3 (0.75rem = 12px)
   - Docs: https://tailwindcss.com/docs/gap

## Các tính năng chính

### 1. Utility Classes
- Mỗi class = một CSS property
- Ví dụ: `bg-blue-500` = `background-color: rgb(59 130 246)`

### 2. Responsive Design
- Prefix: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Ví dụ: `md:flex` = flex trên màn hình ≥768px

### 3. Dark Mode
- Prefix: `dark:`
- Ví dụ: `dark:bg-gray-900` = background khi dark mode

### 4. Hover & Focus States
- Prefix: `hover:`, `focus:`, `active:`
- Ví dụ: `hover:bg-blue-600`

## Tài liệu tham khảo

### 1. Tailwind CSS Official Docs
- **URL**: https://tailwindcss.com/docs
- **Nội dung**: 
  - Tất cả utility classes
  - Responsive design
  - Dark mode
  - Customization
  - Plugins

### 2. Tailwind CSS v4 (mới nhất)
- **URL**: https://tailwindcss.com/docs/v4-beta
- **Thay đổi**: 
  - CSS-first configuration
  - Improved performance
  - New features

### 3. Tailwind UI Components
- **URL**: https://tailwindui.com
- **Nội dung**: 
  - Pre-built components
  - Templates
  - Examples

### 4. Tailwind Play (Online Editor)
- **URL**: https://play.tailwindcss.com
- **Nội dung**: 
  - Test Tailwind classes online
  - See results instantly

## Các utility classes thường dùng trong project

### Spacing
- `p-4` = padding: 1rem
- `m-4` = margin: 1rem
- `px-4` = padding-left + padding-right
- `py-4` = padding-top + padding-bottom
- `gap-4` = gap: 1rem (flex/grid)

### Colors
- `bg-blue-500` = background color
- `text-gray-700` = text color
- `border-gray-200` = border color

### Typography
- `text-sm` = font-size: 0.875rem
- `text-lg` = font-size: 1.125rem
- `font-bold` = font-weight: 700

### Layout
- `flex` = display: flex
- `grid` = display: grid
- `hidden` = display: none
- `block` = display: block

### Position
- `relative`, `absolute`, `fixed`, `sticky`

### Sizing
- `w-full` = width: 100%
- `h-screen` = height: 100vh
- `w-12` = width: 3rem (48px)

## Cách học Tailwind CSS

1. **Bắt đầu với Docs**: https://tailwindcss.com/docs
2. **Xem Examples**: https://tailwindui.com/components
3. **Thực hành**: Dùng Tailwind Play để test
4. **Đọc code**: Xem các component trong `src/components/ui/`

## Lưu ý

- Tailwind CSS v4 có syntax mới, nhưng vẫn tương thích với v3
- Project này dùng Tailwind v4.1.3
- Các component UI dùng Radix UI + Tailwind CSS

