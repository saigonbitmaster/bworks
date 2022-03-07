# MaterialUse - summaryDataLogger Api
 Thống kê số lượng, tình trạng data logger
## Params: No
## Flow:
  - Thực hiện aggregation lấy tổng hợp số lượng data logger từ model MaterialUse
  - Kết quả: 
  ```javascript
  {
    warn: 1,
    bad: 2,
    total: 13, // kể cả logger đang hoạt động bình thường
  }
  ```