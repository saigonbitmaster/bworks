# Dma - summaryQuantity Api
Thống kê sản lượng toàn bộ mạng nước
## Params
- current: 
  - Kiểu Date
  - default là ngày giờ hiện tại (moment())
## Flow:
  - Thực hiện aggregation lấy toàn bộ Data logger thuộc Dma cấp 1 với middle = false (không phải là trung gian)
  - Thực hiện aggregation lấy sản lượng hôm nay, hôm qua
  - Thực hiện aggregation lấy sản lượng trong tháng
  - Tổng hợp kết quả, trả về cho client

