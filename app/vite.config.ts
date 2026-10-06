import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],build:{target:'es2022',minify:'esbuild',rollupOptions:{output:{manualChunks:{pdf:['pdf-lib','pdfjs-dist']}}}},server:{port:5173}});
