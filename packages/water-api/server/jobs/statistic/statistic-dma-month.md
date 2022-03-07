# Thống kê lưu lượng, áp lực theo tháng
## Lấy thời gian nhỏ nhất của LogFlowLogger có status là init
- Status là init
- Sort tăng dần theo logTime
- Limit 1
## Lấy Tất cả Dma và logger của từng dma đó
- ... Tham khảo code
## Thống kê
- MinFlow (Tổng chỉ số đồng hồ cuối tháng)
- MaxFlow (Tổng chỉ số đồng hồ đầu tháng)
- LogTime (Start of month)
- MissingLogger([{key, lastLogTime}])
- Raw:
  - Array
    - key
    - maxFlow
    - minFlow

