// theme/themeConfig.js
export const themeConfig = {
  token: {
    colorPrimary: '#1E40AF', // Màu xanh dương đậm (Royal Blue)
    colorInfo: '#1E40AF',
    borderRadius: 12,         // Bo góc mềm mại, hiện đại
    fontFamily: "'Inter', sans-serif", // Font chữ sạch sẽ
    wireframe: false,
  },
  components: {
    Button: {
      colorPrimary: '#1E40AF',
      algorithm: true, // Tự động tạo màu hover/active đẹp
      controlHeight: 40,
      fontWeight: 600,
    },
    Menu: {
      itemSelectedColor: '#1E40AF',
      itemSelectedBg: 'rgba(30, 64, 175, 0.05)',
      itemHoverColor: '#1E40AF',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    }
  },
};