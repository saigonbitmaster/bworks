import commonFields from '../commomFields';
export default {
  name: 'Vị trí',
  fields: {
    name: 'Tên vị trí',
    position: 'Toạ độ',
    elevation: 'Độ cao',
    ...commonFields,
  },
  position: 'Chỉ định vị trí (*)',
};
