import commonFields from '../commomFields';
export default {
  name: 'Loại vật tư |||| Loại vật tư',
  titleList: 'Loại vật tư',
  fields: {
    type: 'Nhóm vật tư',
    name: 'Tên loại vật tư',
    id: 'ID',
    slug: 'Slug',
    searchType: 'Tìm tên loại vật tư',
    ...commonFields,
  },
  createMatType: 'Thêm loại vật tư',
  editMatType: 'Sửa loại vật tư',
  viewMatType: 'Xem loại vật tư',
  deleteMatType: 'Xoá loại vật tư',
};
